// 주식 데이터 fetcher
// 한국 주식: Yahoo Finance (.KS = 코스피, .KQ = 코스닥)
// 미국 주식: Yahoo Finance (심볼 그대로)

interface YahooQuote {
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

// Yahoo Finance에서 시세 조회
export async function fetchStockPrice(symbol: string, market: 'KR' | 'US'): Promise<StockData | null> {
  try {
    // 한국 주식은 .KS (코스피) 또는 .KQ (코스닥) 붙임
    const yahooSymbol = market === 'KR' ? `${symbol}.KS` : symbol;
    
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      // 코스피에서 못 찾으면 코스닥 시도
      if (market === 'KR') {
        const kosdaq = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.KQ?interval=1d&range=1d`,
          { next: { revalidate: 60 } }
        );
        if (!kosdaq.ok) return null;
        const kq = await kosdaq.json();
        return parseYahooResponse(kq, symbol);
      }
      return null;
    }

    const data = await response.json();
    return parseYahooResponse(data, symbol);
  } catch (error) {
    console.error(`Failed to fetch ${symbol}:`, error);
    return null;
  }
}

function parseYahooResponse(data: any, symbol: string): StockData | null {
  try {
    const quote = data.chart.result[0];
    const meta = quote.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose || meta.chartPreviousClose;
    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;

    return {
      symbol,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: meta.regularMarketVolume || 0,
    };
  } catch {
    return null;
  }
}

// 여러 종목 한번에 조회
export async function fetchMultipleStocks(
  symbols: { symbol: string; market: 'KR' | 'US' }[]
): Promise<Map<string, StockData>> {
  const results = new Map<string, StockData>();
  
  // 병렬 처리 (5개씩 배치)
  const batchSize = 5;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const promises = batch.map(({ symbol, market }) => 
      fetchStockPrice(symbol, market)
    );
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach((result, idx) => {
      if (result) {
        results.set(batch[idx].symbol, result);
      }
    });
    
    // Rate limit 방지
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}

// 시장 지수 조회
export async function fetchMarketIndex(symbol: string): Promise<StockData | null> {
  const indexSymbols: Record<string, string> = {
    'KOSPI': '^KS11',
    'KOSDAQ': '^KQ11', 
    'DJI': '^DJI',
    'IXIC': '^IXIC',
    'SPX': '^GSPC',
  };

  const yahooSymbol = indexSymbols[symbol] || symbol;
  
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return parseYahooResponse(data, symbol);
  } catch (error) {
    console.error(`Failed to fetch index ${symbol}:`, error);
    return null;
  }
}
