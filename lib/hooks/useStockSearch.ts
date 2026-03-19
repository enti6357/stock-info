'use client';

import { useState, useCallback } from 'react';

interface SearchResult {
  symbol: string;
  name: string;
  market: 'KR' | 'US';
  price?: number;
  change_percent?: number;
}

// Yahoo Finance에서 실시간 검색
export function useStockSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Yahoo Finance 검색 API
      const res = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`
      );

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();
      const quotes = data.quotes || [];

      const searchResults: SearchResult[] = quotes
        .filter((q: any) => q.quoteType === 'EQUITY')
        .map((q: any) => {
          // 한국 주식 판별 (.KS, .KQ)
          const isKR = q.symbol.endsWith('.KS') || q.symbol.endsWith('.KQ');
          const symbol = isKR ? q.symbol.replace(/\.(KS|KQ)$/, '') : q.symbol;

          return {
            symbol,
            name: q.shortname || q.longname || q.symbol,
            market: isKR ? 'KR' : 'US',
          };
        });

      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clear };
}
