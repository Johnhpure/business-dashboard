import { useQuery } from '@tanstack/react-query';
import DashboardService from '../services/dashboardService';

/**
 * 获取分红数据的自定义 Hook
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useDividendData = () => {
  return useQuery({
    queryKey: ['dividendData'],
    queryFn: () => DashboardService.getDividendData(),
  });
};