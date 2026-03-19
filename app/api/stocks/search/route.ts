import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 미국 주요 종목 (DB에 없어도 검색 가능하도록)
const US_STOCKS = [
  { symbol: 'AAPL', name: 'Apple', nameKo: '애플' },
  { symbol: 'MSFT', name: 'Microsoft', nameKo: '마이크로소프트' },
  { symbol: 'GOOGL', name: 'Alphabet', nameKo: '알파벳(구글)' },
  { symbol: 'AMZN', name: 'Amazon', nameKo: '아마존' },
  { symbol: 'NVDA', name: 'NVIDIA', nameKo: '엔비디아' },
  { symbol: 'TSLA', name: 'Tesla', nameKo: '테슬라' },
  { symbol: 'META', name: 'Meta Platforms', nameKo: '메타(페이스북)' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', nameKo: '버크셔해서웨이' },
  { symbol: 'TSM', name: 'Taiwan Semiconductor', nameKo: 'TSMC' },
  { symbol: 'V', name: 'Visa', nameKo: '비자' },
  { symbol: 'JPM', name: 'JPMorgan Chase', nameKo: 'JP모건' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', nameKo: '존슨앤존슨' },
  { symbol: 'WMT', name: 'Walmart', nameKo: '월마트' },
  { symbol: 'MA', name: 'Mastercard', nameKo: '마스터카드' },
  { symbol: 'PG', name: 'Procter & Gamble', nameKo: 'P&G' },
  { symbol: 'XOM', name: 'Exxon Mobil', nameKo: '엑슨모빌' },
  { symbol: 'HD', name: 'Home Depot', nameKo: '홈디포' },
  { symbol: 'CVX', name: 'Chevron', nameKo: '셰브론' },
  { symbol: 'MRK', name: 'Merck', nameKo: '머크' },
  { symbol: 'ABBV', name: 'AbbVie', nameKo: '애브비' },
  { symbol: 'COST', name: 'Costco', nameKo: '코스트코' },
  { symbol: 'AVGO', name: 'Broadcom', nameKo: '브로드컴' },
  { symbol: 'PEP', name: 'PepsiCo', nameKo: '펩시코' },
  { symbol: 'KO', name: 'Coca-Cola', nameKo: '코카콜라' },
  { symbol: 'AMD', name: 'AMD', nameKo: 'AMD' },
  { symbol: 'INTC', name: 'Intel', nameKo: '인텔' },
  { symbol: 'NFLX', name: 'Netflix', nameKo: '넷플릭스' },
  { symbol: 'DIS', name: 'Walt Disney', nameKo: '디즈니' },
  { symbol: 'CRM', name: 'Salesforce', nameKo: '세일즈포스' },
  { symbol: 'ADBE', name: 'Adobe', nameKo: '어도비' },
  { symbol: 'QCOM', name: 'Qualcomm', nameKo: '퀄컴' },
  { symbol: 'PYPL', name: 'PayPal', nameKo: '페이팔' },
  { symbol: 'BABA', name: 'Alibaba', nameKo: '알리바바' },
  { symbol: 'NKE', name: 'Nike', nameKo: '나이키' },
  { symbol: 'MCD', name: 'McDonalds', nameKo: '맥도날드' },
  { symbol: 'SBUX', name: 'Starbucks', nameKo: '스타벅스' },
  { symbol: 'BA', name: 'Boeing', nameKo: '보잉' },
  { symbol: 'IBM', name: 'IBM', nameKo: 'IBM' },
  { symbol: 'GE', name: 'General Electric', nameKo: 'GE' },
  { symbol: 'F', name: 'Ford', nameKo: '포드' },
  { symbol: 'GM', name: 'General Motors', nameKo: 'GM' },
];

// 한국 주요 종목 (DB 백업용)
const KR_STOCKS = [
  { symbol: '005930', name: '삼성전자' },
  { symbol: '000660', name: 'SK하이닉스' },
  { symbol: '373220', name: 'LG에너지솔루션' },
  { symbol: '005380', name: '현대차' },
  { symbol: '035420', name: 'NAVER' },
  { symbol: '035720', name: '카카오' },
  { symbol: '006400', name: '삼성SDI' },
  { symbol: '051910', name: 'LG화학' },
  { symbol: '003670', name: '포스코홀딩스' },
  { symbol: '105560', name: 'KB금융' },
  { symbol: '055550', name: '신한지주' },
  { symbol: '000270', name: '기아' },
  { symbol: '068270', name: '셀트리온' },
  { symbol: '028260', name: '삼성물산' },
  { symbol: '012330', name: '현대모비스' },
  { symbol: '066570', name: 'LG전자' },
  { symbol: '003550', name: 'LG' },
  { symbol: '096770', name: 'SK이노베이션' },
  { symbol: '034730', name: 'SK' },
  { symbol: '015760', name: '한국전력' },
  { symbol: '033780', name: 'KT&G' },
  { symbol: '017670', name: 'SK텔레콤' },
  { symbol: '030200', name: 'KT' },
  { symbol: '086790', name: '하나금융지주' },
  { symbol: '018260', name: '삼성에스디에스' },
  { symbol: '000810', name: '삼성화재' },
  { symbol: '090430', name: '아모레퍼시픽' },
  { symbol: '011170', name: '롯데케미칼' },
  { symbol: '032830', name: '삼성생명' },
  { symbol: '009150', name: '삼성전기' },
  { symbol: '036570', name: '엔씨소프트' },
  { symbol: '251270', name: '넷마블' },
  { symbol: '263750', name: '펄어비스' },
  { symbol: '352820', name: '하이브' },
  { symbol: '259960', name: '크래프톤' },
  { symbol: '377300', name: '카카오페이' },
  { symbol: '403870', name: '카카오뱅크' },
  { symbol: '323410', name: '카카오엔터' },
];

// GET /api/stocks/search?q=삼성
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim().toLowerCase() || '';

    if (!query || query.length < 1) {
      return NextResponse.json({ results: [] });
    }

    const results: Array<{ symbol: string; name: string; market: 'KR' | 'US' }> = [];

    // 1. DB에서 검색 (한국 + 미국)
    const { data: dbStocks } = await supabase
      .from('stocks')
      .select('symbol, name, market')
      .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
      .limit(10);

    if (dbStocks) {
      results.push(...dbStocks.map(s => ({
        symbol: s.symbol,
        name: s.name,
        market: s.market as 'KR' | 'US',
      })));
    }

    // 2. 로컬 한국 종목에서 검색
    const krMatches = KR_STOCKS.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.symbol.includes(query)
    ).map(s => ({ symbol: s.symbol, name: s.name, market: 'KR' as const }));

    // 3. 로컬 미국 종목에서 검색 (한글/영문 모두)
    const usMatches = US_STOCKS.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.nameKo.includes(query) ||
      s.symbol.toLowerCase().includes(query)
    ).map(s => ({ symbol: s.symbol, name: s.name, market: 'US' as const }));

    // 중복 제거하며 합치기
    const seen = new Set(results.map(r => `${r.symbol}-${r.market}`));
    
    for (const match of [...krMatches, ...usMatches]) {
      const key = `${match.symbol}-${match.market}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push(match);
      }
    }

    // 최대 15개 반환
    return NextResponse.json({ 
      results: results.slice(0, 15),
      query,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ results: [], error: 'Search failed' });
  }
}
