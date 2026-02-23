// GET /api/wdfw — Serves pre-seeded WDFW salmon return data.
//
// The raw Socrata endpoint (data.wa.gov) returns 11–20 MB and cannot be
// cached by Next.js ISR. Instead, this route serves the pre-processed JSON
// produced by `npm run data:refresh` (scripts/fetch-wdfw.mjs), which is
// 107 KB and fully cacheable.
//
// To refresh the data: npm run data:refresh  (re-fetches from Socrata → writes lib/data/real/salmon-returns.json)

import returnsFile from '@/lib/data/real/salmon-returns.json';

// Static — rebuild triggers a fresh read; no ISR needed since data is refreshed manually.
export const dynamic = 'force-static';

export async function GET() {
  return Response.json(returnsFile);
}
