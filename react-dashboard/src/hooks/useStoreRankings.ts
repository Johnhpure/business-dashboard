import { useQuery } from '@tanstack/react-query';
import DashboardService from '../services/dashboardService';

/**
 * 获取商户排名数据的自定义 Hook
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useStoreRankings = () => {
  return useQuery({
    queryKey: ['storeRankings'],
    queryFn: () => DashboardService.getStoreRankings(),
  });
};