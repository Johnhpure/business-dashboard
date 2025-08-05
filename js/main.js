// 主应用程序入口
import { DataManager } from './data.js';
import { ChartManager } from './charts.js';
import { AnimationManager } from './animations.js';

class Dashboard {
    constructor() {
        this.dataManager = new DataManager();
        this.chartManager = new ChartManager();
        this.animationManager = new AnimationManager();
        
        this.currentFilters = {
            timeRange: 'month',
            province: '',
            city: '',
            district: '',
            roles: ['partners', 'business', 'stores', 'users'],
            round: 25
        };
        
        this.refreshInterval = null;
        this.init();
    }

    async init() {
        try {
            console.log('Initializing dashboard...');
            
            // 显示加载状态
            this.showLoading();
            
            // 初始化数据
            console.log('Initializing data manager...');
            await this.dataManager.init();
            
            // 初始化图表
            console.log('Initializing chart manager...');
            this.chartManager.init();
            
            // 初始化动画管理器
            console.log('Initializing animation manager...');
            this.animationManager.init();
            
            // 绑定事件监听器
            console.log('Binding event listeners...');
            this.bindEventListeners();
            
            // 加载初始数据
            console.log('Loading initial data...');
            await this.loadData();
            
            // 启动实时更新
            this.startRealTimeUpdate();
            
            // 启动动画
            this.animationManager.startPageAnimations();
            
            // 隐藏加载状态
            this.hideLoading();
            
            console.log('Dashboard initialized successfully');
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
            console.error('Error stack:', error.stack);
            this.showError('系统初始化失败，请刷新页面重试');
            
            // 即使出错也尝试显示一些基本数据
            this.showFallbackData();
        }
    }

    bindEventListeners() {
        // 时间范围筛选
        const timeRangeSelect = document.getElementById('timeRange');
        timeRangeSelect?.addEventListener('change', (e) => {
            this.currentFilters.timeRange = e.target.value;
            this.loadData();
        });

        // 地域筛选
        const provinceSelect = document.getElementById('provinceSelect');
        const citySelect = document.getElementById('citySelect');
        const districtSelect = document.getElementById('districtSelect');

        provinceSelect?.addEventListener('change', (e) => {
            this.currentFilters.province = e.target.value;
            this.currentFilters.city = '';
            this.currentFilters.district = '';
            this.updateCityOptions();
            this.loadData();
        });

        citySelect?.addEventListener('change', (e) => {
            this.currentFilters.city = e.target.value;
            this.currentFilters.district = '';
            this.updateDistrictOptions();
            this.loadData();
        });

        districtSelect?.addEventListener('change', (e) => {
            this.currentFilters.district = e.target.value;
            this.loadData();
        });

        // 角色筛选
        const roleCheckboxes = document.querySelectorAll('.role-filter input[type="checkbox"]');
        roleCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateRoleFilters();
                this.loadData();
            });
        });

        // 分红轮次筛选
        const roundRange = document.getElementById('roundRange');
        const currentRoundSpan = document.getElementById('currentRound');
        
        roundRange?.addEventListener('input', (e) => {
            const value = e.target.value;
            this.currentFilters.round = parseInt(value);
            if (currentRoundSpan) {
                currentRoundSpan.textContent = `第${value}轮`;
            }
            this.loadData();
        });

        // 刷新按钮
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn?.addEventListener('click', () => {
            this.refreshData();
        });

        // 筛选面板折叠
        const collapseBtn = document.getElementById('collapseFilter');
        const filterPanel = document.querySelector('.filter-panel');
        
        collapseBtn?.addEventListener('click', () => {
            filterPanel?.classList.toggle('collapsed');
            const icon = collapseBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-left');
                icon.classList.toggle('fa-chevron-right');
            }
        });

        // 地图控制按钮
        const mapControls = document.querySelectorAll('[data-map-type]');
        mapControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 移除其他按钮的active状态
                mapControls.forEach(b => b.classList.remove('active'));
                // 添加当前按钮的active状态
                e.target.classList.add('active');
                
                const mapType = e.target.dataset.mapType;
                this.chartManager.updateMapData(mapType);
            });
        });

        // 图表控制按钮
        const chartControls = document.querySelectorAll('[data-period]');
        chartControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const container = e.target.closest('.chart-container');
                const controls = container.querySelectorAll('[data-period]');
                
                // 移除其他按钮的active状态
                controls.forEach(b => b.classList.remove('active'));
                // 添加当前按钮的active状态
                e.target.classList.add('active');
                
                const period = e.target.dataset.period;
                const chartId = container.querySelector('.chart').id;
                this.chartManager.updateChartPeriod(chartId, period);
            });
        });

        // 排行榜时间筛选
        const rankingSelects = document.querySelectorAll('.ranking-controls select');
        rankingSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                const period = e.target.value;
                const rankingId = e.target.closest('.ranking-card').querySelector('.ranking-list').id;
                this.updateRankingData(rankingId, period);
            });
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.refreshData();
                        break;
                    case 'f':
                        e.preventDefault();
                        const filterPanel = document.querySelector('.filter-panel');
                        filterPanel?.classList.toggle('collapsed');
                        break;
                }
            }
        });
    }

    async loadData() {
        try {
            console.log('Loading data with filters:', this.currentFilters);
            
            // 显示数据更新状态
            this.showDataUpdating();
            
            // 获取数据
            const data = await this.dataManager.getData(this.currentFilters);
            console.log('Received data:', data);
            
            // 更新KPI卡片
            this.updateKPICards(data.overview);
            
            // 更新分红进度
            this.updateDividendProgress(data.dividend);
            
            // 更新图表
            if (this.chartManager && this.chartManager.updateAllCharts) {
                this.chartManager.updateAllCharts(data);
            }
            
            // 更新排行榜
            this.updateRankings(data.rankings);
            
            // 隐藏数据更新状态
            this.hideDataUpdating();
            
        } catch (error) {
            console.error('Failed to load data:', error);
            this.showError('数据加载失败，请稍后重试');
        }
    }

    updateKPICards(overview) {
        console.log('Updating KPI cards with data:', overview);
        
        const kpiCards = document.querySelectorAll('.kpi-card');
        
        kpiCards.forEach(card => {
            const kpiType = card.dataset.kpi;
            const numberElement = card.querySelector('.number');
            const trendElement = card.querySelector('.kpi-trend span');
            
            console.log(`Processing KPI card: ${kpiType}`, overview[kpiType]);
            
            if (numberElement && overview[kpiType]) {
                const targetValue = overview[kpiType].value;
                
                // 直接设置数字，确保能显示
                if (typeof targetValue === 'number') {
                    numberElement.textContent = targetValue.toLocaleString();
                } else {
                    numberElement.textContent = '0';
                }
                
                // 更新趋势
                if (trendElement && overview[kpiType].trend) {
                    trendElement.textContent = overview[kpiType].trend;
                    const trendContainer = card.querySelector('.kpi-trend');
                    trendContainer.className = `kpi-trend ${overview[kpiType].trend.startsWith('+') ? 'positive' : 'negative'}`;
                }
                
                // 添加更新动画
                card.classList.add('data-updated');
                setTimeout(() => card.classList.remove('data-updated'), 600);
            } else {
                console.log(`No data found for KPI type: ${kpiType}`);
            }
        });
    }

    updateDividendProgress(dividend) {
        // 更新当前轮次
        const roundNumber = document.querySelector('.round-number .highlight');
        if (roundNumber) {
            roundNumber.textContent = dividend.currentRound;
        }
        
        // 更新进度环
        const progressRing = document.querySelector('.progress-ring-progress');
        const progressText = document.querySelector('.progress-circle .progress-text');
        
        if (progressRing && progressText) {
            const circumference = 2 * Math.PI * 52; // r = 52
            const progress = dividend.progress / 100;
            const offset = circumference - (progress * circumference);
            
            progressRing.style.strokeDasharray = circumference;
            progressRing.style.strokeDashoffset = offset;
            progressText.textContent = `${dividend.progress}%`;
        }
        
        // 更新分红信息
        const infoItems = document.querySelectorAll('.dividend-info .info-item');
        infoItems.forEach(item => {
            const label = item.querySelector('.label').textContent;
            const valueElement = item.querySelector('.value');
            
            if (label.includes('预计分红时间') && dividend.estimatedTime) {
                valueElement.textContent = dividend.estimatedTime;
            } else if (label.includes('预计分红金额') && dividend.estimatedAmount) {
                valueElement.textContent = `¥${dividend.estimatedAmount.toLocaleString()}`;
            }
        });
    }

    updateRankings(rankings) {
        // 更新合伙人排行榜
        this.updateRankingList('partnerRanking', rankings.partners);
        
        // 更新商户排行榜
        this.updateRankingList('storeRanking', rankings.stores);
    }

    updateRankingList(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container || !data) return;
        
        container.innerHTML = '';
        
        data.forEach((item, index) => {
            const rankingItem = document.createElement('div');
            rankingItem.className = 'ranking-item slide-in-left';
            rankingItem.style.animationDelay = `${index * 0.1}s`;
            
            const rankClass = index < 3 ? `top-${index + 1}` : 'other';
            
            rankingItem.innerHTML = `
                <div class="ranking-number ${rankClass}">${index + 1}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${item.name}</div>
                    <div class="ranking-details">
                        <span>${item.region || item.category}</span>
                        <span>${item.count || item.stores}个</span>
                    </div>
                </div>
                <div class="ranking-value">
                    <div class="ranking-amount">¥${item.amount.toLocaleString()}</div>
                    <div class="ranking-change ${item.change >= 0 ? 'positive' : 'negative'}">
                        <i class="fas fa-arrow-${item.change >= 0 ? 'up' : 'down'}"></i>
                        ${Math.abs(item.change)}%
                    </div>
                </div>
            `;
            
            container.appendChild(rankingItem);
        });
    }

    updateCityOptions() {
        const citySelect = document.getElementById('citySelect');
        const districtSelect = document.getElementById('districtSelect');
        
        if (!citySelect) return;
        
        // 清空城市和区县选项
        citySelect.innerHTML = '<option value="">选择城市</option>';
        districtSelect.innerHTML = '<option value="">选择区县</option>';
        
        if (this.currentFilters.province) {
            const cities = this.dataManager.getCitiesByProvince(this.currentFilters.province);
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.code;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
            citySelect.disabled = false;
        } else {
            citySelect.disabled = true;
            districtSelect.disabled = true;
        }
    }

    updateDistrictOptions() {
        const districtSelect = document.getElementById('districtSelect');
        
        if (!districtSelect) return;
        
        // 清空区县选项
        districtSelect.innerHTML = '<option value="">选择区县</option>';
        
        if (this.currentFilters.city) {
            const districts = this.dataManager.getDistrictsByCity(this.currentFilters.city);
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district.code;
                option.textContent = district.name;
                districtSelect.appendChild(option);
            });
            districtSelect.disabled = false;
        } else {
            districtSelect.disabled = true;
        }
    }

    updateRoleFilters() {
        const checkboxes = document.querySelectorAll('.role-filter input[type="checkbox"]');
        this.currentFilters.roles = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                this.currentFilters.roles.push(checkbox.value);
            }
        });
    }

    async refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        const icon = refreshBtn?.querySelector('i');
        
        if (icon) {
            icon.classList.add('rotate');
        }
        
        try {
            await this.loadData();
            this.showNotification('数据已更新', 'success');
        } catch (error) {
            this.showNotification('数据更新失败', 'error');
        } finally {
            if (icon) {
                setTimeout(() => icon.classList.remove('rotate'), 1000);
            }
        }
    }

    startRealTimeUpdate() {
        // 每30秒自动刷新数据
        this.refreshInterval = setInterval(() => {
            this.loadData();
        }, 30000);
    }

    stopRealTimeUpdate() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    showLoading() {
        // 可以添加全局加载状态
        console.log('Loading...');
    }

    hideLoading() {
        // 隐藏全局加载状态
        console.log('Loading complete');
    }

    showDataUpdating() {
        const indicator = document.querySelector('.real-time-indicator');
        if (indicator) {
            indicator.classList.add('updating');
        }
    }

    hideDataUpdating() {
        const indicator = document.querySelector('.real-time-indicator');
        if (indicator) {
            indicator.classList.remove('updating');
        }
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type} notification-enter`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    // 显示备用数据，确保页面有内容显示
    showFallbackData() {
        console.log('Showing fallback data...');
        
        // 直接设置KPI数据
        const kpiData = [
            { selector: '[data-kpi="revenue"] .number', value: '1,258.0w', unit: '元' },
            { selector: '[data-kpi="stores"] .number', value: '8,642', unit: '家' },
            { selector: '[data-kpi="users"] .number', value: '15.7w', unit: '人' },
            { selector: '[data-kpi="dividend"] .number', value: '251.6w', unit: '元' }
        ];
        
        kpiData.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                element.textContent = item.value;
                console.log(`Set ${item.selector} to ${item.value}`);
            }
        });
        
        // 显示排行榜数据
        this.showFallbackRankings();
    }

    showFallbackRankings() {
        const partnerData = [
            { name: '四川省5GP合伙人1', region: '四川省', count: 85, amount: 458000, change: 15.8 },
            { name: '广东省5GP合伙人1', region: '广东省', count: 92, amount: 423000, change: 12.3 },
            { name: '北京市5GP合伙人1', region: '北京市', count: 76, amount: 398000, change: 18.7 }
        ];
        
        const storeData = [
            { name: '老王餐厅', category: '餐饮', stores: 1, amount: 125000, change: 25.6 },
            { name: '小李超市', category: '零售', stores: 1, amount: 98000, change: 18.9 },
            { name: '阿华理发店', category: '服务', stores: 1, amount: 76000, change: 22.1 }
        ];
        
        this.updateRankingList('partnerRanking', partnerData);
        this.updateRankingList('storeRanking', storeData);
    }

    // 清理资源
    destroy() {
        this.stopRealTimeUpdate();
        this.chartManager.destroy();
        this.animationManager.destroy();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.destroy();
    }
});

export default Dashboard;