import fs from 'node:fs';
import path from 'node:path';
import { parseWorkingManual } from '$lib/working-manual';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const manualPath = path.join(process.cwd(), 'WORKING_MANUAL.md');
	const raw = fs.readFileSync(manualPath, 'utf-8');
	const entries = parseWorkingManual(raw);
	return { entries };
};
