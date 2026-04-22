// Pacific timezone utility per 005 Operations/Directives/timezone_standard.md
// QOS is a public landing page; dates render from WORKING_MANUAL.md entries.
// Never use raw new Date() for date boundaries. Always route through these helpers.

const PACIFIC = 'America/Los_Angeles';

export function getPacificDate(d: Date = new Date()): string {
	return d.toLocaleDateString('en-CA', { timeZone: PACIFIC });
}

export function formatPacificDate(iso: string): string {
	// Accepts YYYY-MM-DD; renders "April 22, 2026"
	const [y, m, day] = iso.split('-').map(Number);
	const d = new Date(Date.UTC(y, m - 1, day, 12, 0, 0));
	return d.toLocaleDateString('en-US', {
		timeZone: PACIFIC,
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function getPacificTimestamp(d: Date = new Date()): string {
	return d.toLocaleString('en-US', {
		timeZone: PACIFIC,
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		timeZoneName: 'short'
	});
}
