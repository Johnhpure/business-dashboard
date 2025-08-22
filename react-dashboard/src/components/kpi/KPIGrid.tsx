import KPICard from './KPICard'
import { useKpiData } from '@/hooks/useKpiData'

interface KPIGridProps {
  className?: string
}

/**
 * KPI网格组件
 * 包含主要KPI概览和业务数据概览两个部分
 */
const KPIGrid: React.FC<KPIGridProps> = ({ className = '' }) => {
  const { data, isLoading, isError } = useKpiData()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching data</div>
  }

  if (!data) {
    return <div>No data available</div>
  }

  // The data from the hook is the flat Statistics object.
  // We need to adapt it to the structure expected by KPICard.
  // For now, we'll use the direct values and create dummy "todayNew" values.
  // In a real scenario, the API should provide this data.
  const kpiData = {
    revenue: { value: data.totalRevenue, todayNew: { value: data.revenueGrowth, unit: '%' } },
    stores: { value: data.totalStores, todayNew: { value: data.storeGrowth, unit: '%' } },
    users: { value: data.totalUsers, todayNew: { value: data.userGrowth, unit: '%' } },
    business: { value: data.totalBusinesses, todayNew: { value: data.businessGrowth, unit: '%' } },
    dividend: { value: 0, todayNew: { value: 0, unit: '元' } }, // Placeholder
  }

  const businessData = {
    pointsIssued: { value: 0, todayNew: { value: 0, unit: '点' } }, // Placeholder
    voucherConsumed: { value: 0, todayNew: { value: 0, unit: '元' } }, // Placeholder
    goodPointsConsumed: { value: 0, todayNew: { value: 0, unit: '点' } }, // Placeholder
    voucherWithdrawal: { value: 0, todayNew: { value: 0, unit: '元' } }, // Placeholder
  }


  return (
    <div className={className}>
      {/* KPI概览区域 */}
      <section className="kpi-overview">
        <div className="kpi-grid">
          <KPICard
            kpiType="revenue"
            icon="fas fa-chart-line"
            label="总交易金额"
            value={kpiData.revenue.value}
            unit="元"
            todayNew={kpiData.revenue.todayNew}
          />
          
          <KPICard
            kpiType="stores"
            icon="fas fa-store"
            label="活跃商户"
            value={kpiData.stores.value}
            unit="家"
            todayNew={kpiData.stores.todayNew}
          />
          
          <KPICard
            kpiType="users"
            icon="fas fa-user-friends"
            label="活跃用户"
            value={kpiData.users.value}
            unit="人"
            todayNew={kpiData.users.todayNew}
          />
          
          <KPICard
            kpiType="business"
            icon="fas fa-user-tie"
            label="认证商务"
            value={kpiData.business.value}
            unit="人"
            todayNew={kpiData.business.todayNew}
          />
          
          <KPICard
            kpiType="dividend"
            icon="fas fa-coins"
            label="当前分红池总金额"
            value={kpiData.dividend.value}
            unit="元"
            progress={73}
          />
        </div>
      </section>

      {/* 业务数据概览区域 */}
      <section className="business-overview">
        <div className="business-grid">
          <KPICard
            kpiType="points-issued"
            icon="fas fa-gift"
            label="消费点发放"
            value={businessData.pointsIssued.value}
            unit="点"
            todayNew={businessData.pointsIssued.todayNew}
          />
          
          <KPICard
            kpiType="voucher-consumed"
            icon="fas fa-ticket-alt"
            label="抵用券消费"
            value={businessData.voucherConsumed.value}
            unit="元"
            todayNew={businessData.voucherConsumed.todayNew}
          />
          
          <KPICard
            kpiType="good-points-consumed"
            icon="fas fa-star"
            label="好点消费"
            value={businessData.goodPointsConsumed.value}
            unit="点"
            todayNew={businessData.goodPointsConsumed.todayNew}
          />
          
          <KPICard
            kpiType="voucher-withdrawal"
            icon="fas fa-money-bill-wave"
            label="抵用券提现"
            value={businessData.voucherWithdrawal.value}
            unit="元"
            todayNew={businessData.voucherWithdrawal.todayNew}
          />
        </div>
      </section>
    </div>
  )
}

export default KPIGrid