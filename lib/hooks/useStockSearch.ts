'use client';

import { useState, useCallback } from 'react';

interface SearchResult {
  symbol: string;
  name: string;
  market: 'KR' | 'US';
}

// 자체 API로 검색 (한글/영문/티커 모두 지원)
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

      const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();
      setResults(data.results || []);
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
