// Canonical-host enforcement for QOS.
// Per 005 Operations/Directives/cloudflare_pages_tool_wisdom.md §Patterns.
// quietlyos.org is canonical; .com and www subdomains 301 to it.

const CANONICAL_HOST = 'quietlyos.org';

export async function onRequest(context) {
	const url = new URL(context.request.url);
	const host = url.hostname;

	if (host.endsWith('.pages.dev') || host === 'localhost' || host === '127.0.0.1') {
		return context.next();
	}

	if (host !== CANONICAL_HOST) {
		return Response.redirect(
			`https://${CANONICAL_HOST}${url.pathname}${url.search}`,
			301
		);
	}

	return context.next();
}
