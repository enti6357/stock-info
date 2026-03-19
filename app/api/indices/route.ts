import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/indices - 시장 지수 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('market_indices')
      .select('*')
      .order('symbol');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch indices' },
        { status: 500 }
      );
    }

    // 한국/미국 구분
    const kr = data?.filter(i => ['KOSPI', 'KOSDAQ'].includes(i.symbol)) || [];
    const us = data?.filter(i => ['DJI', 'IXIC', 'SPX'].includes(i.symbol)) || [];

    return NextResponse.json({
      kr,
      us,
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
