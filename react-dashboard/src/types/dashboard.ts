// 业务数据类型定义

export interface BusinessOverview {
  revenue: {
    value: number;
    trend: string;
  };
  stores: {
    value: number;
    trend: string;
  };
  users: {
    value: number;
    trend: string;
  };
  dividend: {
    value: number;
    trend: string;
  };
  business: {
    value: number;
    trend: string;
  };
}

export interface DividendData {
  currentRound: number;
  progress: number;
  estimatedTime: string;
  estimatedAmount: number;
  distribution: {
    partners: number;
    business: number;
    stores: number;
    users: number;
  };
  currentDistribution: {
    partners: { amount: number; percentage: number };
    business: { amount: number; percentage: number };
    stores: { amount: number; percentage: number };
    users: { amount: number; percentage: number };
  };
}

export interface RegionData {
  code: string;
  name: string;
  level: 'province' | 'city' | 'district';
  parentCode?: string;
  revenue: number;
  storeCount: number;
  userCount: number;
  partnerCount: number;
  coordinates: [number, number];
}

export interface PartnerData {
  id: string;
  name: string;
  level: '5GP' | '4GP' | '3GP' | '2GP' | 'LP';
  region: string;
  revenue: number;
  dividendAmount: number;
  storeCount: number;
  businessCount: number;
  change: number;
}

export interface BusinessData {
  id: string;
  name: string;
  partnerId: string;
  parentBusinessId?: string;
  level: number;
  storeCount: number;
  revenue: number;
  directDividend: number;
  indirectDividend: number;
}

export interface StoreData {
  id: string;
  name: string;
  businessId: string;
  partnerId: string;
  region: string;
  type: string;
  address: string;
  revenue: number;
  dividendAmount: number;
  discountRate: number;
  transactionCount: number;
  averageOrderValue: number;
  status: 'active' | 'inactive';
  change: number;
}

export interface UserData {
  id: string;
  name: string;
  phone: string;
  region: string;
  totalConsumption: number;
  totalDividend: number;
  consumptionPoints: number;
  dividendCount: number;
  lastActiveDate: Date;
  joinDate: Date;
  status: 'active' | 'inactive';
}

export interface TransactionData {
  id: string;
  storeId: string;
  userId: string;
  amount: number;
  discountAmount: number;
  platformAmount: number;
  merchantAmount: number;
  consumptionPoints: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  qrCodeId: string;
}

export interface RankingData {
  partners: PartnerData[];
  stores: StoreData[];
}

export interface ChartData {
  revenue: RevenueChartData[];
  dividend: DividendChartData[];
  region: RegionChartData[];
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  transactions: number;
}

export interface DividendChartData {
  name: string;
  value: number;
  color: string;
}

export interface RegionChartData {
  name: string;
  revenue: number;
  stores: number;
  growth: number;
}

export interface FilterState {
  timeRange: 'realtime' | 'today' | 'week' | 'month' | 'quarter' | 'year';
  province: string;
  city: string;
  district: string;
  roles: string[];
  round: number;
}

export interface DashboardData {
  overview: BusinessOverview;
  dividend: DividendData;
  rankings: RankingData;
  charts: ChartData;
  map: RegionData[];
}

// Zustand Store 类型
export interface DashboardStore {
  // 状态
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  filters: FilterState;
  
  // 动作
  setData: (data: DashboardData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  fetchData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

// 图表配置类型
export interface ChartConfig {
  theme: 'dark' | 'light';
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  secondaryColor: string;
}

// 动画配置类型
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
}