import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET!;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN!;

// Slack 요청 검증
function verifySlackRequest(body: string, timestamp: string, signature: string): boolean {
  const sigBaseString = `v0:${timestamp}:${body}`;
  const mySignature = 'v0=' + crypto
    .createHmac('sha256', SLACK_SIGNING_SECRET)
    .update(sigBaseString)
    .digest('hex');
  
  return crypto.timingSafeEqual(Buffer.from(mySignature), Buffer.from(signature));
}

// Slack 메시지 전송
async function sendSlackMessage(channel: string, text: string, thread_ts?: string) {
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel,
      text,
      thread_ts,
    }),
  });
}

// 주식 정보 가져오기
async function getStockInfo(query: string): Promise<string> {
  try {
    // 검색
    const searchRes = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/stocks/search?q=${encodeURIComponent(query)}`
    );
    const searchData = await searchRes.json();
    
    if (!searchData.results || searchData.results.length === 0) {
      return `"${query}" 검색 결과가 없습니다.`;
    }

    const stock = searchData.results[0];
    
    // 차트 데이터 (현재가 포함)
    const chartRes = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/stocks/chart?symbol=${stock.symbol}&market=${stock.market}&range=1d`
    );
    const chartData = await chartRes.json();

    if (chartData.error) {
      return `${stock.name} (${stock.symbol}) - 가격 정보를 가져올 수 없습니다.`;
    }

    const price = stock.market === 'KR' 
      ? `${chartData.currentPrice?.toLocaleString()}원`
      : `$${chartData.currentPrice?.toLocaleString()}`;
    
    const changeSign = chartData.change >= 0 ? '+' : '';
    const changeColor = chartData.change >= 0 ? '📈' : '📉';
    
    return `${changeColor} *${stock.name}* (${stock.symbol})\n` +
           `현재가: *${price}*\n` +
           `등락: ${changeSign}${chartData.change?.toLocaleString()} (${changeSign}${chartData.changePercent}%)`;
  } catch (error) {
    console.error('Stock info error:', error);
    return '주식 정보를 가져오는 중 오류가 발생했습니다.';
  }
}

// POST /api/slack/events - Slack Event 수신
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const timestamp = request.headers.get('x-slack-request-timestamp') || '';
    const signature = request.headers.get('x-slack-signature') || '';

    // 개발 환경에서는 검증 스킵
    if (process.env.NODE_ENV === 'production') {
      if (!verifySlackRequest(body, timestamp, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);

    // URL Verification (Slack 앱 설정 시 필요)
    if (payload.type === 'url_verification') {
      return NextResponse.json({ challenge: payload.challenge });
    }

    // Event Callback
    if (payload.type === 'event_callback') {
      const event = payload.event;

      // 봇 자신의 메시지는 무시
      if (event.bot_id) {
        return NextResponse.json({ ok: true });
      }

      // 앱 멘션 또는 DM
      if (event.type === 'app_mention' || event.type === 'message') {
        const text = event.text?.replace(/<@[^>]+>/g, '').trim() || '';
        
        // 주식 명령어 처리
        if (text.startsWith('주식 ') || text.startsWith('stock ')) {
          const query = text.replace(/^(주식|stock)\s+/i, '').trim();
          const response = await getStockInfo(query);
          await sendSlackMessage(event.channel, response, event.thread_ts || event.ts);
        } 
        // 도움말
        else if (text === '도움말' || text === 'help') {
          const helpText = 
            `*엔티 봇 사용법*\n\n` +
            `• \`주식 삼성전자\` - 삼성전자 현재가 조회\n` +
            `• \`주식 AAPL\` - Apple 현재가 조회\n` +
            `• \`주식 테슬라\` - Tesla 현재가 조회\n\n` +
            `웹사이트: https://stock-info-nine.vercel.app`;
          await sendSlackMessage(event.channel, helpText, event.thread_ts || event.ts);
        }
        // 인사
        else if (text.includes('안녕') || text.includes('hello') || text.includes('hi')) {
          await sendSlackMessage(
            event.channel, 
            '안녕하세요! 엔티입니다 🤝\n`도움말`을 입력하면 사용법을 알려드릴게요.',
            event.thread_ts || event.ts
          );
        }
        // 기본 응답
        else if (event.type === 'app_mention') {
          await sendSlackMessage(
            event.channel,
            `무엇을 도와드릴까요? \`도움말\`을 입력해보세요.`,
            event.thread_ts || event.ts
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Slack event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
