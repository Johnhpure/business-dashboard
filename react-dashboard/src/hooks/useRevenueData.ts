import { useQuery } from '@tanstack/react-query';
import DashboardService from '../services/dashboardService';

/**
 * 获取收入数据的自定义 Hook
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useRevenueData = () => {
  return useQuery({
    queryKey: ['revenueData'],
    queryFn: () => DashboardService.getRevenueData(),
  });
};