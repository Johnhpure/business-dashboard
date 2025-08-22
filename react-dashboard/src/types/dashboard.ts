/**
 * Dashboard相关类型定义
 */

/**
 * 基础数据类型
 */
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

/**
 * 用户信息
 */
export interface User extends BaseEntity {
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
}

/**
 * 业务数据
 */
export interface Business extends BaseEntity {
  name: string
  type: string
  revenue: number
  growth: number
  location: string
  employees: number
  status: 'active' | 'inactive'
}

/**
 * 门店数据
 */
export interface Store extends BaseEntity {
  name: string
  businessId: string
  location: string
  revenue: number
  customerCount: number
  rating: number
  manager: string
  status: 'open' | 'closed' | 'maintenance'
}

/**
 * 分红数据
 */
export interface Dividend extends BaseEntity {
  businessId: string
  amount: number
  percentage: number
  period: string
  status: 'pending' | 'paid' | 'cancelled'
  recipients: string[]
}

/**
 * 用户消费数据
 */
export interface UserConsumption extends BaseEntity {
  userId: string
  businessId: string
  storeId?: string
  amount: number
  date: string
  category: string
  paymentMethod: 'cash' | 'card' | 'digital'
}

/**
 * 统计数据
 */
export interface Statistics {
  totalRevenue: number
  totalBusinesses: number
  totalStores: number
  totalUsers: number
  revenueGrowth: number
  businessGrowth: number
  storeGrowth: number
  userGrowth: number
}

/**
 * 图表数据点
 */
export interface ChartDataPoint {
  label: string
  value: number
  date?: string
  category?: string
}

/**
 * 时间序列数据
 */
export interface TimeSeriesData {
  date: string
  value: number
  category?: string
}

/**
 * 收入图表数据
 */
export interface RevenueChartData {
  monthly: TimeSeriesData[]
  quarterly: TimeSeriesData[]
  yearly: TimeSeriesData[]
}

/**
 * 分红图表数据
 */
export interface DividendChartData {
  byBusiness: ChartDataPoint[]
  byPeriod: TimeSeriesData[]
  distribution: {
    business: string
    amount: number
    percentage: number
  }[]
}

/**
 * 地图数据
 */
export interface MapData {
  region: string
  value: number
  businesses: number
  stores: number
  coordinates?: [number, number]
}

/**
 * 排行榜数据
 */
export interface RankingItem {
  id: string
  name: string
  value: number
  rank: number
  change: number
  percentage?: number
  avatar?: string
  location?: string
}

/**
 * 业务排行榜
 */
export interface BusinessRanking extends RankingItem {
  type: string
  employees: number
  growth: number
}

/**
 * 门店排行榜
 */
export interface StoreRanking extends RankingItem {
  businessName: string
  manager: string
  customerCount: number
  rating: number
}

/**
 * 用户消费排行榜
 */
export interface UserConsumptionRanking extends RankingItem {
  email: string
  totalOrders: number
  averageOrderValue: number
  lastPurchase: string
}

/**
 * 筛选条件
 */
export interface FilterOptions {
  dateRange?: {
    start: string
    end: string
  }
  businesses?: string[]
  stores?: string[]
  categories?: string[]
  status?: string[]
  regions?: string[]
}

/**
 * 排序选项
 */
export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

/**
 * 分页选项
 */
export interface PaginationOptions {
  page: number
  pageSize: number
  total?: number
}

/**
 * API响应基础结构
 */
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
  timestamp: string
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * 仪表板配置
 */
export interface DashboardConfig {
  layout: 'grid' | 'list'
  theme: 'light' | 'dark' | 'auto'
  refreshInterval: number
  defaultDateRange: number // 天数
  chartsConfig: {
    showLegend: boolean
    showGrid: boolean
    animationDuration: number
  }
  notifications: {
    enabled: boolean
    types: string[]
  }
}

/**
 * 组件状态
 */
export interface ComponentState {
  loading: boolean
  error: string | null
  lastUpdated: string | null
}

/**
 * 异步操作状态
 */
export interface AsyncState<T = any> extends ComponentState {
  data: T | null
}

/**
 * 表单状态
 */
export interface FormState<T = any> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

/**
 * 模态框状态
 */
export interface ModalState {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

/**
 * 通知类型
 */
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  mode: 'light' | 'dark'
  primaryColor: string
  secondaryColor: string
  borderRadius: number
  fontSize: 'sm' | 'md' | 'lg'
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  theme: ThemeConfig
  dashboard: DashboardConfig
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  language: string
  timezone: string
}