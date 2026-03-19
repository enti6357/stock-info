import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/news?market=KR|US&date=2026-03-20
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') || 'KR';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (!['KR', 'US'].includes(market)) {
      return NextResponse.json(
        { error: 'Invalid market. Use KR or US' },
        { status: 400 }
      );
    }

    // 뉴스 조회
    const { data: news, error: newsError } = await supabase
      .from('daily_news')
      .select('*')
      .eq('market', market)
      .eq('date', date)
      .order('created_at', { ascending: false });

    // 인사이트 조회
    const { data: insight, error: insightError } = await supabase
      .from('daily_insights')
      .select('*')
      .eq('market', market)
      .eq('date', date)
      .single();

    if (newsError) {
      console.error('News fetch error:', newsError);
    }

    return NextResponse.json({
      market,
      date,
      news: news || [],
      insight: insight || null,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
