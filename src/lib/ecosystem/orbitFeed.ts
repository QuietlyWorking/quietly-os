/**
 * The QWF app list behind the "Part of something bigger" section.
 *
 * Why: every QWF app used to carry its own hand-copied list, and by October 2026 eleven copies
 * disagreed. The list now lives in ONE place, the QWU ecosystem registry (the `orbit` block on each
 * app), served by the Digital Twin feed the Universe page already reads. This file reads that feed
 * in the browser, and falls back to the built-in copy below when the feed cannot be reached, so the
 * section always renders.
 *
 * Who belongs in the orbit, in what order, with which words, is a DATA decision made in the
 * registry, never here. The built-in copy is a snapshot of the registry on 2026-10-17; refresh it
 * when the list changes, but a stale copy only shows while the feed is down.
 *
 * Kept identical across every QWF app that renders the section. Framework-free on purpose.
 */

export const ORBIT_FEED_URL = 'https://twin.quietlyworking.org/api/ecosystem?category=app';

/** The only three stage labels a visitor sees. "IN PRODUCTION" is retired: we meant "not open
 *  yet" and visitors read it as "live". */
export type OrbitStage = 'Live' | 'Early access' | 'Being built';

export interface OrbitApp {
	id: string;
	name: string;
	blurb: string;
	stage: OrbitStage;
	/** null when the app has no public page to send people to yet. */
	url: string | null;
	/** Link text; null exactly when url is null. */
	cta: string | null;
}

const STAGE_LABEL: Record<string, OrbitStage> = {
	production: 'Live',
	alpha: 'Early access',
	building: 'Being built'
};

/** Fewer apps than this means the feed is broken, not that the family shrank. */
const MIN_APPS = 3;

export const ORBIT_FALLBACK: readonly OrbitApp[] = [
	{
		id: 'qwr',
		name: 'Quietly Writing',
		blurb:
			'AI-powered content that captures your voice, remembers your story, and executes your strategy. Every article sounds like it could only come from you.',
		stage: 'Early access',
		url: 'https://quietlywriting.org',
		cta: 'Start writing'
	},
	{
		id: 'qqt',
		name: 'Quietly Quoting',
		blurb:
			'Instant price calculators on your own website, then clear, tiered proposals for the in-home visit.',
		stage: 'Early access',
		url: 'https://quietlyquoting.org',
		cta: 'See how it works'
	},
	{
		id: 'qtr',
		name: 'Quietly Tracking',
		blurb:
			'One link that opens the right landing page for each person, then shows you what happened next.',
		stage: 'Being built',
		url: 'https://quietlytracking.org',
		cta: 'Request access'
	},
	{
		id: 'qnt',
		name: 'Quietly Networking',
		blurb:
			"Run your networking chapter like it deserves. Visitor briefings, mentoring, meetings and recaps... all the stuff spreadsheets can't do.",
		stage: 'Early access',
		url: 'https://quietlynetworking.org',
		cta: 'Start networking'
	},
	{
		id: 'qkn',
		name: 'Quietly Knocking',
		blurb:
			"For outreach that doesn't make people hate you: personalized campaigns, follow-ups and landing pages in one place.",
		stage: 'Being built',
		url: null,
		cta: null
	},
	{
		id: 'qwb',
		name: 'Quietly Webbing',
		blurb:
			'A website you can change by talking. Built so telling your story never becomes the bottleneck.',
		stage: 'Being built',
		url: 'https://quietlywebbing.org',
		cta: 'Follow along'
	},
	{
		id: 'qst',
		name: 'Quietly Storing',
		blurb:
			"A place for everything you'd rather not have to remember. Photograph and label your gear, and a printed QR sticker opens each item's page.",
		stage: 'Early access',
		url: 'https://quietlystoring.org',
		cta: 'Follow along'
	},
	{
		id: 'qpn',
		name: 'Quietly Planning',
		blurb:
			'A planning surface, not a calendar. Commitments go in first; the sheet shows what is left. Paper and screen, one sheet.',
		stage: 'Early access',
		url: 'https://quietlyplanning.org',
		cta: 'Follow along'
	}
];

/** Turn the feed's JSON into the orbit list, or null if it does not look like a healthy feed. */
export function parseOrbitFeed(data: unknown): OrbitApp[] | null {
	const entities = (data as { entities?: unknown } | null)?.entities;
	if (!Array.isArray(entities)) return null;
	const found: { order: number; app: OrbitApp }[] = [];
	for (const raw of entities) {
		if (!raw || typeof raw !== 'object') continue;
		const e = raw as Record<string, unknown>;
		const orbit = e.orbit as Record<string, unknown> | null | undefined;
		if (e.category !== 'app' || !orbit || typeof orbit !== 'object') continue;
		const stage = STAGE_LABEL[String(e.status)];
		if (!stage || typeof e.id !== 'string' || typeof e.name !== 'string') continue;
		if (typeof orbit.blurb !== 'string' || !orbit.blurb.trim()) continue;
		// A link only when the registry says the page is public, and only to a real https page.
		const url =
			e.public_link === true && typeof e.url === 'string' && e.url.startsWith('https://')
				? e.url
				: null;
		const cta = url ? (typeof orbit.cta === 'string' && orbit.cta.trim() ? orbit.cta : 'Take a look') : null;
		found.push({
			order: typeof orbit.order === 'number' ? orbit.order : Number.MAX_SAFE_INTEGER,
			app: { id: e.id, name: e.name, blurb: orbit.blurb, stage, url, cta }
		});
	}
	if (found.length < MIN_APPS) return null;
	return found.sort((a, b) => a.order - b.order).map((f) => f.app);
}

/** Fetch the live list. Resolves to null (never throws) when it cannot be read in time. */
export async function loadOrbitApps(timeoutMs = 5000): Promise<OrbitApp[] | null> {
	const ctl = typeof AbortController === 'undefined' ? null : new AbortController();
	const timer = ctl ? setTimeout(() => ctl.abort(), timeoutMs) : null;
	try {
		const res = await fetch(ORBIT_FEED_URL, {
			headers: { Accept: 'application/json' },
			signal: ctl?.signal
		});
		if (!res.ok) return null;
		return parseOrbitFeed(await res.json());
	} catch {
		return null;
	} finally {
		if (timer) clearTimeout(timer);
	}
}

/** The current app goes first, so it sits at 12 o'clock. Unknown or absent ids change nothing. */
export function currentFirst(apps: readonly OrbitApp[], currentId: string | null): OrbitApp[] {
	const list = [...apps];
	const i = currentId ? list.findIndex((a) => a.id === currentId) : -1;
	if (i > 0) list.unshift(...list.splice(i, 1));
	return list;
}
