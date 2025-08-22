import type {
  Statistics,
  RevenueChartData,
  DividendChartData,
  MapData,
  BusinessRanking,
  StoreRanking,
  UserConsumptionRanking,
} from '@/types/dashboard'

// --- 辅助函数 ---
const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// --- 模拟数据 ---

/**
 * 模拟KPI统计数据
 */
export const mockStatistics: Statistics = {
  totalRevenue: 12580000,
  totalBusinesses: 2847,
  totalStores: 8642,
  totalUsers: 156789,
  revenueGrowth: 0.158,
  businessGrowth: 0.089,
  storeGrowth: 0.083,
  userGrowth: 0.237,
}

/**
 * 模拟业务数据
 */
export const mockBusinessData = {
  pointsIssued: { value: 2856780, todayNew: { value: 125680, unit: '点' } },
  voucherConsumed: { value: 1456890, todayNew: { value: 89420, unit: '元' } },
  goodPointsConsumed: { value: 987650, todayNew: { value: 67890, unit: '点' } },
  voucherWithdrawal: { value: 756430, todayNew: { value: 45230, unit: '元' } },
}

/**
 * 模拟分红数据
 */
export const mockDividendData = {
  currentRound: 25,
  progress: 73,
  poolBalance: 2516000,
  estimatedTime: '2天后',
  estimatedAmount: 680000,
  distribution: {
    partners: 0.4,
    business: 0.25,
    stores: 0.2,
    users: 0.15,
  },
}

/**
 * 模拟收入图表数据
 */
export const mockRevenueData: RevenueChartData = {
  monthly: Array.from({ length: 12 }, (_, i) => ({
    date: `${i + 1}月`,
    value: randomBetween(1000000, 2500000),
  })),
  quarterly: [
    { date: 'Q1', value: randomBetween(3000000, 5000000) },
    { date: 'Q2', value: randomBetween(3000000, 5000000) },
    { date: 'Q3', value: randomBetween(3000000, 5000000) },
    { date: 'Q4', value: randomBetween(3000000, 5000000) },
  ],
  yearly: [
    { date: '2022', value: randomBetween(10000000, 15000000) },
    { date: '2023', value: randomBetween(15000000, 20000000) },
  ],
}

/**
 * 模拟分红图表数据
 */
export const mockDividendChartData: DividendChartData['distribution'] = [
  { business: '合伙人', amount: 1006400, percentage: 40 },
  { business: '商务', amount: 629000, percentage: 25 },
  { business: '商户', amount: 503200, percentage: 20 },
  { business: '用户', amount: 377400, percentage: 15 },
]

/**
 * 模拟地图数据
 */
export const mockMapData: MapData[] = [
  { region: '四川省', value: 1850000, businesses: 320, stores: 980, coordinates: [104.066, 30.651] },
  { region: '广东省', value: 2500000, businesses: 450, stores: 1200, coordinates: [113.266, 23.132] },
  { region: '北京市', value: 1980000, businesses: 380, stores: 850, coordinates: [116.407, 39.904] },
  { region: '上海市', value: 2200000, businesses: 410, stores: 1100, coordinates: [121.473, 31.23] },
  { region: '浙江省', value: 1750000, businesses: 290, stores: 950, coordinates: [120.152, 30.267] },
  { region: '江苏省', value: 1680000, businesses: 270, stores: 920, coordinates: [118.763, 32.061] },
  { region: '山东省', value: 1450000, businesses: 250, stores: 880, coordinates: [117.02, 36.67] },
]

/**
 * 模拟商务排行榜数据
 */
export const mockBusinessRanking: BusinessRanking[] = Array.from({ length: 10 }, (_, i) => ({
  id: `business_${i}`,
  name: `商务团队 ${i + 1}`,
  value: randomBetween(50000, 200000),
  rank: i + 1,
  change: randomBetween(-5, 15),
  type: '区域代理',
  employees: randomBetween(5, 20),
  growth: randomBetween(-0.05, 0.2),
  location: '四川省',
}))

/**
 * 模拟门店排行榜数据
 */
export const mockStoreRanking: StoreRanking[] = Array.from({ length: 10 }, (_, i) => ({
  id: `store_${i}`,
  name: `热门店铺 ${i + 1}`,
  value: randomBetween(20000, 100000),
  rank: i + 1,
  change: randomBetween(-10, 20),
  businessName: `商务团队 ${randomBetween(1, 5)}`,
  manager: `店长${i + 1}`,
  customerCount: randomBetween(500, 2000),
  rating: parseFloat((Math.random() * (5 - 4) + 4).toFixed(1)),
  location: '成都市',
}))

/**
 * 模拟用户消费排行榜数据
 */
export const mockUserConsumptionRanking: UserConsumptionRanking[] = Array.from({ length: 10 }, (_, i) => ({
  id: `user_${i}`,
  name: `消费达人 ${i + 1}`,
  value: randomBetween(5000, 25000),
  rank: i + 1,
  change: randomBetween(0, 5),
  email: `user${i + 1}@example.com`,
  totalOrders: randomBetween(20, 100),
  averageOrderValue: randomBetween(100, 500),
  lastPurchase: randomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0] || '',
  avatar: `https://i.pravatar.cc/40?u=user${i}`,
}))