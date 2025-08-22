import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  Statistics,
  RevenueChartData,
  DividendChartData,
  MapData,
  BusinessRanking,
  StoreRanking,
  UserConsumptionRanking,
  FilterOptions,
  SortOptions,
  DashboardConfig,
  AsyncState,
} from '@/types'

/**
 * Dashboard状态接口
 */
interface DashboardState {
  // 基础统计数据
  statistics: AsyncState<Statistics>
  
  // 图表数据
  revenueData: AsyncState<RevenueChartData>
  dividendData: AsyncState<DividendChartData>
  mapData: AsyncState<MapData[]>
  
  // 排行榜数据
  businessRankings: AsyncState<BusinessRanking[]>
  storeRankings: AsyncState<StoreRanking[]>
  userConsumptionRankings: AsyncState<UserConsumptionRanking[]>
  
  // 筛选和排序
  filters: FilterOptions
  sortOptions: SortOptions
  
  // 配置
  config: DashboardConfig
  
  // 刷新状态
  isRefreshing: boolean
  lastRefreshTime: string | null
  
  // Actions
  setStatistics: (data: Statistics) => void
  setRevenueData: (data: RevenueChartData) => void
  setDividendData: (data: DividendChartData) => void
  setMapData: (data: MapData[]) => void
  setBusinessRankings: (data: BusinessRanking[]) => void
  setStoreRankings: (data: StoreRanking[]) => void
  setUserConsumptionRankings: (data: UserConsumptionRanking[]) => void
  
  setFilters: (filters: Partial<FilterOptions>) => void
  setSortOptions: (sort: SortOptions) => void
  setConfig: (config: Partial<DashboardConfig>) => void
  
  setLoading: (key: keyof DashboardState, loading: boolean) => void
  setError: (key: keyof DashboardState, error: string | null) => void
  
  refreshData: () => Promise<void>
  resetFilters: () => void
  resetAll: () => void
}

/**
 * 创建初始异步状态
 */
const createAsyncState = <T>(initialData: T | null = null): AsyncState<T> => ({
  data: initialData,
  loading: false,
  error: null,
  lastUpdated: null,
})

/**
 * 默认配置
 */
const defaultConfig: DashboardConfig = {
  layout: 'grid',
  theme: 'light',
  refreshInterval: 300000, // 5分钟
  defaultDateRange: 30, // 30天
  chartsConfig: {
    showLegend: true,
    showGrid: true,
    animationDuration: 1000,
  },
  notifications: {
    enabled: true,
    types: ['success', 'error', 'warning'],
  },
}

/**
 * 默认筛选条件
 */
const defaultFilters: FilterOptions = {
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    end: new Date().toISOString().split('T')[0]!,
  },
}

/**
 * 默认排序选项
 */
const defaultSortOptions: SortOptions = {
  field: 'value',
  direction: 'desc',
}

/**
 * Dashboard Store
 */
export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        statistics: createAsyncState<Statistics>(),
        revenueData: createAsyncState<RevenueChartData>(),
        dividendData: createAsyncState<DividendChartData>(),
        mapData: createAsyncState<MapData[]>(),
        businessRankings: createAsyncState<BusinessRanking[]>(),
        storeRankings: createAsyncState<StoreRanking[]>(),
        userConsumptionRankings: createAsyncState<UserConsumptionRanking[]>(),
        
        filters: defaultFilters,
        sortOptions: defaultSortOptions,
        config: defaultConfig,
        
        isRefreshing: false,
        lastRefreshTime: null,
        
        // Actions
        setStatistics: (data) =>
          set((state) => ({
            statistics: {
              ...state.statistics,
              data,
              lastUpdated: new Date().toISOString(),
            },
          })),
        
        setRevenueData: (data) =>
          set((state) => ({
            revenueData: {
              ...state.revenueData,
              data,
              lastUpdated: new Date().toISOString(),
            },
          })),
        
        setDividendData: (data) =>
          set((state) => ({
            dividendData: {
              ...state.dividendData,
              data,
              lastUpdated: new Date().toISOString(),
            },
          })),
        
        setMapData: (data) =>
          set((state) => ({
            mapData: {
              ...state.mapData,
              data,
              lastUpdated: new Date().toISOString(),
            },
          })),
        
        setBusinessRankings: (data) =>
          set((state) => ({
            businessRankings: {
              ...state.businessRankings,
              data,
              lastUpdated: new Date().toISOString(),
            },
          })),
        
        setStoreRankings: (data) =>
          set((state) => ({
            storeRankings: {
              ...state.storeRankings,
              data,
              lastUpdated: new Date().toISOString(),
            },
          })),
        
        setUserConsumptionRankings: (data) =>
          set((state) => ({
            userConsumptionRankings: {
              ...state.userConsumptionRankings,
              data,
              lastUpdated: new Date().toISOString(),
            },
          })),
        
        setFilters: (newFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          })),
        
        setSortOptions: (sort) =>
          set({ sortOptions: sort }),
        
        setConfig: (newConfig) =>
          set((state) => ({
            config: { ...state.config, ...newConfig },
          })),
        
        setLoading: (key, loading) =>
          set((state) => {
            const currentState = state[key] as AsyncState<any>
            if (currentState && typeof currentState === 'object' && 'loading' in currentState) {
              return {
                [key]: {
                  ...currentState,
                  loading,
                },
              }
            }
            return state
          }),
        
        setError: (key, error) =>
          set((state) => {
            const currentState = state[key] as AsyncState<any>
            if (currentState && typeof currentState === 'object' && 'error' in currentState) {
              return {
                [key]: {
                  ...currentState,
                  error,
                  loading: false,
                },
              }
            }
            return state
          }),
        
        refreshData: async () => {
          set({ isRefreshing: true })
          try {
            // 这里会调用数据服务来刷新所有数据
            // 实际实现时会从API获取数据
            console.log('Refreshing dashboard data...')
            
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            set({
              isRefreshing: false,
              lastRefreshTime: new Date().toISOString(),
            })
          } catch (error) {
            console.error('Failed to refresh data:', error)
            set({ isRefreshing: false })
          }
        },
        
        resetFilters: () =>
          set({ filters: defaultFilters }),
        
        resetAll: () =>
          set({
            statistics: createAsyncState<Statistics>(),
            revenueData: createAsyncState<RevenueChartData>(),
            dividendData: createAsyncState<DividendChartData>(),
            mapData: createAsyncState<MapData[]>(),
            businessRankings: createAsyncState<BusinessRanking[]>(),
            storeRankings: createAsyncState<StoreRanking[]>(),
            userConsumptionRankings: createAsyncState<UserConsumptionRanking[]>(),
            filters: defaultFilters,
            sortOptions: defaultSortOptions,
            isRefreshing: false,
            lastRefreshTime: null,
          }),
      }),
      {
        name: 'dashboard-store',
        partialize: (state) => ({
          filters: state.filters,
          sortOptions: state.sortOptions,
          config: state.config,
        }),
      }
    ),
    {
      name: 'dashboard-store',
    }
  )
)

/**
 * Dashboard Store Selectors
 */
export const dashboardSelectors = {
  // 获取所有加载状态
  getLoadingStates: (state: DashboardState) => ({
    statistics: state.statistics.loading,
    revenueData: state.revenueData.loading,
    dividendData: state.dividendData.loading,
    mapData: state.mapData.loading,
    businessRankings: state.businessRankings.loading,
    storeRankings: state.storeRankings.loading,
    userConsumptionRankings: state.userConsumptionRankings.loading,
  }),
  
  // 获取所有错误状态
  getErrorStates: (state: DashboardState) => ({
    statistics: state.statistics.error,
    revenueData: state.revenueData.error,
    dividendData: state.dividendData.error,
    mapData: state.mapData.error,
    businessRankings: state.businessRankings.error,
    storeRankings: state.storeRankings.error,
    userConsumptionRankings: state.userConsumptionRankings.error,
  }),
  
  // 检查是否有任何数据正在加载
  isAnyLoading: (state: DashboardState) => {
    const loadingStates = dashboardSelectors.getLoadingStates(state)
    return Object.values(loadingStates).some(loading => loading) || state.isRefreshing
  },
  
  // 检查是否有任何错误
  hasAnyError: (state: DashboardState) => {
    const errorStates = dashboardSelectors.getErrorStates(state)
    return Object.values(errorStates).some(error => error !== null)
  },
  
  // 获取数据最后更新时间
  getLastUpdatedTime: (state: DashboardState) => {
    const times = [
      state.statistics.lastUpdated,
      state.revenueData.lastUpdated,
      state.dividendData.lastUpdated,
      state.mapData.lastUpdated,
      state.businessRankings.lastUpdated,
      state.storeRankings.lastUpdated,
      state.userConsumptionRankings.lastUpdated,
    ].filter(Boolean)
    
    return times.length > 0 ? Math.max(...times.map(t => new Date(t!).getTime())) : null
  },
}