// 뉴스 수집 API
// Finnhub (무료, 금융 뉴스 특화)

interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  related: string[];
}

interface CollectedNews {
  title: string;
  summary: string;
  source: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  related_symbols: string[];
}

// Finnhub 뉴스 조회 (미국 주식)
export async function fetchUSNews(): Promise<CollectedNews[]> {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      console.warn('FINNHUB_API_KEY not set, using mock data');
      return getMockUSNews();
    }

    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Finnhub API failed');
    }

    const articles: NewsArticle[] = await response.json();
    
    return articles.slice(0, 10).map(article => ({
      title: article.title,
      summary: article.summary || '',
      source: article.source,
      url: article.url,
      sentiment: 'neutral' as const,
      related_symbols: article.related || [],
    }));
  } catch (error) {
    console.error('Failed to fetch US news:', error);
    return getMockUSNews();
  }
}

// 네이버 금융 뉴스 (한국 주식) - RSS 활용
export async function fetchKRNews(): Promise<CollectedNews[]> {
  try {
    // 네이버 금융 뉴스 RSS
    const response = await fetch(
      'https://news.google.com/rss/search?q=코스피+주식&hl=ko&gl=KR&ceid=KR:ko'
    );

    if (!response.ok) {
      throw new Error('Google News RSS failed');
    }

    const xml = await response.text();
    const articles = parseRSSNews(xml);
    
    return articles.slice(0, 10);
  } catch (error) {
    console.error('Failed to fetch KR news:', error);
    return getMockKRNews();
  }
}

// RSS XML 파싱
function parseRSSNews(xml: string): CollectedNews[] {
  const items: CollectedNews[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title>([\s\S]*?)<\/title>/;
  const linkRegex = /<link>([\s\S]*?)<\/link>/;
  const sourceRegex = /<source[^>]*>([\s\S]*?)<\/source>/;

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title = titleRegex.exec(item)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
    const url = linkRegex.exec(item)?.[1]?.trim() || '';
    const source = sourceRegex.exec(item)?.[1]?.trim() || 'Google News';

    if (title) {
      items.push({
        title,
        summary: '',
        source,
        url,
        sentiment: 'neutral',
        related_symbols: [],
      });
    }
  }

  return items;
}

// Mock 데이터 (API 키 없을 때)
function getMockUSNews(): CollectedNews[] {
  return [
    {
      title: 'Fed Signals Potential Rate Cuts in 2026',
      summary: 'Federal Reserve officials indicated openness to rate cuts amid cooling inflation.',
      source: 'Reuters',
      url: 'https://reuters.com',
      sentiment: 'positive',
      related_symbols: ['SPY', 'QQQ'],
    },
    {
      title: 'NVIDIA Unveils Next-Gen AI Chips',
      summary: 'NVIDIA announced its latest AI accelerator with 2x performance improvement.',
      source: 'Bloomberg',
      url: 'https://bloomberg.com',
      sentiment: 'positive',
      related_symbols: ['NVDA'],
    },
    {
      title: 'Tesla Recalls 500K Vehicles',
      summary: 'Tesla issues recall for Model 3 and Model Y over software concerns.',
      source: 'CNBC',
      url: 'https://cnbc.com',
      sentiment: 'negative',
      related_symbols: ['TSLA'],
    },
  ];
}

function getMockKRNews(): CollectedNews[] {
  return [
    {
      title: '삼성전자, AI 반도체 수주 급증... 실적 기대감',
      summary: '삼성전자가 글로벌 빅테크 기업들로부터 AI 반도체 수주가 급증하며 실적 개선 기대감이 커지고 있다.',
      source: '한국경제',
      url: 'https://hankyung.com',
      sentiment: 'positive',
      related_symbols: ['005930'],
    },
    {
      title: '코스피, 외국인 매수세에 상승 마감',
      summary: '외국인 투자자들의 순매수가 이어지며 코스피가 상승 마감했다.',
      source: '연합뉴스',
      url: 'https://yna.co.kr',
      sentiment: 'positive',
      related_symbols: [],
    },
    {
      title: 'SK하이닉스, HBM 공급 계약 체결',
      summary: 'SK하이닉스가 주요 AI 기업과 HBM 장기 공급 계약을 체결했다.',
      source: '매일경제',
      url: 'https://mk.co.kr',
      sentiment: 'positive',
      related_symbols: ['000660'],
    },
  ];
}
