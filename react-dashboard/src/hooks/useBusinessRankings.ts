import { useQuery } from '@tanstack/react-query';
import DashboardService from '../services/dashboardService';

/**
 * 获取商务排名数据的自定义 Hook
 * @returns {import('@tanstack/react-query').UseQueryResult} a
 */
export const useBusinessRankings = () => {
  return useQuery({
    queryKey: ['businessRankings'],
    queryFn: () => DashboardService.getBusinessRankings(),
  });
};