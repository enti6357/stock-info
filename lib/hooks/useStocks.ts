'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  market: 'KR' | 'US';
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  updated_at: string;
}

export interface MarketIndex {
  id: string;
  symbol: string;
  name: string;
  value: number;
  change: number;
  change_percent: number;
  updated_at: string;
}

interface StocksResponse {
  market: string;
  stocks: Stock[];
  updated_at: string;
}

interface IndicesResponse {
  kr: MarketIndex[];
  us: MarketIndex[];
  updated_at: string;
}

// 주식 데이터 훅
export function useStocks(market: 'KR' | 'US') {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stocks?market=${market}`);
      if (!res.ok) throw new Error('Failed to fetch stocks');
      const data: StocksResponse = await res.json();
      setStocks(data.stocks);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [market]);

  useEffect(() => {
    fetchStocks();
    // 60초마다 자동 갱신
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  return { stocks, loading, error, refetch: fetchStocks };
}

// 시장 지수 훅
export function useIndices() {
  const [indices, setIndices] = useState<{ kr: MarketIndex[]; us: MarketIndex[] }>({ kr: [], us: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIndices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/indices');
      if (!res.ok) throw new Error('Failed to fetch indices');
      const data: IndicesResponse = await res.json();
      setIndices({ kr: data.kr, us: data.us });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndices();
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, [fetchIndices]);

  return { indices, loading, error, refetch: fetchIndices };
}

// 가격 포맷팅 유틸
export function formatPrice(price: number, market: 'KR' | 'US'): string {
  if (market === 'KR') {
    return price.toLocaleString('ko-KR');
  }
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatChange(change: number, market: 'KR' | 'US'): string {
  const sign = change >= 0 ? '+' : '';
  if (market === 'KR') {
    return `${sign}${change.toLocaleString('ko-KR')}`;
  }
  return `${sign}${change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}
