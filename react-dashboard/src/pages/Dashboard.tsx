import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import KPIGrid from '../components/kpi/KPIGrid';
import MapContainer from '../components/charts/MapContainer';
import DividendCardsContainer from '../components/dividend/DividendCardsContainer';
import RevenueChart from '../components/charts/RevenueChart';
import DividendRoundChart from '../components/charts/DividendRoundChart';
import DividendCountChart from '../components/charts/DividendCountChart';
import UserActivityChart from '../components/charts/UserActivityChart';
import StoreRanking from '../components/rankings/StoreRanking';
import BusinessRanking from '../components/rankings/BusinessRanking';
import UserConsumptionRanking from '../components/rankings/UserConsumptionRanking';

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <KPIGrid />

      {/* 地图和图表区域 */}
      <section className="visualization-section">
        <div className="viz-grid">
          <MapContainer />
          <DividendCardsContainer />
        </div>
      </section>

      {/* 图表分析区域 */}
      <section className="charts-section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <DividendRoundChart />
          <DividendCountChart />
          <div className="lg:col-span-2">
            <UserActivityChart />
          </div>
        </div>
      </section>

      {/* 排行榜区域 */}
      <section className="rankings-section mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StoreRanking />
          <BusinessRanking />
          <UserConsumptionRanking />
        </div>
      </section>
    </MainLayout>
  );
};

export default Dashboard;