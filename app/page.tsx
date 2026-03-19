export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* 네비게이션 바 */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Stock Info</span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              시장
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              포트폴리오
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              뉴스
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <header className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-4">
            실시간 시세 업데이트 중 <span className="animate-pulse-slow">●</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            스마트한 투자를 위한
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              실시간 주식 정보
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            주요 종목의 실시간 시세와 차트 분석으로 더 나은 투자 결정을 내리세요
          </p>
        </header>

        {/* 주요 기능 카드 */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon="📊"
            title="실시간 시세"
            description="주요 종목의 실시간 시세를 확인하세요"
          />
          <FeatureCard
            icon="📈"
            title="차트 분석"
            description="다양한 기술적 지표로 분석하세요"
          />
          <FeatureCard
            icon="🔔"
            title="알림 설정"
            description="가격 알림으로 기회를 놓치지 마세요"
          />
        </div>

        {/* 인기 종목 섹션 */}
        <section className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              인기 종목
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              2026.03.20 기준
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* 시장 현황 */}
        <div className="grid md:grid-cols-3 gap-6">
          <MarketIndexCard 
            name="코스피" 
            value="2,645.85" 
            change="+15.32 (+0.58%)" 
            positive 
          />
          <MarketIndexCard 
            name="코스닥" 
            value="785.42" 
            change="-3.21 (-0.41%)" 
          />
          <MarketIndexCard 
            name="환율 (USD/KRW)" 
            value="1,342.50" 
            change="+5.20 (+0.39%)" 
            positive 
          />
        </div>
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
    <div className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-800 p-8 transition-all duration-300 hover:-translate-y-1">
      <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

// 주식 카드 컴포넌트
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
    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
    : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
  
  return (
    <button 
      className="w-full text-left bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:-translate-y-0.5 group"
      aria-label={`${name} 상세 보기`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">{code}</span>
        </div>
        <svg 
          className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {price}
        <span className="text-sm font-normal text-gray-500 ml-1">원</span>
      </p>
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-sm font-semibold ${changeColor}`}>
        <span>{positive ? '▲' : '▼'}</span>
        <span>{change}</span>
        <span className="text-xs opacity-80">{amount}</span>
      </div>
    </button>
  );
}

// 시장 지수 카드 컴포넌트
function MarketIndexCard({ 
  name, 
  value, 
  change, 
  positive 
}: { 
  name: string; 
  value: string; 
  change: string; 
  positive?: boolean;
}) {
  const changeColor = positive 
    ? 'text-red-600 dark:text-red-400' 
    : 'text-blue-600 dark:text-blue-400';

  return (
    <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {name}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </p>
      <p className={`text-sm font-semibold ${changeColor} flex items-center gap-1`}>
        <span>{positive ? '▲' : '▼'}</span>
        {change}
      </p>
    </div>
  );
}
