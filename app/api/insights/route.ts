import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/insights?market=KR|US&date=2026-03-20
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') || 'KR';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_insights')
      .select('*')
      .eq('market', market)
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Insight fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch insight' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      market,
      date,
      insight: data || null,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/insights - 란이 인사이트 생성 시 호출
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { market, date, summary, key_points, outlook } = body;

    if (!market || !date || !summary) {
      return NextResponse.json(
        { error: 'market, date, summary are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('daily_insights')
      .upsert({
        market,
        date,
        summary,
        key_points: key_points || [],
        outlook: outlook || '',
        created_by: 'ran',
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'date,market',
      })
      .select()
      .single();

    if (error) {
      console.error('Insight save error:', error);
      return NextResponse.json(
        { error: 'Failed to save insight' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      insight: data,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
