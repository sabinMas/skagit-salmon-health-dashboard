export interface SalmonReturn {
  id: string;
  watershedId: string;
  speciesId: string;
  year: number;
  countEstimate: number;
  method: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
}

const returnsFile = (() => {
  try {
    // Statically imported at build time — regenerate with `npm run data:refresh`
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./real/salmon-returns.json') as {
      fetchedAt: string;
      source: string;
      recordCount: number;
      returns: SalmonReturn[];
    };
  } catch {
    return { fetchedAt: '', source: '', recordCount: 0, returns: [] };
  }
})();

const allReturns: SalmonReturn[] = returnsFile.returns;

/** ISO timestamp of when the seed data was last fetched (for freshness UI). */
export const salmonDataFetchedAt: string = returnsFile.fetchedAt;

export async function getSalmonReturns(
  watershedId?: string,
  speciesId?: string,
  startYear?: number,
  endYear?: number,
): Promise<SalmonReturn[]> {
  let filtered = allReturns;

  if (watershedId && watershedId !== 'all') {
    filtered = filtered.filter((r) => r.watershedId === watershedId);
  }

  if (speciesId && speciesId !== 'all') {
    filtered = filtered.filter((r) => r.speciesId === speciesId);
  }

  if (startYear) {
    filtered = filtered.filter((r) => r.year >= startYear);
  }

  if (endYear) {
    filtered = filtered.filter((r) => r.year <= endYear);
  }

  return filtered;
}
