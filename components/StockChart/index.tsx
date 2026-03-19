'use client';

import { useState, useEffect } from 'react';

interface ChartData {
  timestamp: number;
  price: number;
}

interface StockChartProps {
  symbol: string;
  market: 'KR' | 'US';
  name: string;
  onClose: () => void;
}

export default function StockChart({ symbol, market, name, onClose }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'1d' | '5d' | '1mo' | '3mo' | '1y'>('1mo');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<{ change: number; percent: number } | null>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    fetchChartData();
  }, [symbol, market, range]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      
      // 서버 API를 통해 Yahoo Finance 데이터 가져오기 (CORS 우회)
      const res = await fetch(
        `/api/stocks/chart?symbol=${symbol}&market=${market}&range=${range}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch chart data');
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setChartData(data.chartData || []);
      setCurrentPrice(data.currentPrice);
      
      if (data.change !== undefined) {
        setPriceChange({ 
          change: data.change, 
          percent: data.changePercent 
        });
      }
    } catch (err) {
      console.error('Chart fetch error:', err);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // 차트 그리기 (간단한 SVG 라인 차트)
  const renderChart = () => {
    if (chartData.length === 0) return null;

    const width = 600;
    const height = 300;
    const padding = 40;

    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const xScale = (i: number) => padding + (i / (chartData.length - 1)) * (width - padding * 2);
    const yScale = (price: number) => height - padding - ((price - minPrice) / priceRange) * (height - padding * 2);

    const pathData = chartData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.price)}`)
      .join(' ');

    const isPositive = priceChange && priceChange.change >= 0;
    const lineColor = isPositive ? '#ef4444' : '#3b82f6';

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="mt-4">
        {/* 그리드 라인 */}
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const y = padding + ratio * (height - padding * 2);
          const price = maxPrice - ratio * priceRange;
          return (
            <g key={ratio}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />
              <text x={padding - 8} y={y + 4} textAnchor="end" className="text-xs fill-gray-400">
                {price.toLocaleString(market === 'KR' ? 'ko-KR' : 'en-US', { maximumFractionDigits: 0 })}
              </text>
            </g>
          );
        })}
        
        {/* 차트 라인 */}
        <path d={pathData} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* 그라데이션 영역 */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path 
          d={`${pathData} L ${xScale(chartData.length - 1)} ${height - padding} L ${padding} ${height - padding} Z`} 
          fill="url(#chartGradient)" 
        />
      </svg>
    );
  };

  const formatPrice = (price: number) => {
    if (market === 'KR') {
      return `${price.toLocaleString('ko-KR')}원`;
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  // 백드롭 클릭으로 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl animate-fade-in-up">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h2>
                <span className="text-sm text-gray-400">{symbol}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${market === 'KR' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  {market === 'KR' ? '국내' : '미국'}
                </span>
              </div>
              {currentPrice && (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {formatPrice(currentPrice)}
                  </span>
                  {priceChange && (
                    <span className={`text-lg font-semibold ${priceChange.change >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                      {priceChange.change >= 0 ? '▲' : '▼'} {Math.abs(priceChange.change).toLocaleString()} ({priceChange.percent >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              aria-label="닫기"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 기간 선택 - 터치 타겟 확대 */}
          <div className="flex gap-1 mt-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {(['1d', '5d', '1mo', '3mo', '1y'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  range === r
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {r === '1d' ? '1일' : r === '5d' ? '5일' : r === '1mo' ? '1개월' : r === '3mo' ? '3개월' : '1년'}
              </button>
            ))}
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="p-6">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chartData.length > 0 ? (
            renderChart()
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              차트 데이터를 불러올 수 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
