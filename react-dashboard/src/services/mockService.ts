import {
  mockStatistics,
  mockRevenueData,
  mockDividendChartData,
  mockMapData,
  mockBusinessRanking,
  mockStoreRanking,
  mockUserConsumptionRanking,
  mockBusinessData,
  mockDividendData,
} from './mockData'
import type {
  Statistics,
  RevenueChartData,
  DividendChartData,
  MapData,
  BusinessRanking,
  StoreRanking,
  UserConsumptionRanking,
  FilterOptions,
} from '@/types/dashboard'

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms))

export const mockDashboardService = {
  async getStatistics(filters?: FilterOptions): Promise<Statistics> {
    await simulateDelay(500)
    console.log('Mock API: Fetching statistics with filters', filters)
    return mockStatistics
  },

  async getRevenueData(filters?: FilterOptions): Promise<RevenueChartData> {
    await simulateDelay(800)
    console.log('Mock API: Fetching revenue data with filters', filters)
    return mockRevenueData
  },

  async getDividendChartData(filters?: FilterOptions): Promise<DividendChartData['distribution']> {
    await simulateDelay(600)
    console.log('Mock API: Fetching dividend chart data with filters', filters)
    return mockDividendChartData
  },

  async getMapData(filters?: FilterOptions): Promise<MapData[]> {
    await simulateDelay(1000)
    console.log('Mock API: Fetching map data with filters', filters)
    return mockMapData
  },

  async getBusinessRanking(filters?: FilterOptions): Promise<BusinessRanking[]> {
    await simulateDelay(700)
    console.log('Mock API: Fetching business ranking with filters', filters)
    return mockBusinessRanking
  },

  async getStoreRanking(filters?: FilterOptions): Promise<StoreRanking[]> {
    await simulateDelay(750)
    console.log('Mock API: Fetching store ranking with filters', filters)
    return mockStoreRanking
  },

  async getUserConsumptionRanking(filters?: FilterOptions): Promise<UserConsumptionRanking[]> {
    await simulateDelay(850)
    console.log('Mock API: Fetching user consumption ranking with filters', filters)
    return mockUserConsumptionRanking
  },

  async getBusinessData(filters?: FilterOptions): Promise<typeof mockBusinessData> {
    await simulateDelay(400)
    console.log('Mock API: Fetching business data with filters', filters)
    return mockBusinessData
  },

  async getDividendData(filters?: FilterOptions): Promise<typeof mockDividendData> {
    await simulateDelay(450)
    console.log('Mock API: Fetching dividend data with filters', filters)
    return mockDividendData
  },

  async getUserActivityData(filters?: FilterOptions): Promise<any> {
    await simulateDelay(900)
    console.log('Mock API: Fetching user activity data with filters', filters)
    return {
      daily: [
        { date: '2024-07-01', newUsers: 120, activeUsers: 1500 },
        { date: '2024-07-02', newUsers: 150, activeUsers: 1550 },
        { date: '2024-07-03', newUsers: 180, activeUsers: 1600 },
        { date: '2024-07-04', newUsers: 130, activeUsers: 1580 },
        { date: '2024-07-05', newUsers: 200, activeUsers: 1700 },
        { date: '2024-07-06', newUsers: 220, activeUsers: 1750 },
        { date: '2024-07-07', newUsers: 190, activeUsers: 1720 },
      ],
    }
  },
}