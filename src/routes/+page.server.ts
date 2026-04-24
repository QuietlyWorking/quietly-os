import { parseWorkingManual } from '$lib/working-manual';
import { prepareMap, type DevMapRaw } from '$lib/development-map';
import type { PageServerLoad } from './$types';

// Intentionally NOT prerendered: prerendered HTML is served directly from CF's
// edge, bypassing hooks.server.ts. That breaks canonical-host redirects for `/`
// on quietlyos.com / www.* hosts. SSR lets the hook run on every request.
// The page is still tiny, cacheable at the CDN, and near-instant for repeat hits.
//
// WORKING_MANUAL.md is read at MODULE LOAD (once per worker isolate cold start),
// not per-request, so the SSR overhead is just template rendering.

import workingManualRaw from '../../WORKING_MANUAL.md?raw';
const entries = parseWorkingManual(workingManualRaw);

// QOS.development-map.json is imported as a JSON module (Vite treats it as
// structured data, no ?raw needed). prepareMap() runs the supporter-anonymity
// sweep + em-dash scrub at build time so the client receives already-safe data.
import devMapJson from '../../QOS.development-map.json';
const devMap = prepareMap(devMapJson as unknown as DevMapRaw);

export const load: PageServerLoad = async () => {
	return { entries, devMap };
};
