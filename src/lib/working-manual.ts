// Parses WORKING_MANUAL.md into structured entries at build time.
// Format contract (see README.md):
//   ## YYYY-MM-DD... Session Title
//   Body paragraph(s) or bullets.
//
// Separator uses ellipsis to honor the em-dash scrub. Colon also accepted
// as fallback since titles often contain colons ("Phase 1: Values Shipped").
//
// Called from src/routes/+page.server.ts so entries render at build time.

export interface ManualEntry {
	date: string; // YYYY-MM-DD
	title: string;
	html: string; // rendered body HTML
}

export function parseWorkingManual(markdown: string): ManualEntry[] {
	const lines = markdown.split('\n');
	const entries: ManualEntry[] = [];
	let current: { date: string; title: string; body: string[] } | null = null;

	const headingRe = /^##\s+(\d{4}-\d{2}-\d{2})(?:\.{3}|\s*[-:·])\s*(.+)$/;

	for (const line of lines) {
		const m = line.match(headingRe);
		if (m) {
			if (current) entries.push(finalize(current));
			current = { date: m[1], title: m[2].trim(), body: [] };
		} else if (current) {
			current.body.push(line);
		}
	}
	if (current) entries.push(finalize(current));

	entries.sort((a, b) => (a.date < b.date ? 1 : -1));
	return entries;
}

function finalize(c: { date: string; title: string; body: string[] }): ManualEntry {
	return { date: c.date, title: c.title, html: renderBody(c.body.join('\n').trim()) };
}

// Minimal markdown renderer for the body (paragraphs, bullets, inline emphasis, code).
// Full-featured markdown isn't needed here... WORKING_MANUAL entries stay tight.
function renderBody(md: string): string {
	if (!md) return '';

	const blocks = md.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

	const rendered = blocks.map((block) => {
		const lines = block.split('\n');
		const isList = lines.every((l) => /^\s*[-*]\s+/.test(l));
		if (isList) {
			const items = lines.map((l) => l.replace(/^\s*[-*]\s+/, '')).map(inline).map((t) => `<li>${t}</li>`).join('');
			return `<ul class="list-disc pl-6 space-y-1 text-muted-foreground">${items}</ul>`;
		}
		return `<p class="text-muted-foreground leading-relaxed">${inline(block.replace(/\n/g, ' '))}</p>`;
	});

	return rendered.join('\n');
}

function inline(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/`([^`]+)`/g, '<code class="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
