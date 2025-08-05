import { create } from 'zustand';
import type { DashboardStore, FilterState, DashboardData } from '../types/dashboard';
import { generateMockData } from '../services/mockData';

const initialFilters: FilterState = {
  timeRange: 'month',
  province: '',
  city: '',
  district: '',
  roles: ['partners', 'business', 'stores', 'users'],
  round: 25,
};

export const useDashboardStore = create<DashboardStore>()((set, get) => ({
  // 初始状态
  data: null,
  loading: false,
  error: null,
  filters: initialFilters,

  // 设置数据
  setData: (data: DashboardData) => {
    set({ data, error: null });
  },

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  // 设置错误
  setError: (error: string | null) => {
    set({ error, loading: false });
  },

  // 更新筛选条件
  setFilters: (newFilters: Partial<FilterState>) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    set({ filters: updatedFilters });
    
    // 筛选条件变化时自动重新获取数据
    get().fetchData();
  },

  // 获取数据
  fetchData: async () => {
    const { filters, setLoading, setData, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 生成模拟数据
      const data = generateMockData(filters);
      setData(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(error instanceof Error ? error.message : '数据获取失败');
    } finally {
      setLoading(false);
    }
  },

  // 刷新数据
  refreshData: async () => {
    await get().fetchData();
  },
}));