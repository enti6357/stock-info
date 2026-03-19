'use client';

import { useState } from 'react';
import { useStocks, useIndices, formatPrice, formatChange, formatPercent, Stock, MarketIndex } from '@/lib/hooks/useStocks';
import SearchBar from '@/components/SearchBar';
import StockChart from '@/components/StockChart';

export default function Home() {
  const [market, setMarket] = useState<'KR' | 'US'>('KR');
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; market: 'KR' | 'US'; name: string } | null>(null);
  
  const { stocks, loading: stocksLoading } = useStocks(market);
  const { indices, loading: indicesLoading } = useIndices();

  const currentIndices = market === 'KR' ? indices.kr : indices.us;

  const handleStockSelect = (symbol: string, stockMarket: 'KR' | 'US', name: string) => {
    setSelectedStock({ symbol, market: stockMarket, name });
  };

  const handleStockClick = (stock: Stock) => {
    setSelectedStock({ symbol: stock.symbol, market: stock.market, name: stock.name });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 네비게이션 바 */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-gray-950/90 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Stock Info</span>
          </div>
          
          {/* 시장 토글 */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setMarket('KR')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                market === 'KR'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              🇰🇷 국내
            </button>
            <button
              onClick={() => setMarket('US')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                market === 'US'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              🇺🇸 미국
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 검색바 - 중앙 정렬, 더 눈에 띄게 */}
        <div className="mb-12 max-w-xl mx-auto">
          <SearchBar onSelect={handleStockSelect} />
        </div>

        {/* 시장 지수 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {market === 'KR' ? '국내 시장' : '미국 시장'}
            </h2>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              실시간
            </span>
          </div>
          
          {indicesLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-3" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {currentIndices.map(index => (
                <MarketIndexCard key={index.id} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* 주식 목록 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {market === 'KR' ? '국내 주식' : '미국 주식'}
            </h2>
          </div>

          {stocksLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 animate-pulse">
                  <div className="flex justify-between">
                    <div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    </div>
                    <div className="text-right">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {stocks.map(stock => (
                <StockCard 
                  key={stock.id} 
                  stock={stock} 
                  onClick={() => handleStockClick(stock)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 차트 모달 */}
      {selectedStock && (
        <StockChart
          symbol={selectedStock.symbol}
          market={selectedStock.market}
          name={selectedStock.name}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}

// 주식 카드 컴포넌트
function StockCard({ stock, onClick }: { stock: Stock; onClick: () => void }) {
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-gray-900 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
      aria-label={`${stock.name} 차트 보기`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate">
              {stock.name}
            </h4>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{stock.symbol}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm font-semibold ${changeColor}`}>
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>{formatChange(Math.abs(stock.change), stock.market)}{stock.market === 'KR' ? '원' : ''}</span>
            <span className="text-gray-400 font-normal">({formatPercent(stock.change_percent)})</span>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {formatPrice(stock.price, stock.market)}
          </p>
          <p className="text-xs text-gray-400 mt-1">{stock.market === 'KR' ? '원' : 'USD'}</p>
        </div>
      </div>
    </button>
  );
}

// 시장 지수 카드 컴포넌트
function MarketIndexCard({ index }: { index: MarketIndex }) {
  const isPositive = index.change >= 0;
  const changeColor = isPositive
    ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
    : 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6">
      <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-3">
        {index.name}
      </p>
      <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
        {index.value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
      </p>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${changeColor}`}>
        <span>{isPositive ? '▲' : '▼'}</span>
        <span>{Math.abs(index.change).toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</span>
        <span className="opacity-70">({formatPercent(index.change_percent)})</span>
      </div>
    </div>
  );
}
