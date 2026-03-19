import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchMultipleStocks, fetchMarketIndex } from '@/lib/stock-api';

// POST /api/stocks/refresh - 주식 데이터 갱신
// Vercel Cron에서 호출하거나 수동 호출 가능
export async function POST(request: NextRequest) {
  try {
    // 인증 체크 (Vercel Cron 또는 Bearer 토큰)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Vercel Cron 호출인 경우
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // 개발 환경에서는 허용
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 1. DB에서 모든 종목 조회
    const { data: stocks, error: fetchError } = await supabase
      .from('stocks')
      .select('id, symbol, market');

    if (fetchError || !stocks) {
      return NextResponse.json(
        { error: 'Failed to fetch stocks from DB' },
        { status: 500 }
      );
    }

    // 2. Yahoo Finance에서 시세 조회
    const stockList = stocks.map(s => ({ 
      symbol: s.symbol, 
      market: s.market as 'KR' | 'US' 
    }));
    const priceData = await fetchMultipleStocks(stockList);

    // 3. DB 업데이트
    const updates = stocks
      .filter(s => priceData.has(s.symbol))
      .map(s => {
        const price = priceData.get(s.symbol)!;
        return supabase
          .from('stocks')
          .update({
            price: price.price,
            change: price.change,
            change_percent: price.changePercent,
            volume: price.volume,
            updated_at: new Date().toISOString(),
          })
          .eq('id', s.id);
      });

    await Promise.all(updates);

    // 4. 시장 지수 갱신
    const indices = ['KOSPI', 'KOSDAQ', 'DJI', 'IXIC', 'SPX'];
    for (const idx of indices) {
      const indexData = await fetchMarketIndex(idx);
      if (indexData) {
        await supabase
          .from('market_indices')
          .update({
            value: indexData.price,
            change: indexData.change,
            change_percent: indexData.changePercent,
            updated_at: new Date().toISOString(),
          })
          .eq('symbol', idx);
      }
    }

    return NextResponse.json({
      success: true,
      updated: priceData.size,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh stock data' },
      { status: 500 }
    );
  }
}
