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

// Generate synthetic data for 2015-2024
function generateMockReturns(): SalmonReturn[] {
  const returns: SalmonReturn[] = [];
  const watershedIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const speciesIds = ['1', '2', '3', '4', '5', '6'];
  
  watershedIds.forEach((watershedId) => {
    speciesIds.forEach((speciesId) => {
      for (let year = 2015; year <= 2024; year++) {
        const baseCount = Math.floor(Math.random() * 5000) + 1000;
        const trend = Math.sin((year - 2015) / 3) * 1000;
        const countEstimate = Math.max(500, Math.floor(baseCount + trend));
        
        returns.push({
          id: `${watershedId}-${speciesId}-${year}`,
          watershedId,
          speciesId,
          year,
          countEstimate,
          method: 'Spawner Survey',
          source: 'WDFW SalmonScape (Mock)',
          confidence: year >= 2022 ? 'high' : 'medium',
        });
      }
    });
  });
  
  return returns;
}

const mockReturns = generateMockReturns();

export async function getSalmonReturns(
  watershedId?: string,
  speciesId?: string,
  startYear?: number,
  endYear?: number
): Promise<SalmonReturn[]> {
  let filtered = mockReturns;
  
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