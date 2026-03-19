export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* 헤더 */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            📈 Stock Info
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            실시간 주식 정보를 한눈에
          </p>
        </header>

        {/* 주요 기능 카드 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            인기 종목
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StockCard name="삼성전자" price="71,200" change="+2.3%" positive />
            <StockCard name="SK하이닉스" price="145,000" change="-1.2%" />
            <StockCard name="LG에너지솔루션" price="385,000" change="+0.8%" positive />
            <StockCard name="현대차" price="234,500" change="+1.5%" positive />
          </div>
        </section>
      </div>
    </div>
  );
}

// 기능 카드 컴포넌트
function FeatureCard({ icon, title, description }: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}

// 주식 카드 컴포넌트
function StockCard({ name, price, change, positive }: { 
  name: string; 
  price: string; 
  change: string; 
  positive?: boolean;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 hover:scale-105 transition-transform cursor-pointer">
      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
        {name}
      </h4>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
        {price}원
      </p>
      <p className={`text-sm font-semibold ${
        positive 
          ? 'text-red-600 dark:text-red-400' 
          : 'text-blue-600 dark:text-blue-400'
      }`}>
        {change}
      </p>
    </div>
  );
}
