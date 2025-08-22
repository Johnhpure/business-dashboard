/**
 * Dashboard数据服务
 */

import { apiClient } from './api'
import { mockDashboardService } from './mockService'
import type {
  Statistics,
  RevenueChartData,
  DividendChartData,
  MapData,
  BusinessRanking,
  StoreRanking,
  UserConsumptionRanking,
  FilterOptions,
  PaginationOptions,
  SortOptions,
  PaginatedResponse,
} from '@/types'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * Dashboard服务类
 */
export class DashboardService {
  /**
   * 获取统计数据
   */
  static async getStatistics(filters?: FilterOptions): Promise<Statistics> {
    if (useMock) return mockDashboardService.getStatistics(filters)
    return apiClient.get<Statistics>('/dashboard/statistics', { params: filters || {} })
  }

  /**
   * 获取收入图表数据
   */
  static async getRevenueData(filters?: FilterOptions): Promise<RevenueChartData> {
    if (useMock) return mockDashboardService.getRevenueData(filters)
    return apiClient.get<RevenueChartData>('/dashboard/revenue', { params: filters || {} })
  }

  /**
   * 获取分红图表数据
   */
  static async getDividendData(filters?: FilterOptions): Promise<any> {
    if (useMock) return mockDashboardService.getDividendData(filters)
    return apiClient.get<DividendChartData>('/dashboard/dividend', { params: filters || {} })
  }

  /**
   * 获取地图数据
   */
  static async getMapData(filters?: FilterOptions): Promise<MapData[]> {
    if (useMock) return mockDashboardService.getMapData(filters)
    return apiClient.get<MapData[]>('/dashboard/map', { params: filters || {} })
  }

  /**
   * 获取用户活动数据
   */
  static async getUserActivityData(filters?: FilterOptions): Promise<any> {
    if (useMock) return mockDashboardService.getUserActivityData(filters)
    return apiClient.get<any>('/dashboard/user-activity', { params: filters || {} })
  }

  /**
   * 获取业务排行榜
   */
  static async getBusinessRankings(
    pagination?: PaginationOptions,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<PaginatedResponse<BusinessRanking>> {
    if (useMock) {
      const data = await mockDashboardService.getBusinessRanking(filters)
      return {
        success: true,
        data,
        pagination: { page: 1, pageSize: 10, total: data.length, totalPages: 1 },
        timestamp: new Date().toISOString(),
      }
    }
    const params = { ...pagination, ...filters, ...sort }
    return apiClient.get<PaginatedResponse<BusinessRanking>>('/dashboard/rankings/business', { params })
  }

  /**
   * 获取门店排行榜
   */
  static async getStoreRankings(
    pagination?: PaginationOptions,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<PaginatedResponse<StoreRanking>> {
    if (useMock) {
      const data = await mockDashboardService.getStoreRanking(filters)
      return {
        success: true,
        data,
        pagination: { page: 1, pageSize: 10, total: data.length, totalPages: 1 },
        timestamp: new Date().toISOString(),
      }
    }
    const params = { ...pagination, ...filters, ...sort }
    return apiClient.get<PaginatedResponse<StoreRanking>>('/dashboard/rankings/store', { params })
  }

  /**
   * 获取用户消费排行榜
   */
  static async getUserConsumptionRankings(
    pagination?: PaginationOptions,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<PaginatedResponse<UserConsumptionRanking>> {
    if (useMock) {
      const data = await mockDashboardService.getUserConsumptionRanking(filters)
      return {
        success: true,
        data,
        pagination: { page: 1, pageSize: 10, total: data.length, totalPages: 1 },
        timestamp: new Date().toISOString(),
      }
    }
    const params = { ...pagination, ...filters, ...sort }
    return apiClient.get<PaginatedResponse<UserConsumptionRanking>>('/dashboard/rankings/user-consumption', { params })
  }

  /**
   * 刷新所有数据
   */
  static async refreshAllData(filters?: FilterOptions): Promise<{
    statistics: Statistics
    revenueData: RevenueChartData
    dividendData: DividendChartData
    mapData: MapData[]
    businessRankings: BusinessRanking[]
    storeRankings: StoreRanking[]
    userConsumptionRankings: UserConsumptionRanking[]
  }> {
    const [
      statistics,
      revenueData,
      dividendData,
      mapData,
      businessRankingsResponse,
      storeRankingsResponse,
      userConsumptionRankingsResponse,
    ] = await Promise.all([
      this.getStatistics(filters),
      this.getRevenueData(filters),
      this.getDividendData(filters),
      this.getMapData(filters),
      this.getBusinessRankings({ page: 1, pageSize: 10 }, filters),
      this.getStoreRankings({ page: 1, pageSize: 10 }, filters),
      this.getUserConsumptionRankings({ page: 1, pageSize: 10 }, filters),
    ])

    return {
      statistics,
      revenueData,
      dividendData,
      mapData,
      businessRankings: businessRankingsResponse.data,
      storeRankings: storeRankingsResponse.data,
      userConsumptionRankings: userConsumptionRankingsResponse.data,
    }
  }

  /**
   * 导出数据
   */
  static async exportData(
    type: 'statistics' | 'revenue' | 'dividend' | 'rankings',
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters?: FilterOptions
  ): Promise<void> {
    const params = {
      type,
      format,
      ...filters,
    }
    
    return apiClient.download('/dashboard/export', `dashboard-${type}.${format}`, {
      params,
    })
  }
}

/**
 * 默认导出
 */
export default DashboardService