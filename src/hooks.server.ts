import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

// Canonical-host enforcement.
// SvelteKit owns all routing on CF Pages (its _worker.js intercepts everything
// before Pages Functions run), so functions/_middleware.js is ignored. The
// redirect must live here. Per cloudflare_pages_tool_wisdom.md §Gotchas.
//
// During prerendering (build time), `event.url` is synthetic and accessing
// `url.search` throws. Use `building` to short-circuit.

const CANONICAL_HOST = 'quietlyos.org';

export const handle: Handle = async ({ event, resolve }) => {
	if (building) return resolve(event);

	const host = event.url.hostname;

	// Pass through for preview deployments, local dev, and the canonical host.
	if (
		host === CANONICAL_HOST ||
		host.endsWith('.pages.dev') ||
		host === 'localhost' ||
		host === '127.0.0.1'
	) {
		return resolve(event);
	}

	// Everything else (www.quietlyos.org, quietlyos.com, www.quietlyos.com, ...) 301s to canonical.
	throw redirect(
		301,
		`https://${CANONICAL_HOST}${event.url.pathname}${event.url.search}`
	);
};
