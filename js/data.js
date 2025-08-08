// 数据管理模块
export class DataManager {
    constructor() {
        this.mockData = {
            regions: [],
            partners: [],
            business: [],
            stores: [],
            users: [],
            transactions: []
        };
        
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
    }

    async init() {
        // 生成模拟数据
        this.generateMockData();
        console.log('DataManager initialized with mock data');
    }

    generateMockData() {
        // 生成地区数据
        this.generateRegionData();
        
        // 生成合伙人数据
        this.generatePartnerData();
        
        // 生成商务数据
        this.generateBusinessData();
        
        // 生成商户数据
        this.generateStoreData();
        
        // 生成用户数据
        this.generateUserData();
        
        // 生成交易数据
        this.generateTransactionData();
    }

    generateRegionData() {
        const provinces = [
            { code: 'sichuan', name: '四川省', coordinates: [104.066, 30.651] },
            { code: 'guangdong', name: '广东省', coordinates: [113.266, 23.132] },
            { code: 'beijing', name: '北京市', coordinates: [116.407, 39.904] },
            { code: 'shanghai', name: '上海市', coordinates: [121.473, 31.230] },
            { code: 'zhejiang', name: '浙江省', coordinates: [120.152, 30.267] },
            { code: 'jiangsu', name: '江苏省', coordinates: [118.763, 32.061] },
            { code: 'shandong', name: '山东省', coordinates: [117.020, 36.670] },
            { code: 'henan', name: '河南省', coordinates: [113.649, 34.757] },
            { code: 'hubei', name: '湖北省', coordinates: [114.342, 30.546] },
            { code: 'hunan', name: '湖南省', coordinates: [112.983, 28.112] }
        ];

        const cities = {
            sichuan: [
                { code: 'chengdu', name: '成都市', parentCode: 'sichuan' },
                { code: 'ziyang', name: '资阳市', parentCode: 'sichuan' },
                { code: 'mianyang', name: '绵阳市', parentCode: 'sichuan' },
                { code: 'deyang', name: '德阳市', parentCode: 'sichuan' }
            ],
            guangdong: [
                { code: 'guangzhou', name: '广州市', parentCode: 'guangdong' },
                { code: 'shenzhen', name: '深圳市', parentCode: 'guangdong' },
                { code: 'dongguan', name: '东莞市', parentCode: 'guangdong' },
                { code: 'foshan', name: '佛山市', parentCode: 'guangdong' }
            ]
        };

        const districts = {
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
        };

        this.mockData.regions = {
            provinces,
            cities,
            districts
        };
    }

    generatePartnerData() {
        const levels = ['5GP', '4GP', '3GP', '2GP', 'LP'];
        const provinces = this.mockData.regions.provinces;
        
        provinces.forEach(province => {
            levels.forEach(level => {
                const count = level === '5GP' ? 1 : level === '4GP' ? 2 : level === '3GP' ? 3 : level === '2GP' ? 5 : 8;
                
                for (let i = 0; i < count; i++) {
                    this.mockData.partners.push({
                        id: `${province.code}_${level}_${i}`,
                        name: `${province.name}${level}合伙人${i + 1}`,
                        level,
                        region: province.code,
                        revenue: this.randomBetween(50000, 500000),
                        dividendAmount: this.randomBetween(10000, 100000),
                        storeCount: this.randomBetween(10, 100),
                        businessCount: this.randomBetween(5, 50),
                        joinDate: this.randomDate(new Date(2022, 0, 1), new Date()),
                        status: 'active'
                    });
                }
            });
        });
    }

    generateBusinessData() {
        const partners = this.mockData.partners;
        
        partners.forEach(partner => {
            const businessCount = partner.businessCount;
            
            for (let i = 0; i < businessCount; i++) {
                const business = {
                    id: `${partner.id}_business_${i}`,
                    name: `商务${i + 1}`,
                    partnerId: partner.id,
                    region: partner.region,
                    level: this.randomBetween(1, 3),
                    storeCount: this.randomBetween(2, 20),
                    revenue: this.randomBetween(5000, 50000),
                    directDividend: this.randomBetween(1000, 10000),
                    indirectDividend: this.randomBetween(500, 5000),
                    joinDate: this.randomDate(new Date(2022, 6, 1), new Date()),
                    status: 'active'
                };
                
                // 生成下级商务
                if (business.level < 3 && Math.random() > 0.7) {
                    const subBusinessCount = this.randomBetween(1, 3);
                    for (let j = 0; j < subBusinessCount; j++) {
                        this.mockData.business.push({
                            id: `${business.id}_sub_${j}`,
                            name: `${business.name}下级${j + 1}`,
                            partnerId: partner.id,
                            parentBusinessId: business.id,
                            region: partner.region,
                            level: business.level + 1,
                            storeCount: this.randomBetween(1, 5),
                            revenue: this.randomBetween(1000, 10000),
                            directDividend: this.randomBetween(200, 2000),
                            indirectDividend: 0,
                            joinDate: this.randomDate(business.joinDate, new Date()),
                            status: 'active'
                        });
                    }
                }
                
                this.mockData.business.push(business);
            }
        });
    }

    generateStoreData() {
        const business = this.mockData.business;
        const storeTypes = ['餐饮', '零售', '服务', '娱乐', '美容', '教育', '医疗', '汽车'];
        
        business.forEach(businessPerson => {
            const storeCount = businessPerson.storeCount;
            
            for (let i = 0; i < storeCount; i++) {
                this.mockData.stores.push({
                    id: `${businessPerson.id}_store_${i}`,
                    name: `${this.randomStorePrefix()}${this.randomStoreSuffix()}`,
                    businessId: businessPerson.id,
                    partnerId: businessPerson.partnerId,
                    region: businessPerson.region,
                    type: storeTypes[Math.floor(Math.random() * storeTypes.length)],
                    address: this.generateRandomAddress(businessPerson.region),
                    revenue: this.randomBetween(10000, 200000),
                    dividendAmount: this.randomBetween(2000, 40000),
                    discountRate: this.randomBetween(15, 25), // 让利比例
                    transactionCount: this.randomBetween(100, 2000),
                    averageOrderValue: this.randomBetween(50, 500),
                    joinDate: this.randomDate(new Date(2023, 0, 1), new Date()),
                    status: Math.random() > 0.1 ? 'active' : 'inactive',
                    qrCodeId: `QR_${Date.now()}_${i}`
                });
            }
        });
    }

    generateUserData() {
        const userCount = 156789; // 总用户数
        const regions = this.mockData.regions.provinces;
        
        for (let i = 0; i < Math.min(userCount, 1000); i++) { // 只生成1000个详细用户数据作为示例
            const region = regions[Math.floor(Math.random() * regions.length)];
            
            this.mockData.users.push({
                id: `user_${i}`,
                name: `用户${i + 1}`,
                phone: this.generateRandomPhone(),
                region: region.code,
                totalConsumption: this.randomBetween(100, 50000),
                totalDividend: this.randomBetween(20, 10000),
                consumptionPoints: this.randomBetween(10, 5000),
                dividendCount: this.randomBetween(1, 40),
                lastActiveDate: this.randomDate(new Date(2024, 0, 1), new Date()),
                joinDate: this.randomDate(new Date(2023, 0, 1), new Date()),
                status: Math.random() > 0.05 ? 'active' : 'inactive'
            });
        }
    }

    generateTransactionData() {
        const stores = this.mockData.stores;
        const users = this.mockData.users;
        
        // 生成最近30天的交易数据
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dailyTransactions = this.randomBetween(500, 2000);
            
            for (let i = 0; i < dailyTransactions; i++) {
                const store = stores[Math.floor(Math.random() * stores.length)];
                const user = users[Math.floor(Math.random() * users.length)];
                const amount = this.randomBetween(20, 1000);
                const discountAmount = Math.floor(amount * store.discountRate / 100);
                
                this.mockData.transactions.push({
                    id: `tx_${d.getTime()}_${i}`,
                    storeId: store.id,
                    userId: user.id,
                    amount: amount,
                    discountAmount: discountAmount,
                    platformAmount: discountAmount,
                    merchantAmount: amount - discountAmount,
                    consumptionPoints: discountAmount, // 消费点等于让利金额
                    timestamp: new Date(d.getTime() + this.randomBetween(0, 24 * 60 * 60 * 1000)),
                    status: 'completed',
                    qrCodeId: store.qrCodeId
                });
            }
        }
    }

    async getData(filters) {
        const cacheKey = JSON.stringify(filters);
        
        // 检查缓存
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        // 模拟API延迟
        await this.delay(200);
        
        // 根据筛选条件处理数据
        const filteredData = this.filterData(filters);
        
        // 生成返回数据
        const result = {
            overview: this.generateOverviewData(filteredData),
            dividend: this.generateDividendData(filteredData),
            charts: this.generateChartData(filteredData),
            rankings: this.generateRankingData(filteredData),
            map: this.generateMapData(filteredData)
        };
        
        // 缓存结果
        this.cache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
        });
        
        return result;
    }

    filterData(filters) {
        let filteredStores = [...this.mockData.stores];
        let filteredUsers = [...this.mockData.users];
        let filteredTransactions = [...this.mockData.transactions];
        
        // 地域筛选
        if (filters.province) {
            filteredStores = filteredStores.filter(store => store.region === filters.province);
            filteredUsers = filteredUsers.filter(user => user.region === filters.province);
        }
        
        // 时间筛选
        const now = new Date();
        let startDate;
        
        switch (filters.timeRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        
        filteredTransactions = filteredTransactions.filter(tx => tx.timestamp >= startDate);
        
        return {
            stores: filteredStores,
            users: filteredUsers,
            transactions: filteredTransactions,
            partners: this.mockData.partners,
            business: this.mockData.business
        };
    }

    generateOverviewData(data) {
        const totalRevenue = data.transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const platformRevenue = data.transactions.reduce((sum, tx) => sum + tx.platformAmount, 0);
        const activeStores = data.stores.filter(store => store.status === 'active').length;
        const activeUsers = data.users.filter(user => user.status === 'active').length;
        
        const result = {
            revenue: {
                value: totalRevenue || 12580000, // 提供默认值
                trend: '+15.8%'
            },
            stores: {
                value: activeStores || 8642,
                trend: '+8.3%'
            },
            users: {
                value: activeUsers || 156789,
                trend: '+23.7%'
            },
            dividend: {
                value: (platformRevenue * 0.8) || 2516000, // 80%用于分红
                trend: '+12.5%'
            }
        };
        
        console.log('Generated overview data:', result);
        return result;
    }

    generateDividendData(data) {
        const currentRound = 25;
        const progress = 73;
        const poolBalance = 2516000;
        
        return {
            currentRound,
            progress,
            poolBalance,
            estimatedTime: '2天后',
            estimatedAmount: 680000,
            distribution: {
                partners: 0.4,
                business: 0.25,
                stores: 0.2,
                users: 0.15
            }
        };
    }

    generateChartData(data) {
        // 生成图表数据
        return {
            revenue: this.generateRevenueChartData(data),
            dividend: this.generateDividendChartData(data),
            region: this.generateRegionChartData(data)
        };
    }

    generateRankingData(data) {
        // 合伙人排行
        const partnerRanking = this.mockData.partners
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)
            .map(partner => ({
                name: partner.name,
                region: this.getRegionName(partner.region),
                count: partner.storeCount,
                amount: partner.revenue,
                change: this.randomBetween(-10, 30)
            }));
        
        // 商户排行
        const storeRanking = data.stores
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)
            .map(store => ({
                name: store.name,
                category: store.type,
                stores: 1,
                amount: store.revenue,
                change: this.randomBetween(-15, 25)
            }));
        
        return {
            partners: partnerRanking,
            stores: storeRanking
        };
    }

    generateMapData(data) {
        const provinces = this.mockData.regions.provinces;
        
        return provinces.map(province => {
            const provinceStores = data.stores.filter(store => store.region === province.code);
            const provinceRevenue = provinceStores.reduce((sum, store) => sum + store.revenue, 0);
            
            return {
                name: province.name,
                code: province.code,
                value: provinceRevenue,
                storeCount: provinceStores.length,
                coordinates: province.coordinates
            };
        });
    }

    // 辅助方法
    getCitiesByProvince(provinceCode) {
        return this.mockData.regions.cities[provinceCode] || [];
    }

    getDistrictsByCity(cityCode) {
        return this.mockData.regions.districts[cityCode] || [];
    }

    getRegionName(code) {
        const province = this.mockData.regions.provinces.find(p => p.code === code);
        return province ? province.name : code;
    }

    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    generateRandomPhone() {
        const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        return prefix + suffix;
    }

    generateRandomAddress(regionCode) {
        const streets = ['中山路', '人民路', '解放路', '建设路', '文化路', '商业街', '步行街'];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const number = this.randomBetween(1, 999);
        return `${street}${number}号`;
    }

    randomStorePrefix() {
        const prefixes = ['老王', '小李', '阿华', '大众', '新时代', '金牌', '品味', '优选', '精品', '时尚'];
        return prefixes[Math.floor(Math.random() * prefixes.length)];
    }

    randomStoreSuffix() {
        const suffixes = ['餐厅', '小吃店', '超市', '便利店', '理发店', '美容院', '药店', '书店', '咖啡厅', '奶茶店'];
        return suffixes[Math.floor(Math.random() * suffixes.length)];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateRevenueChartData(data, period = 'week') {
        // 生成收入趋势数据
        const result = [];
        const now = new Date();
        
        switch (period) {
            case 'week':
                // 生成7天数据
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                    const dayTransactions = data.transactions.filter(tx => {
                        const txDate = new Date(tx.timestamp);
                        return txDate.toDateString() === date.toDateString();
                    });
                    
                    const dayRevenue = dayTransactions.reduce((sum, tx) => sum + tx.amount, 0) || 
                                     (Math.floor(Math.random() * 200000) + 100000);
                    
                    result.push({
                        date: `${date.getMonth() + 1}月${date.getDate()}日`,
                        revenue: dayRevenue,
                        transactions: dayTransactions.length
                    });
                }
                break;
                
            case 'month':
                // 生成30天数据，每3天一个点
                for (let i = 27; i >= 0; i -= 3) {
                    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                    const periodTransactions = data.transactions.filter(tx => {
                        const txDate = new Date(tx.timestamp);
                        return Math.abs(txDate.getTime() - date.getTime()) <= 3 * 24 * 60 * 60 * 1000;
                    });
                    
                    const periodRevenue = periodTransactions.reduce((sum, tx) => sum + tx.amount, 0) || 
                                        (Math.floor(Math.random() * 300000) + 150000);
                    
                    result.push({
                        date: `${date.getMonth() + 1}/${date.getDate()}`,
                        revenue: periodRevenue,
                        transactions: periodTransactions.length
                    });
                }
                break;
                
            case 'year':
                // 生成12个月数据
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(now);
                    date.setMonth(date.getMonth() - i);
                    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', 
                                      '7月', '8月', '9月', '10月', '11月', '12月'];
                    
                    // 模拟月度收入数据
                    const monthRevenue = Math.floor(Math.random() * 2000000) + 1000000;
                    
                    result.push({
                        date: monthNames[date.getMonth()],
                        revenue: monthRevenue,
                        transactions: Math.floor(monthRevenue / 200) // 估算交易数量
                    });
                }
                break;
                
            default:
                return this.generateRevenueChartData(data, 'week');
        }
        
        return result;
    }

    generateDividendChartData(data) {
        // 生成分红分布数据
        return [
            { name: '合伙人', value: 40, color: '#667eea' },
            { name: '商务', value: 25, color: '#764ba2' },
            { name: '商户', value: 20, color: '#f093fb' },
            { name: '用户', value: 15, color: '#f5576c' }
        ];
    }

    generateRegionChartData(data) {
        // 生成地区对比数据
        const regions = this.mockData.regions.provinces.slice(0, 6);
        
        return regions.map(region => {
            const regionStores = data.stores.filter(store => store.region === region.code);
            const regionRevenue = regionStores.reduce((sum, store) => sum + store.revenue, 0);
            
            return {
                name: region.name,
                revenue: regionRevenue,
                stores: regionStores.length,
                growth: this.randomBetween(-5, 30)
            };
        });
    }
}