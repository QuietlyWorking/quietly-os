# v1.1.0
"""
Purpose: Offline interaction + accessibility gap detector for frontend code ... the
         behavior/a11y sibling of detect_ui_slop.py (which covers VISUAL tells).
         Enforces the machine-checkable subset of the QWF UI Interaction &
         Accessibility Standard (005 Operations/Directives/
         qwf_ui_interaction_and_accessibility_standard.md): the interaction-pattern
         rules a static scan can judge from source with acceptable precision ...
         pointer-only drag/resize with no keyboard path, sub-24px touch targets,
         modal dialogs missing keyboard dismiss / accessible name, click-to-select
         on non-button elements with no keyboard path, custom controls missing
         required ARIA state, hover-only tooltips.

         NATIVE, in-trust-boundary, like detect_ui_slop.py: no network, no npx, no
         Node, no third-party code, no install footprint. Deliberately low
         false-positive: a NON-modal role="dialog" is NOT flagged for missing
         aria-modal (aria-modal is a modal-only attribute); aria-hidden decorative
         elements are exempt from the keyboard rules.

         It does NOT claim to verify all of WCAG 2.2 AA. The human-audit remainder
         (focus order/trap/return at runtime, contrast, SR announcement quality,
         reduced-motion completeness, semantic correctness of a name) lives in the
         directive's Human-audit checklist, not here.

Inputs:  One or more file/dir paths (.svelte .tsx .jsx .vue .html .htm .astro).
Outputs: Findings (rule id, severity, file:line, snippet, note) as text, --json,
         or --github (GitHub Actions workflow-command annotations, so CI surfaces
         each finding inline on the changed lines of a pull request). The three
         output modes are mutually chosen; --github and --json do NOT alter the
         text output or the exit code (additive, v1.1.0).
         JSON envelope: {"success", "data": {"count", "findings"}, "error"}.
Side effects: Read-only filesystem scan. No network. No writes.
"""

import os
import re
import sys
import json
import argparse

SCAN_EXTS = (".svelte", ".vue", ".tsx", ".jsx", ".html", ".htm", ".astro")

SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".svelte-kit",
             ".next", ".astro", "vendor", "coverage", ".cache"}

SEVERITY_ORDER = {"warning": 0, "info": 1}

# Min touch/pointer target per WCAG 2.2 SC 2.5.8 (Target Size Minimum), CSS px.
MIN_TARGET_PX = 24

# Selector name fragments that mark an element as an interactive affordance
# (so a sub-24px size on it is a real target-size gap, not a decorative dot).
AFFORDANCE_SELECTOR_RE = re.compile(
    r"(grip|handle|resize|drag|fold|collapse|close|dismiss|btn|button|"
    r"toggle|switch|swatch|chip|tab|thumb|knob|stepper)", re.I)

# Handler/element hints that mark a pointer interaction as a DRAG or RESIZE
# (the two APG-"if you can drag it you must offer a keyboard path" cases).
DRAG_RESIZE_HINT_RE = re.compile(r"(drag|resize|grip|handle|move|reposition)", re.I)

# Any keyboard affordance in the component that would satisfy the keyboard-path rule.
KEY_AFFORDANCE_RE = re.compile(
    r"onkeydown|onkeyup|onkeypress|on:key|role=[\"']slider[\"']|"
    r"type=[\"']range[\"']|arrowup|arrowdown|arrowleft|arrowright", re.I)


def _finding(rule, severity, name, file, line, snippet, note=""):
    return {"rule": rule, "severity": severity, "name": name, "file": file,
            "line": line, "snippet": snippet.strip()[:120], "note": note}


def _line_of(text, offset):
    return text.count("\n", 0, offset) + 1


def _enclosing_tag(text, idx):
    """Return the opening-tag substring (<tag ... >) that contains offset idx,
    or "" if none. Scans back to the nearest unclosed '<' and forward to '>'."""
    start = text.rfind("<", 0, idx)
    if start == -1:
        return ""
    end = text.find(">", idx)
    if end == -1:
        return ""
    seg = text[start:end + 1]
    # guard: if a '>' appeared before idx inside the window, we straddled tags
    if ">" in text[start:idx]:
        return ""
    return seg


def _style_blocks(text, ext):
    """Yield (css_text, base_offset). For .svelte/.vue/.html: the <style> bodies.
    For raw CSS-ish we would scan whole-file, but this checker's exts are markup."""
    for m in re.finditer(r"<style[^>]*>(.*?)</style>", text, re.S | re.I):
        yield m.group(1), m.start(1)


def _css_rules(css, base):
    """Yield (selector, body, body_base_offset) for simple `sel { ... }` blocks."""
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
        yield m.group(1).strip(), m.group(2), base + m.start(2)


def _px(val):
    m = re.search(r"(\d+(?:\.\d+)?)\s*px", val)
    return float(m.group(1)) if m else None


def _interactive_classes(text):
    """Return the set of CSS class names that land on a genuinely INTERACTIVE
    element in the markup ... so the target-size rule flags a real hit target
    (a <button>, a handler-bearing grip) and NOT a decorative aria-hidden dot or
    a visual toggle-knob whose real control is a sibling <input>. Precision-first,
    like detect_ui_slop.py's card-context guard on side-tab borders."""
    interactive = set()
    for m in re.finditer(r"<([a-zA-Z][\w-]*)\b([^>]*)>", text, re.S):
        tag = m.group(1).lower()
        attrs = m.group(2)
        al = attrs.lower()
        is_interactive = (
            tag in ("button", "input", "select", "textarea")
            or (tag == "a" and "href" in al)
            or re.search(r"on:?click|onpointerdown|onmousedown|onkeydown|"
                         r"onkeyup|onkeypress|on:key", al)
            or re.search(r"\brole\s*=", al)
            or re.search(r"\btabindex\s*=", al)
        )
        if not is_interactive:
            continue
        cm = re.search(r'class\s*=\s*["\']([^"\']+)["\']', attrs)
        if cm:
            for cls in cm.group(1).split():
                interactive.add(cls)
    return interactive


def detect_file(path):
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            text = fh.read()
    except OSError:
        return []
    findings = []
    ext = os.path.splitext(path)[1].lower()
    low = text.lower()
    has_key_affordance = bool(KEY_AFFORDANCE_RE.search(text))

    # ---- P1/P3: pointer drag/resize with NO keyboard path -------------------
    # Flag each pointer-down binding whose handler/context looks like drag/resize
    # when the component offers no keyboard affordance at all.
    if not has_key_affordance:
        for m in re.finditer(r"on(?:pointerdown|mousedown)\s*=\s*\{?\s*([A-Za-z_]\w*)",
                             text, re.I):
            handler = m.group(1)
            # Look at the enclosing tag for a class/name hint too.
            tag = _enclosing_tag(text, m.start())
            ctx = handler + " " + tag
            if DRAG_RESIZE_HINT_RE.search(ctx):
                findings.append(_finding(
                    "P1/P3-pointer-no-keyboard", "warning",
                    "Pointer-only drag/resize (no keyboard path)",
                    path, _line_of(text, m.start()),
                    m.group(0),
                    f"'{handler}' starts a pointer drag/resize but the component "
                    "has no keyboard affordance (arrow-key nudge/resize, presets, "
                    "or a reset control). APG: if you can drag it, you must offer "
                    "a keyboard path. [Standard P1/P3]"))

    # ---- P3/QWF-3: sub-24px interactive target ------------------------------
    interactive_cls = _interactive_classes(text)
    for css, base in _style_blocks(text, ext):
        for sel, body, boff in _css_rules(css, base):
            if not AFFORDANCE_SELECTOR_RE.search(sel):
                continue
            # Only flag a class that actually lands on an interactive element
            # (skip decorative aria-hidden dots / visual toggle-knobs).
            sel_classes = set(re.findall(r"\.([\w-]+)", sel))
            if sel_classes and not (sel_classes & interactive_cls):
                continue
            w = h = None
            wl = hl = None
            for dm in re.finditer(r"(width|height|min-width|min-height)\s*:\s*([^;]+);?",
                                  body, re.I):
                prop = dm.group(1).lower()
                px = _px(dm.group(2))
                if px is None:
                    continue
                lineno = _line_of(text, boff + dm.start())
                if prop in ("width", "min-width"):
                    w, wl = px, lineno
                else:
                    h, hl = px, lineno
            # A real target-size gap: BOTH dimensions present and BOTH < 24px
            # (avoids flagging a thin-but-tall or wide-but-short decorative rule).
            if w is not None and h is not None and w < MIN_TARGET_PX and h < MIN_TARGET_PX:
                findings.append(_finding(
                    "P3/QWF-3-target-size", "warning",
                    f"Interactive target {int(w)}x{int(h)}px < {MIN_TARGET_PX}px min",
                    path, wl or hl, f"{sel.strip()[:60]} {{ width:{int(w)}px; height:{int(h)}px }}",
                    f"WCAG 2.2 SC 2.5.8 Target Size (Minimum) is {MIN_TARGET_PX}x"
                    f"{MIN_TARGET_PX} CSS px; prefer 44x44 for primary touch "
                    "(Android-first, QWF-3). [Standard P3/QWF-3]"))

    # ---- P4: modal dialog missing keyboard dismiss --------------------------
    # Only MODAL dialogs need aria-modal + Esc. A non-modal role="dialog"
    # (floating panel) is correctly WITHOUT aria-modal, so we key off aria-modal.
    if re.search(r"aria-modal\s*=\s*[\"']?\{?\s*true", text, re.I) or \
       re.search(r'aria-modal\s*=\s*["\']true', text, re.I):
        has_esc = bool(re.search(r"['\"]Escape['\"]|key\s*===?\s*['\"]Escape['\"]|"
                                 r"e\.key\s*===?\s*['\"]Escape['\"]", text))
        if not has_esc:
            mm = re.search(r"aria-modal", text)
            findings.append(_finding(
                "P4-modal-no-esc", "warning",
                "Modal dialog with no Escape-to-close handler",
                path, _line_of(text, mm.start()), "aria-modal=\"true\"",
                "An aria-modal dialog must close on Esc and manage focus "
                "(enter on open, trap while open, return on close). No Escape "
                "handler found in this component. [Standard P4]"))

    # ---- P1/P4: role="dialog" with no accessible name -----------------------
    for m in re.finditer(r'role\s*=\s*["\']dialog["\']', text, re.I):
        tag = _enclosing_tag(text, m.start())
        if tag and not re.search(r"aria-label(ledby)?\s*=", tag, re.I):
            findings.append(_finding(
                "P1/P4-dialog-no-name", "warning",
                "role=\"dialog\" with no accessible name",
                path, _line_of(text, m.start()), tag.strip()[:80],
                "A dialog needs aria-label or aria-labelledby so its purpose is "
                "announced. [Standard P1/P4]"))

    # ---- P7: click-to-select/activate on a non-button, no keyboard ----------
    # <div|span|li ... onclick=...> with no role=button, no tabindex, no onkeydown,
    # and not aria-hidden (decorative highlights are exempt).
    for m in re.finditer(r"<(div|span|li|section|a)\b([^>]*?)on:?click\s*=",
                         text, re.I | re.S):
        tag = _enclosing_tag(text, m.start())
        if not tag:
            continue
        tl = tag.lower()
        if "aria-hidden" in tl and "true" in tl:
            continue
        if "role=\"button\"" in tl or "role='button'" in tl:
            continue
        if "tabindex" in tl:
            continue
        if re.search(r"onkeydown|onkeyup|onkeypress|on:key", tl):
            continue
        # skip a real anchor with href (native keyboard)
        if m.group(1).lower() == "a" and "href" in tl:
            continue
        findings.append(_finding(
            "P7-select-no-keyboard", "warning",
            "Click handler on non-button element with no keyboard path",
            path, _line_of(text, m.start()), tag.strip()[:80],
            "A click-activatable element must be focusable (tabindex=0) + "
            "operable by Enter/Space + focus-visible, or use a <button>. "
            "[Standard P7]"))

    # ---- P9: role="switch" missing aria-checked -----------------------------
    for m in re.finditer(r'role\s*=\s*["\']switch["\']', text, re.I):
        tag = _enclosing_tag(text, m.start())
        if tag and "aria-checked" not in tag.lower():
            findings.append(_finding(
                "P9-switch-no-checked", "warning",
                "role=\"switch\" missing aria-checked",
                path, _line_of(text, m.start()), tag.strip()[:80],
                "A switch must expose aria-checked state. [Standard P9]"))

    # ---- P6: hover-only tooltip (no focus counterpart) ----------------------
    tip_hover = re.search(r"(tooltip|\btip\b|help)[^\n]{0,40}"
                          r"(onmouseenter|onmouseover|:hover)", low)
    if tip_hover:
        has_focus = bool(re.search(r"(onfocus|:focus|focus-within)", low)) or \
            bool(re.search(r"(tooltip|\btip\b|help)[^\n]{0,40}(onfocus|:focus)", low))
        if not has_focus:
            findings.append(_finding(
                "P6-tooltip-hover-only", "info",
                "Tooltip/help may be hover-only (verify focus + tap path)",
                path, _line_of(text, tip_hover.start()), tip_hover.group(0)[:80],
                "WCAG 1.4.13: content on hover must also appear on focus, be "
                "dismissible, and not obscure the control; Android-first needs a "
                "tap path too. Verify manually. [Standard P6]"))

    findings.sort(key=lambda f: (SEVERITY_ORDER.get(f["severity"], 9), f["line"]))
    return findings


def scan(paths):
    files = []
    for p in paths:
        if os.path.isfile(p):
            files.append(p)
        elif os.path.isdir(p):
            for dp, dirs, fs in os.walk(p):
                dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
                for f in fs:
                    if os.path.splitext(f)[1].lower() in SCAN_EXTS:
                        files.append(os.path.join(dp, f))
    all_findings = []
    for f in sorted(set(files)):
        all_findings.extend(detect_file(f))
    return all_findings


def _rel(path, root):
    try:
        return os.path.relpath(path, root)
    except ValueError:
        return path


def _print_human(findings, root):
    if not findings:
        print("No interaction/accessibility gaps detected (machine-checkable subset). Clean.")
        return
    warn = [f for f in findings if f["severity"] == "warning"]
    info = [f for f in findings if f["severity"] == "info"]
    print(f"{len(findings)} finding(s): {len(warn)} warning, {len(info)} info\n")
    for f in findings:
        tag = f["severity"].upper()
        rel = _rel(f["file"], root)
        print(f"  [{tag}] {f['name']}  ({f['rule']})")
        print(f"        {rel}:{f['line']}   {f['snippet']}")
        if f["note"]:
            print(f"        -> {f['note']}")
        print()


# Map our severities to GitHub Actions annotation levels. `info` findings are
# advisory (verify-manually rows), so they annotate as `notice`, not `warning`.
_GH_LEVEL = {"warning": "warning", "info": "notice"}


def _gh_escape(s):
    """Escape a string for the MESSAGE part of a GitHub workflow command
    (%, carriage-return, newline). Property values use the same set."""
    return (s.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A"))


def _print_github(findings, root):
    """Emit GitHub Actions workflow-command annotations so each finding renders
    inline on the changed line in a pull request's Files-changed + Checks tabs.
    Format: ::<level> file=<path>,line=<n>,title=<rule>::<message>
    Path is repo-relative (relative to --root) so GitHub can anchor the line.
    Additive: does not change text/--json output or the exit code."""
    for f in findings:
        level = _GH_LEVEL.get(f["severity"], "warning")
        rel = _rel(f["file"], root)
        title = _gh_escape(f"a11y {f['rule']}")
        msg = f"{f['name']}"
        if f.get("note"):
            msg += f" ... {f['note']}"
        msg = _gh_escape(msg)
        # file/line are property values; escape commas/colons defensively.
        pf = _gh_escape(rel)
        print(f"::{level} file={pf},line={f['line']},title={title}::{msg}")
    warn = sum(1 for f in findings if f["severity"] == "warning")
    info = len(findings) - warn
    # A neutral summary line (not an annotation) so the raw log states the total.
    print(f"a11y checker: {len(findings)} finding(s) ... {warn} warning, {info} info "
          f"(machine-checkable subset).")


def main():
    ap = argparse.ArgumentParser(
        description="Offline UI interaction + accessibility gap detector "
                    "(machine-checkable subset of the QWF UI standard; no network).")
    ap.add_argument("paths", nargs="+", help="Files or directories to scan.")
    ap.add_argument("--json", action="store_true", dest="as_json")
    ap.add_argument("--github", action="store_true", dest="as_github",
                    help="Emit GitHub Actions annotations (for CI PR inline notes).")
    ap.add_argument("--root", default=os.getcwd(),
                    help="Base path for relative display (default: cwd).")
    args = ap.parse_args()

    findings = scan(args.paths)
    if args.as_json:
        print(json.dumps({"success": True,
                          "data": {"count": len(findings), "findings": findings},
                          "error": None}, indent=2))
    elif args.as_github:
        _print_github(findings, args.root)
    else:
        _print_human(findings, args.root)
    # Exit non-zero if any WARNING-severity gap (so it can gate a build later).
    # UNCHANGED by output mode: warn-only CI swallows this; the fail-flip honors it.
    return 1 if any(f["severity"] == "warning" for f in findings) else 0


if __name__ == "__main__":
    sys.exit(main())
