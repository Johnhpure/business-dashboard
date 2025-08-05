import React from 'react';
import { KPICard } from './KPICard';

import { useDashboardStore } from '../../stores/dashboardStore';
import { TrendingUp, Store, Users, Coins, Briefcase } from 'lucide-react';

export const KPIGrid: React.FC = () => {
  const { data, loading } = useDashboardStore();

  if (!data) return null;

  const kpiItems = [
    {
      id: 'revenue',
      title: '总交易金额',
      value: data.overview.revenue.value,
      unit: '元',
      trend: data.overview.revenue.trend,
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'stores',
      title: '活跃商户',
      value: data.overview.stores.value,
      unit: '家',
      trend: data.overview.stores.trend,
      icon: Store,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'users',
      title: '活跃用户',
      value: data.overview.users.value,
      unit: '人',
      trend: data.overview.users.trend,
      icon: Users,
      color: 'from-orange-500 to-yellow-600'
    },
    {
      id: 'business',
      title: '认证商务',
      value: data.overview.business.value,
      unit: '人',
      trend: data.overview.business.trend,
      icon: Briefcase,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'dividend',
      title: '分红池余额',
      value: data.overview.dividend.value,
      unit: '元',
      trend: data.overview.dividend.trend,
      icon: Coins,
      color: 'from-red-500 to-pink-600',
      showProgress: true,
      progress: data.dividend.progress
    }
  ];

  return (
    <section className="space-y-6">
      {/* KPI卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiItems.map((item, index) => (
          <KPICard
            key={item.id}
            {...item}
            loading={loading}
            delay={index * 100}
          />
        ))}
      </div>
    </section>
  );
};