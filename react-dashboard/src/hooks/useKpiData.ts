import { useQuery } from '@tanstack/react-query';
import DashboardService from '../services/dashboardService';

/**
 * 获取 KPI 数据的自定义 Hook
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useKpiData = () => {
  return useQuery({
    queryKey: ['kpiData'],
    queryFn: () => DashboardService.getStatistics(),
  });
};