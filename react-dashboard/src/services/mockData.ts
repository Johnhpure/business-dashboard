import type { 
  DashboardData, 
  FilterState, 
  BusinessOverview, 
  DividendData, 
  RankingData, 
  ChartData,
  RegionData,
  PartnerData,
  StoreData,
  RevenueChartData,
  DividendChartData,
  RegionChartData,
  UserData,
  TransactionData,
  BusinessData
} from '../types/dashboard';

// 地区数据
const regions = {
  provinces: [
    { code: 'sichuan', name: '四川省', coordinates: [104.066, 30.651] as [number, number] },
    { code: 'guangdong', name: '广东省', coordinates: [113.266, 23.132] as [number, number] },
    { code: 'beijing', name: '北京市', coordinates: [116.407, 39.904] as [number, number] },
    { code: 'shanghai', name: '上海市', coordinates: [121.473, 31.230] as [number, number] },
    { code: 'zhejiang', name: '浙江省', coordinates: [120.152, 30.267] as [number, number] },
    { code: 'jiangsu', name: '江苏省', coordinates: [118.763, 32.061] as [number, number] },
    { code: 'shandong', name: '山东省', coordinates: [117.020, 36.670] as [number, number] },
    { code: 'henan', name: '河南省', coordinates: [113.649, 34.757] as [number, number] },
    { code: 'hubei', name: '湖北省', coordinates: [114.342, 30.546] as [number, number] },
    { code: 'hunan', name: '湖南省', coordinates: [112.983, 28.112] as [number, number] },
    { code: 'anhui', name: '安徽省', coordinates: [117.283, 31.861] as [number, number] },
    { code: 'jiangxi', name: '江西省', coordinates: [115.892, 28.676] as [number, number] },
    { code: 'fujian', name: '福建省', coordinates: [119.306, 26.075] as [number, number] },
    { code: 'yunnan', name: '云南省', coordinates: [102.712, 25.040] as [number, number] },
    { code: 'guizhou', name: '贵州省', coordinates: [106.713, 26.578] as [number, number] },
    { code: 'chongqing', name: '重庆市', coordinates: [106.504, 29.533] as [number, number] },
    { code: 'tianjin', name: '天津市', coordinates: [117.190, 39.125] as [number, number] },
    { code: 'hebei', name: '河北省', coordinates: [114.502, 38.045] as [number, number] },
    { code: 'shanxi', name: '山西省', coordinates: [112.549, 37.857] as [number, number] },
    { code: 'liaoning', name: '辽宁省', coordinates: [123.429, 41.796] as [number, number] }
  ],
  cities: {
    sichuan: [
      { code: 'chengdu', name: '成都市', parentCode: 'sichuan' },
      { code: 'ziyang', name: '资阳市', parentCode: 'sichuan' },
      { code: 'mianyang', name: '绵阳市', parentCode: 'sichuan' },
      { code: 'deyang', name: '德阳市', parentCode: 'sichuan' },
      { code: 'nanchong', name: '南充市', parentCode: 'sichuan' },
      { code: 'yibin', name: '宜宾市', parentCode: 'sichuan' }
    ],
    guangdong: [
      { code: 'guangzhou', name: '广州市', parentCode: 'guangdong' },
      { code: 'shenzhen', name: '深圳市', parentCode: 'guangdong' },
      { code: 'dongguan', name: '东莞市', parentCode: 'guangdong' },
      { code: 'foshan', name: '佛山市', parentCode: 'guangdong' },
      { code: 'zhuhai', name: '珠海市', parentCode: 'guangdong' },
      { code: 'zhongshan', name: '中山市', parentCode: 'guangdong' }
    ],
    beijing: [
      { code: 'dongcheng', name: '东城区', parentCode: 'beijing' },
      { code: 'xicheng', name: '西城区', parentCode: 'beijing' },
      { code: 'chaoyang', name: '朝阳区', parentCode: 'beijing' },
      { code: 'haidian', name: '海淀区', parentCode: 'beijing' }
    ],
    shanghai: [
      { code: 'huangpu', name: '黄浦区', parentCode: 'shanghai' },
      { code: 'xuhui', name: '徐汇区', parentCode: 'shanghai' },
      { code: 'changning', name: '长宁区', parentCode: 'shanghai' },
      { code: 'jingan', name: '静安区', parentCode: 'shanghai' }
    ],
    zhejiang: [
      { code: 'hangzhou', name: '杭州市', parentCode: 'zhejiang' },
      { code: 'ningbo', name: '宁波市', parentCode: 'zhejiang' },
      { code: 'wenzhou', name: '温州市', parentCode: 'zhejiang' },
      { code: 'jiaxing', name: '嘉兴市', parentCode: 'zhejiang' }
    ]
  },
  districts: {
    ziyang: [
      { code: 'anyue', name: '安岳县', parentCode: 'ziyang' },
      { code: 'lezhi', name: '乐至县', parentCode: 'ziyang' },
      { code: 'yanjiang', name: '雁江区', parentCode: 'ziyang' }
    ],
    chengdu: [
      { code: 'jinjiang', name: '锦江区', parentCode: 'chengdu' },
      { code: 'qingyang', name: '青羊区', parentCode: 'chengdu' },
      { code: 'jinniu', name: '金牛区', parentCode: 'chengdu' },
      { code: 'wuhou', name: '武侯区', parentCode: 'chengdu' }
    ]
  }
};

// 工具函数
const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// 更多模拟数据常量
const partnerNames = [
  '张伟', '李娜', '王强', '刘敏', '陈杰', '杨洋', '赵雷', '孙丽', '周涛', '吴静',
  '徐明', '朱红', '胡军', '郭芳', '林峰', '何丽', '高勇', '梁静', '宋涛', '唐敏',
  '冯强', '董丽', '薛勇', '贺静', '龚涛', '邓敏', '姚强', '石丽', '罗勇', '毛静'
];

const storeTypes = ['餐饮', '零售', '服务', '娱乐', '美容', '教育', '医疗', '汽车', '家居', '数码'];
const storeNames = ['老王', '小李', '阿华', '大众', '新时代', '金牌', '品味', '优选', '精品', '名门', '尚品', '雅致'];
const storeSuffixes = ['餐厅', '小吃店', '超市', '便利店', '理发店', '美容院', '药店', '书店', '咖啡厅', '茶楼', '健身房', '洗车店'];

const businessNames = ['商贸', '科技', '文化', '教育', '健康', '生活', '时尚', '智能', '绿色', '创新'];
const businessSuffixes = ['有限公司', '商贸公司', '科技公司', '文化传媒', '教育咨询', '健康管理', '生活服务'];

// 生成更真实的趋势数据
const generateTrend = (): string => {
  const isPositive = Math.random() > 0.3; // 70% 概率为正增长
  const value = randomFloat(0.1, 35, 1);
  return isPositive ? `+${value}%` : `-${value}%`;
};

// 生成业务概览数据
const generateOverviewData = (filters: FilterState): BusinessOverview => {
  // 根据时间范围调整基础数据
  const timeMultiplier = {
    realtime: 0.001,
    today: 0.033,
    week: 0.23,
    month: 1,
    quarter: 3,
    year: 12
  }[filters.timeRange];

  // 根据地区筛选调整数据
  const regionMultiplier = filters.province ? 
    (filters.city ? 0.05 : 0.15) : 1;

  // 基础数据随机波动
  const baseRevenue = randomBetween(10000000, 15000000);
  const baseStores = randomBetween(7500, 9500);
  const baseUsers = randomBetween(140000, 180000);
  const baseDividend = randomBetween(2000000, 3000000);

  const baseBusiness = randomBetween(2500, 4500);

  return {
    revenue: {
      value: Math.floor(baseRevenue * timeMultiplier * regionMultiplier),
      trend: generateTrend()
    },
    stores: {
      value: Math.floor(baseStores * regionMultiplier),
      trend: generateTrend()
    },
    users: {
      value: Math.floor(baseUsers * regionMultiplier),
      trend: generateTrend()
    },
    dividend: {
      value: Math.floor(baseDividend * timeMultiplier * regionMultiplier),
      trend: generateTrend()
    },
    business: {
      value: Math.floor(baseBusiness * regionMultiplier),
      trend: generateTrend()
    }
  };
};

// 生成分红数据
const generateDividendData = (filters: FilterState): DividendData => {
  const progress = randomBetween(45, 95);
  const estimatedDays = Math.ceil((100 - progress) / 10);
  
  // 根据进度动态调整预估时间
  const getEstimatedTime = (progress: number): string => {
    if (progress >= 95) return '即将开始';
    if (progress >= 85) return '1天后';
    if (progress >= 70) return `${estimatedDays}天后`;
    if (progress >= 50) return `${estimatedDays}天后`;
    return `${estimatedDays + 1}天后`;
  };

  const estimatedAmount = randomBetween(500000, 900000);
  const distribution = {
    partners: randomFloat(0.35, 0.45, 2),
    business: randomFloat(0.20, 0.30, 2),
    stores: randomFloat(0.18, 0.25, 2),
    users: randomFloat(0.12, 0.20, 2)
  };

  // 计算当前轮次的实际分红金额
  const currentDistribution = {
    partners: {
      amount: Math.floor(estimatedAmount * distribution.partners),
      percentage: distribution.partners * 100
    },
    business: {
      amount: Math.floor(estimatedAmount * distribution.business),
      percentage: distribution.business * 100
    },
    stores: {
      amount: Math.floor(estimatedAmount * distribution.stores),
      percentage: distribution.stores * 100
    },
    users: {
      amount: Math.floor(estimatedAmount * distribution.users),
      percentage: distribution.users * 100
    }
  };

  return {
    currentRound: filters.round,
    progress,
    estimatedTime: getEstimatedTime(progress),
    estimatedAmount,
    distribution,
    currentDistribution
  };
};

// 生成排行榜数据
const generateRankingData = (_filters: FilterState): RankingData => {
  const partners: PartnerData[] = [];
  const stores: StoreData[] = [];

  // 生成合伙人排行榜
  const levels: Array<'5GP' | '4GP' | '3GP' | '2GP' | 'LP'> = ['5GP', '4GP', '3GP', '2GP', 'LP'];
  const levelWeights = { '5GP': 5, '4GP': 4, '3GP': 3, '2GP': 2, 'LP': 1 };
  const provinceNames = regions.provinces.map(p => p.name);

  for (let i = 0; i < 20; i++) {
    const level = getRandomElement(levels);
    const baseRevenue = levelWeights[level] * randomBetween(80000, 120000);
    
    partners.push({
      id: `partner_${i}`,
      name: getRandomElement(partnerNames),
      level,
      region: getRandomElement(provinceNames),
      revenue: baseRevenue + randomBetween(-20000, 50000),
      dividendAmount: Math.floor(baseRevenue * randomFloat(0.15, 0.25)),
      storeCount: randomBetween(levelWeights[level] * 10, levelWeights[level] * 30),
      businessCount: randomBetween(levelWeights[level] * 5, levelWeights[level] * 15),
      change: randomFloat(-15, 40, 1)
    });
  }

  // 生成商户排行榜
  const roadNames = ['中山路', '人民路', '解放路', '建设路', '文化路', '商业街', '步行街', '新华路', '光明路', '和平路'];
  
  for (let i = 0; i < 30; i++) {
    const storeType = getRandomElement(storeTypes);
    const storeName = getRandomElement(storeNames);
    const storeSuffix = getRandomElement(storeSuffixes);
    const baseRevenue = randomBetween(60000, 250000);
    
    stores.push({
      id: `store_${i}`,
      name: `${storeName}${storeSuffix}`,
      businessId: `business_${randomBetween(0, 19)}`,
      partnerId: `partner_${randomBetween(0, 19)}`,
      region: getRandomElement(provinceNames),
      type: storeType,
      address: `${getRandomElement(roadNames)}${randomBetween(1, 999)}号`,
      revenue: baseRevenue,
      dividendAmount: Math.floor(baseRevenue * randomFloat(0.12, 0.22)),
      discountRate: randomBetween(8, 28),
      transactionCount: randomBetween(300, 2500),
      averageOrderValue: randomBetween(35, 450),
      status: Math.random() > 0.08 ? 'active' : 'inactive',
      change: randomFloat(-20, 45, 1)
    });
  }

  // 按收入排序并取前10
  partners.sort((a, b) => b.revenue - a.revenue);
  stores.sort((a, b) => b.revenue - a.revenue);

  return { 
    partners: partners.slice(0, 10), 
    stores: stores.slice(0, 10) 
  };
};

// 生成图表数据
const generateChartData = (filters: FilterState): ChartData => {
  // 收入趋势数据
  const revenue: RevenueChartData[] = [];
  let days = 30;
  
  switch (filters.timeRange) {
    case 'realtime':
      days = 1;
      break;
    case 'today':
      days = 1;
      break;
    case 'week':
      days = 7;
      break;
    case 'month':
      days = 30;
      break;
    case 'quarter':
      days = 90;
      break;
    case 'year':
      days = 365;
      break;
  }
  
  // 生成更真实的趋势数据（有一定的连续性）
  let baseRevenue = randomBetween(400000, 600000);
  let baseTransactions = randomBetween(1500, 2500);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // 添加一些趋势性和随机性
    const trendFactor = Math.sin((days - i) / days * Math.PI) * 0.3 + 1;
    const randomFactor = randomFloat(0.8, 1.2);
    
    baseRevenue = Math.max(200000, baseRevenue + randomBetween(-50000, 80000));
    baseTransactions = Math.max(800, baseTransactions + randomBetween(-200, 300));
    
    revenue.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(baseRevenue * trendFactor * randomFactor),
      transactions: Math.floor(baseTransactions * trendFactor * randomFactor)
    });
  }

  // 分红分布数据（动态生成）
  const dividendDistribution = {
    partners: randomFloat(35, 45),
    business: randomFloat(20, 30),
    stores: randomFloat(18, 25),
    users: randomFloat(12, 20)
  };
  
  // 确保总和为100%
  const total = Object.values(dividendDistribution).reduce((sum, val) => sum + val, 0);
  const dividend: DividendChartData[] = [
    { name: '合伙人', value: Math.round(dividendDistribution.partners / total * 100), color: '#667eea' },
    { name: '商务', value: Math.round(dividendDistribution.business / total * 100), color: '#764ba2' },
    { name: '商户', value: Math.round(dividendDistribution.stores / total * 100), color: '#f093fb' },
    { name: '用户', value: Math.round(dividendDistribution.users / total * 100), color: '#f5576c' }
  ];

  // 地区对比数据（更多地区）
  const selectedProvinces = regions.provinces
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
    
  const region: RegionChartData[] = selectedProvinces.map(province => ({
    name: province.name,
    revenue: randomBetween(300000, 2500000),
    stores: randomBetween(80, 1200),
    growth: randomFloat(-8, 35, 1)
  }));

  return { revenue, dividend, region };
};

// 生成地图数据
const generateMapData = (_filters: FilterState): RegionData[] => {
  // 按照截图中的顺序和比例生成前4个主要地区
  const mainRegions = [
    {
      code: 'sichuan',
      name: '四川省',
      level: 'province' as const,
      revenue: randomBetween(4500000, 5500000), // 最大份额
      storeCount: randomBetween(1500, 2000),
      userCount: randomBetween(40000, 55000),
      partnerCount: randomBetween(300, 450),
      coordinates: [104.066, 30.651] as [number, number]
    },
    {
      code: 'guangdong',
      name: '广东省',
      level: 'province' as const,
      revenue: randomBetween(3500000, 4200000), // 第二大份额
      storeCount: randomBetween(1200, 1600),
      userCount: randomBetween(30000, 42000),
      partnerCount: randomBetween(250, 350),
      coordinates: [113.266, 23.132] as [number, number]
    },
    {
      code: 'beijing',
      name: '北京市',
      level: 'province' as const,
      revenue: randomBetween(2800000, 3400000), // 第三大份额
      storeCount: randomBetween(900, 1300),
      userCount: randomBetween(25000, 35000),
      partnerCount: randomBetween(200, 280),
      coordinates: [116.407, 39.904] as [number, number]
    },
    {
      code: 'shanghai',
      name: '上海市',
      level: 'province' as const,
      revenue: randomBetween(2200000, 2800000), // 第四大份额
      storeCount: randomBetween(700, 1100),
      userCount: randomBetween(20000, 28000),
      partnerCount: randomBetween(150, 220),
      coordinates: [121.473, 31.230] as [number, number]
    }
  ];

  // 计算其他地区的总和
  const otherRegionsRevenue = regions.provinces
    .filter(p => !['sichuan', 'guangdong', 'beijing', 'shanghai'].includes(p.code))
    .reduce((sum, province) => {
      const isSecondTier = ['jiangsu', 'shandong', 'hubei', 'zhejiang'].includes(province.code);
      const revenueRange = isSecondTier ? [800000, 1500000] : [300000, 800000];
      return sum + randomBetween(revenueRange[0], revenueRange[1]);
    }, 0);

  // 添加"其他地区"作为汇总
  const otherRegion = {
    code: 'others',
    name: '其他地区',
    level: 'province' as const,
    revenue: otherRegionsRevenue,
    storeCount: randomBetween(2000, 3500),
    userCount: randomBetween(50000, 80000),
    partnerCount: randomBetween(400, 700),
    coordinates: [108.0, 35.0] as [number, number] // 中国中心位置
  };

  // 返回主要地区 + 其他地区 + 完整的省份列表（用于其他功能）
  const allProvinces = regions.provinces.map(province => {
    const isFirstTier = ['beijing', 'shanghai', 'guangdong', 'zhejiang'].includes(province.code);
    const isSecondTier = ['jiangsu', 'shandong', 'sichuan', 'hubei'].includes(province.code);
    
    let revenueRange: [number, number];
    let storeRange: [number, number];
    let userRange: [number, number];
    let partnerRange: [number, number];
    
    if (isFirstTier) {
      revenueRange = [2000000, 5000000];
      storeRange = [800, 2000];
      userRange = [20000, 50000];
      partnerRange = [150, 400];
    } else if (isSecondTier) {
      revenueRange = [1200000, 3000000];
      storeRange = [400, 1200];
      userRange = [10000, 30000];
      partnerRange = [80, 250];
    } else {
      revenueRange = [500000, 1800000];
      storeRange = [150, 800];
      userRange = [3000, 18000];
      partnerRange = [30, 150];
    }
    
    return {
      code: province.code,
      name: province.name,
      level: 'province' as const,
      revenue: randomBetween(revenueRange[0], revenueRange[1]),
      storeCount: randomBetween(storeRange[0], storeRange[1]),
      userCount: randomBetween(userRange[0], userRange[1]),
      partnerCount: randomBetween(partnerRange[0], partnerRange[1]),
      coordinates: province.coordinates
    };
  });

  // 返回主要地区在前，其他地区紧随其后，然后是完整列表
  return [...mainRegions, otherRegion, ...allProvinces];
};

// 主要导出函数
export const generateMockData = (filters: FilterState): DashboardData => {
  return {
    overview: generateOverviewData(filters),
    dividend: generateDividendData(filters),
    rankings: generateRankingData(filters),
    charts: generateChartData(filters),
    map: generateMapData(filters)
  };
};

// 生成用户数据
export const generateUserData = (count: number = 50): UserData[] => {
  const users: UserData[] = [];
  const phonePrefix = ['138', '139', '150', '151', '152', '158', '159', '188', '189'];
  
  for (let i = 0; i < count; i++) {
    const joinDate = randomDate(new Date(2020, 0, 1), new Date(2024, 11, 31));
    const lastActiveDate = randomDate(joinDate, new Date());
    const totalConsumption = randomBetween(500, 50000);
    
    users.push({
      id: `user_${i}`,
      name: getRandomElement(partnerNames),
      phone: `${getRandomElement(phonePrefix)}${randomBetween(10000000, 99999999)}`,
      region: getRandomElement(regions.provinces.map(p => p.name)),
      totalConsumption,
      totalDividend: Math.floor(totalConsumption * randomFloat(0.05, 0.15)),
      consumptionPoints: Math.floor(totalConsumption * randomFloat(0.8, 1.2)),
      dividendCount: randomBetween(5, 50),
      lastActiveDate,
      joinDate,
      status: Math.random() > 0.15 ? 'active' : 'inactive'
    });
  }
  
  return users.sort((a, b) => b.totalConsumption - a.totalConsumption);
};

// 生成交易数据
export const generateTransactionData = (count: number = 100): TransactionData[] => {
  const transactions: TransactionData[] = [];
  const statusWeights = [0.85, 0.12, 0.03]; // 85% 成功, 12% 待处理, 3% 失败
  
  for (let i = 0; i < count; i++) {
    const amount = randomBetween(20, 2000);
    const discountRate = randomFloat(0.05, 0.25);
    const discountAmount = Math.floor(amount * discountRate);
    const platformRate = randomFloat(0.02, 0.05);
    const platformAmount = Math.floor(amount * platformRate);
    
    // 根据权重选择状态
    const rand = Math.random();
    let status: 'completed' | 'pending' | 'failed';
    if (rand < statusWeights[0]) status = 'completed';
    else if (rand < statusWeights[0] + statusWeights[1]) status = 'pending';
    else status = 'failed';
    
    transactions.push({
      id: `trans_${i}`,
      storeId: `store_${randomBetween(0, 29)}`,
      userId: `user_${randomBetween(0, 49)}`,
      amount,
      discountAmount,
      platformAmount,
      merchantAmount: amount - discountAmount - platformAmount,
      consumptionPoints: Math.floor(amount * randomFloat(0.8, 1.2)),
      timestamp: randomDate(new Date(2024, 0, 1), new Date()),
      status,
      qrCodeId: `qr_${randomBetween(100000, 999999)}`
    });
  }
  
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// 生成商务数据
export const generateBusinessData = (count: number = 30): BusinessData[] => {
  const businesses: BusinessData[] = [];
  
  for (let i = 0; i < count; i++) {
    const level = randomBetween(1, 4);
    const storeCount = randomBetween(level * 2, level * 8);
    const revenue = randomBetween(storeCount * 20000, storeCount * 80000);
    
    businesses.push({
      id: `business_${i}`,
      name: `${getRandomElement(businessNames)}${getRandomElement(businessSuffixes)}`,
      partnerId: `partner_${randomBetween(0, 19)}`,
      parentBusinessId: level > 1 ? `business_${randomBetween(0, i - 1)}` : undefined,
      level,
      storeCount,
      revenue,
      directDividend: Math.floor(revenue * randomFloat(0.08, 0.15)),
      indirectDividend: Math.floor(revenue * randomFloat(0.03, 0.08))
    });
  }
  
  return businesses.sort((a, b) => b.revenue - a.revenue);
};

// 生成实时数据更新
export const generateRealtimeUpdate = () => {
  return {
    timestamp: new Date(),
    newTransactions: randomBetween(5, 25),
    newRevenue: randomBetween(10000, 80000),
    newUsers: randomBetween(0, 8),
    systemStatus: Math.random() > 0.05 ? 'normal' : 'warning'
  };
};

// 导出地区数据供其他组件使用
export { regions };