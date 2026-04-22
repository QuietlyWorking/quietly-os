#!/usr/bin/env node
// Em-dash scrub — fails build if any em dash (—) or en-dash-as-punctuation (–) appears
// in user-authored content. This site is the public face of a standard that forbids em dashes.
// Eat your own dog food. Per memory/feedback_eat_your_own_dog_food.md.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EXTS = new Set(['.md', '.svelte', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.html', '.css']);
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', '.git', 'build', 'dist']);

// Heading separator lines (##  — Title) are allowed to use em dash in markdown headings
// but WORKING_MANUAL uses "YYYY-MM-DD — Title" format. The scrub intentionally catches this
// so the rule is respected everywhere. The parser in working-manual.ts accepts both
// "YYYY-MM-DD — Title" and "YYYY-MM-DD - Title" — so convert em dashes in headings to
// regular dashes (or ellipsis) on the rare authoring side.

// Exception allowlist: this file itself (it must name the characters it scrubs for),
// and the em-dash-scrub regex literals in any tooling.
const ALLOWLIST_FILES = new Set([
	'scripts/em-dash-scrub.mjs'
]);

const offences = [];

function walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full);
		} else if (EXTS.has(path.extname(entry.name))) {
			const rel = path.relative(ROOT, full);
			if (ALLOWLIST_FILES.has(rel)) continue;
			scan(full, rel);
		}
	}
}

function scan(full, rel) {
	const text = fs.readFileSync(full, 'utf-8');
	const lines = text.split('\n');
	lines.forEach((line, i) => {
		// Em dash: U+2014. Always a violation.
		const emIdx = line.indexOf('—');
		if (emIdx !== -1) {
			offences.push({ file: rel, line: i + 1, col: emIdx + 1, char: '—', snippet: line.trim().slice(0, 120) });
		}
		// En dash: U+2013. Allowed in numeric ranges like "2024–2026" but not as sentence punctuation.
		// Heuristic: en dash with space on either side = sentence punctuation = violation.
		const enRe = /(^|\s)[–](?=\s|$)/g;
		let m;
		while ((m = enRe.exec(line)) !== null) {
			offences.push({
				file: rel,
				line: i + 1,
				col: m.index + (m[1] ? m[1].length : 0) + 1,
				char: '–',
				snippet: line.trim().slice(0, 120)
			});
		}
	});
}

walk(ROOT);

if (offences.length === 0) {
	console.log('✓ em-dash scrub clean');
	process.exit(0);
}

console.error(`✗ em-dash scrub failed. ${offences.length} offence(s):\n`);
for (const o of offences) {
	console.error(`  ${o.file}:${o.line}:${o.col}  "${o.char}"  ${o.snippet}`);
}
console.error(`\nRule: use ellipsis (...) not em dashes (see memory/feedback_eat_your_own_dog_food.md).`);
process.exit(1);
