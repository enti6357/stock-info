import { NextRequest, NextResponse } from 'next/server';

// GET /api/stocks/chart?symbol=005930&market=KR&range=1mo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const market = searchParams.get('market') || 'US';
    const range = searchParams.get('range') || '1mo';

    if (!symbol) {
      return NextResponse.json({ error: 'symbol is required' }, { status: 400 });
    }

    const interval = range === '1d' ? '5m' : range === '5d' ? '15m' : '1d';
    
    // 한국 주식은 .KS 또는 .KQ 붙임
    let yahooSymbol = market === 'KR' ? `${symbol}.KS` : symbol;

    let response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${interval}&range=${range}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );

    // 코스피에서 못 찾으면 코스닥 시도
    if (!response.ok && market === 'KR') {
      yahooSymbol = `${symbol}.KQ`;
      response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${interval}&range=${range}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }
      );
    }

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) {
      return NextResponse.json({ error: 'No chart data' }, { status: 404 });
    }

    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};
    const closes = quotes.close || [];

    // 차트 데이터 가공
    const chartData = timestamps
      .map((ts: number, i: number) => ({
        timestamp: ts * 1000,
        price: closes[i],
      }))
      .filter((d: { price: number | null }) => d.price != null);

    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose || meta.chartPreviousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    return NextResponse.json({
      symbol,
      market,
      range,
      currentPrice,
      previousClose,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      chartData,
    });
  } catch (error) {
    console.error('Chart API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
