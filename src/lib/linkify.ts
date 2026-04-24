// Wraps "TIG" and "Chaplain TIG" mentions in anchor tags pointing at
// chaplaintig.com. Escapes HTML first (defensive, since callers may be
// passing text from JSON or markdown that has never been sanitized) then
// applies the link transform. Output is HTML and must be consumed with
// Svelte's {@html ...}, never plain {...}.
//
// Rationale: quietlyos.org is the public face of QOS and most visitors
// will not know who Chaplain TIG is. Linking every mention empowers
// anyone interested to dive deeper on chaplaintig.com.

const TIG_PATTERN = /\bChaplain TIG\b|\bTIG\b/g;

const LINK_CLASSES =
	'text-foreground underline decoration-accent/50 underline-offset-2 hover:decoration-accent';

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function makeAnchor(label: string): string {
	return `<a href="https://chaplaintig.com" target="_blank" rel="noopener noreferrer" class="${LINK_CLASSES}">${label}</a>`;
}

// Escape HTML first, then linkify TIG mentions. Safe for untrusted-ish
// input from JSON / markdown. Returns HTML; use with {@html ...}.
export function linkifyTIG(text: string | undefined | null): string {
	if (!text) return '';
	const escaped = escapeHtml(text);
	return escaped.replace(TIG_PATTERN, (m) => makeAnchor(m));
}

// Linkify without the initial HTML-escape. Use when the input is already
// escaped or already contains intentional HTML (e.g., inside the
// working-manual inline renderer that has just converted backticks to
// <code> and ** to <strong>). The TIG regex does not match inside <a>
// tags today because no caller produces those... but if that changes,
// add an `inAnchor` state machine here.
export function linkifyTIGPostEscape(html: string): string {
	if (!html) return '';
	return html.replace(TIG_PATTERN, (m) => makeAnchor(m));
}
