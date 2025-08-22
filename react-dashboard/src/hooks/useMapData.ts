import { useQuery } from '@tanstack/react-query';
import DashboardService from '../services/dashboardService';

/**
 * 获取地图数据的自定义 Hook
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useMapData = () => {
  return useQuery({
    queryKey: ['mapData'],
    queryFn: () => DashboardService.getMapData(),
  });
};