export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 네비게이션 바 */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-gray-950/90 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Stock Info</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="#" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              시장
            </a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              뉴스
            </a>
            <a href="#" className="px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all ml-2">
              시작하기
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* 히어로 섹션 - 토스 스타일: 대담한 타이포그래피 */}
        <header className="mb-20 animate-fade-in-up">
          <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-4">
            실시간 주식 정보
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
            투자, 이제<br />
            더 쉽게
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
            복잡한 주식 정보를 한눈에 파악하고<br />
            더 나은 투자 결정을 내리세요
          </p>
        </header>

        {/* 시장 현황 - 숫자 강조 */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              오늘의 시장
            </h2>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              실시간
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <MarketIndexCard 
              name="코스피" 
              value="2,645.85" 
              change="+15.32"
              changePercent="+0.58%"
              positive 
            />
            <MarketIndexCard 
              name="코스닥" 
              value="785.42" 
              change="-3.21"
              changePercent="-0.41%"
            />
            <MarketIndexCard 
              name="USD/KRW" 
              value="1,342.50" 
              change="+5.20"
              changePercent="+0.39%"
              positive 
            />
          </div>
        </section>

        {/* 인기 종목 섹션 */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              인기 종목
            </h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline underline-offset-4">
              전체보기 →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <StockCard 
              name="삼성전자" 
              code="005930"
              price="71,200" 
              change="+2.3%" 
              amount="+1,600"
              positive 
            />
            <StockCard 
              name="SK하이닉스" 
              code="000660"
              price="145,000" 
              change="-1.2%"
              amount="-1,800"
            />
            <StockCard 
              name="LG에너지솔루션" 
              code="373220"
              price="385,000" 
              change="+0.8%" 
              amount="+3,000"
              positive 
            />
            <StockCard 
              name="현대차" 
              code="005380"
              price="234,500" 
              change="+1.5%" 
              amount="+3,500"
              positive 
            />
          </div>
        </section>

        {/* 주요 기능 카드 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            주요 기능
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              icon="📊"
              title="실시간 시세"
              description="주요 종목의 실시간 시세를 한눈에"
            />
            <FeatureCard
              icon="📈"
              title="차트 분석"
              description="다양한 기술적 지표로 스마트하게"
            />
            <FeatureCard
              icon="🔔"
              title="가격 알림"
              description="목표가 도달 시 바로 알림"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// 기능 카드 컴포넌트
function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
      <div className="text-4xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// 주식 카드 컴포넌트 - 토스 스타일: 숫자 강조, 넉넉한 터치 영역
function StockCard({ 
  name, 
  code,
  price, 
  change,
  amount,
  positive 
}: { 
  name: string;
  code: string;
  price: string; 
  change: string;
  amount: string;
  positive?: boolean;
}) {
  const changeColor = positive 
    ? 'text-red-500 dark:text-red-400' 
    : 'text-blue-500 dark:text-blue-400';
  
  return (
    <button 
      className="w-full text-left bg-white dark:bg-gray-900 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group min-h-[120px]"
      aria-label={`${name} 상세 보기`}
    >
      <div className="flex items-center justify-between">
        {/* 왼쪽: 종목 정보 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">
              {name}
            </h4>
            <span className="text-xs text-gray-400 dark:text-gray-500">{code}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm font-semibold ${changeColor}`}>
            <span>{positive ? '▲' : '▼'}</span>
            <span>{amount}원</span>
            <span className="text-gray-400 font-normal">({change})</span>
          </div>
        </div>
        
        {/* 오른쪽: 가격 (크게 강조) */}
        <div className="text-right">
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {price}
          </p>
          <p className="text-xs text-gray-400 mt-1">원</p>
        </div>
      </div>
    </button>
  );
}

// 시장 지수 카드 컴포넌트 - 토스 스타일: 숫자 최우선
function MarketIndexCard({ 
  name, 
  value, 
  change,
  changePercent,
  positive 
}: { 
  name: string; 
  value: string; 
  change: string;
  changePercent: string;
  positive?: boolean;
}) {
  const changeColor = positive 
    ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10' 
    : 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6">
      <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-3">
        {name}
      </p>
      <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
        {value}
      </p>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${changeColor}`}>
        <span>{positive ? '▲' : '▼'}</span>
        <span>{change}</span>
        <span className="opacity-70">{changePercent}</span>
      </div>
    </div>
  );
}
