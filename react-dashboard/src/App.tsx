import { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { KPIGrid } from './components/kpi/KPIGrid';
import { DividendProgress } from './components/kpi/DividendProgress';
import { DividendDistributionCard } from './components/kpi/DividendDistributionCard';
import { MapVisualization } from './components/charts/MapVisualization';
import { RevenueChart } from './components/charts/RevenueChart';
import { DividendDistribution } from './components/charts/DividendDistribution';
import { PartnerRanking } from './components/rankings/PartnerRanking';
import { StoreRanking } from './components/rankings/StoreRanking';
import { useDashboardStore } from './stores/dashboardStore';

function App() {
  const { fetchData } = useDashboardStore();

  useEffect(() => {
    // 初始化数据
    fetchData();
  }, [fetchData]);

  return (
    <div className="dark">
      <MainLayout>
        {/* KPI概览区域 */}
        <KPIGrid />
        
        {/* 地图和分红进度区域 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 地图可视化 - 占2列 */}
          <div className="lg:col-span-2">
            <MapVisualization />
          </div>
          
          {/* 分红进度 - 占1列 */}
          <div className="lg:col-span-1">
            <DividendProgress />
          </div>
        </section>

        {/* 图表分析区域 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart />
          <DividendDistribution />
        </section>

        {/* 分红分布卡片区域 */}
        <section className="grid grid-cols-1 gap-6 mb-6">
          <DividendDistributionCard />
        </section>

        {/* 排行榜区域 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PartnerRanking />
          <StoreRanking />
        </section>
      </MainLayout>
    </div>
  );
}

export default App;
