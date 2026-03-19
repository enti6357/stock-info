import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchKRNews, fetchUSNews } from '@/lib/news-api';

// POST /api/news/collect - 뉴스 수집 (Cron에서 호출)
export async function POST(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 한국 뉴스 수집
    const krNews = await fetchKRNews();
    for (const news of krNews) {
      await supabase.from('daily_news').upsert({
        date: today,
        market: 'KR',
        title: news.title,
        summary: news.summary,
        source: news.source,
        url: news.url,
        sentiment: news.sentiment,
        related_symbols: news.related_symbols,
      }, {
        onConflict: 'id',
        ignoreDuplicates: true,
      });
    }

    // 미국 뉴스 수집
    const usNews = await fetchUSNews();
    for (const news of usNews) {
      await supabase.from('daily_news').upsert({
        date: today,
        market: 'US',
        title: news.title,
        summary: news.summary,
        source: news.source,
        url: news.url,
        sentiment: news.sentiment,
        related_symbols: news.related_symbols,
      }, {
        onConflict: 'id',
        ignoreDuplicates: true,
      });
    }

    return NextResponse.json({
      success: true,
      collected: {
        kr: krNews.length,
        us: usNews.length,
      },
      date: today,
    });
  } catch (error) {
    console.error('News collection error:', error);
    return NextResponse.json(
      { error: 'Failed to collect news' },
      { status: 500 }
    );
  }
}
