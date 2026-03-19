import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/stocks?market=KR|US
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') || 'KR';

    if (!['KR', 'US'].includes(market)) {
      return NextResponse.json(
        { error: 'Invalid market. Use KR or US' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .eq('market', market)
      .order('symbol');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stocks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      market,
      stocks: data,
      updated_at: data?.[0]?.updated_at || null,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
