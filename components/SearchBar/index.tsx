'use client';

import { useState, useRef, useEffect } from 'react';
import { useStockSearch } from '@/lib/hooks/useStockSearch';

interface SearchBarProps {
  onSelect: (symbol: string, market: 'KR' | 'US', name: string) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, loading, search, clear } = useStockSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 디바운스 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        search(query);
        setIsOpen(true);
      } else {
        clear();
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search, clear]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string, market: 'KR' | 'US', name: string) => {
    onSelect(symbol, market, name);
    setQuery('');
    setIsOpen(false);
    clear();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="종목명 또는 심볼 검색"
          className="w-full px-5 py-4 pl-14 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
        />
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.length > 0 ? (
            results.map((result, idx) => (
              <button
                key={`${result.symbol}-${result.market}-${idx}`}
                onClick={() => handleSelect(result.symbol, result.market, result.name)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{result.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      result.market === 'KR' 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {result.market === 'KR' ? '국내' : '미국'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{result.symbol}</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))
          ) : query.length > 0 && !loading ? (
            <div className="px-5 py-8 text-center">
              <p className="text-gray-400 dark:text-gray-500">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">다른 키워드로 검색해보세요</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
