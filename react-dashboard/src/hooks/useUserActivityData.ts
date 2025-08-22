import { useQuery } from '@tanstack/react-query';
import DashboardService from '../services/dashboardService';

/**
 * 获取用户活动数据的自定义 Hook
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useUserActivityData = () => {
  return useQuery({
    queryKey: ['userActivityData'],
    queryFn: () => DashboardService.getUserActivityData(),
  });
};