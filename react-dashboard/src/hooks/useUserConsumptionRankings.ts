import { useQuery } from '@tanstack/react-query';
import DashboardService from '../services/dashboardService';

/**
 * 获取用户消费排名数据的自定义 Hook
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useUserConsumptionRankings = () => {
  return useQuery({
    queryKey: ['userConsumptionRankings'],
    queryFn: () => DashboardService.getUserConsumptionRankings(),
  });
};