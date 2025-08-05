// 图表管理模块
export class ChartManager {
    constructor() {
        this.charts = new Map();
        this.theme = this.createDarkTheme();
    }

    init() {
        // 初始化所有图表
        this.initChinaMap();
        this.initRevenueChart();
        this.initDividendChart();
        
        console.log('ChartManager initialized');
    }

    createDarkTheme() {
        return {
            backgroundColor: 'transparent',
            textStyle: {
                color: '#ffffff'
            },
            title: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            legend: {
                textStyle: {
                    color: '#b8c5d6'
                }
            },
            grid: {
                borderColor: 'rgba(255, 255, 255, 0.1)'
            },
            categoryAxis: {
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisLabel: {
                    color: '#b8c5d6'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            },
            valueAxis: {
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                axisLabel: {
                    color: '#b8c5d6'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            },
            toolbox: {
                iconStyle: {
                    borderColor: '#b8c5d6'
                }
            },
            dataZoom: {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                fillerColor: 'rgba(0, 212, 255, 0.2)',
                handleColor: '#00d4ff',
                textStyle: {
                    color: '#b8c5d6'
                }
            }
        };
    }

    initChinaMap() {
        const mapContainer = document.getElementById('chinaMap');
        if (!mapContainer) return;

        const chart = echarts.init(mapContainer);
        
        // 注册中国地图
        fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
            .then(response => response.json())
            .then(geoJson => {
                echarts.registerMap('china', geoJson);
                
                const option = {
                    ...this.theme,
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: 'rgba(0, 212, 255, 0.5)',
                        textStyle: {
                            color: '#ffffff'
                        },
                        formatter: function(params) {
                            if (params.data) {
                                return `
                                    <div style="padding: 8px;">
                                        <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
                                        <div>收入: ¥${(params.data.value || 0).toLocaleString()}</div>
                                        <div>商户: ${params.data.storeCount || 0}家</div>
                                    </div>
                                `;
                            }
                            return params.name;
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: 1000000,
                        left: 'left',
                        top: 'bottom',
                        text: ['高', '低'],
                        textStyle: {
                            color: '#b8c5d6'
                        },
                        inRange: {
                            color: ['#0a1929', '#1565c0', '#1976d2', '#1e88e5', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd']
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    },
                    geo: {
                        map: 'china',
                        roam: true,
                        scaleLimit: {
                            min: 1,
                            max: 3
                        },
                        zoom: 1.2,
                        itemStyle: {
                            areaColor: 'rgba(0, 212, 255, 0.1)',
                            borderColor: 'rgba(0, 212, 255, 0.3)',
                            borderWidth: 1
                        },
                        emphasis: {
                            itemStyle: {
                                areaColor: 'rgba(0, 212, 255, 0.3)',
                                borderColor: '#00d4ff',
                                borderWidth: 2
                            }
                        },
                        label: {
                            show: false,
                            color: '#ffffff'
                        }
                    },
                    series: [
                        {
                            name: '业务数据',
                            type: 'map',
                            geoIndex: 0,
                            data: [] // 将通过updateMapData更新
                        }
                    ]
                };
                
                chart.setOption(option);
                this.charts.set('chinaMap', chart);
                
                // 添加点击事件
                chart.on('click', (params) => {
                    if (params.data) {
                        console.log('Map clicked:', params.data);
                        // 可以在这里添加地图钻取逻辑
                    }
                });
            })
            .catch(error => {
                console.error('Failed to load China map data:', error);
                // 使用备用的简化地图数据
                this.initSimpleMap(chart);
            });
    }

    initSimpleMap(chart) {
        // 简化的地图配置，不依赖外部地图数据
        const option = {
            ...this.theme,
            title: {
                text: '全国业务分布',
                left: 'center',
                textStyle: {
                    color: '#ffffff',
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 212, 255, 0.5)',
                textStyle: {
                    color: '#ffffff'
                }
            },
            series: [
                {
                    name: '业务分布',
                    type: 'pie',
                    radius: ['30%', '70%'],
                    center: ['50%', '60%'],
                    data: [
                        { value: 1048, name: '四川省' },
                        { value: 735, name: '广东省' },
                        { value: 580, name: '北京市' },
                        { value: 484, name: '上海市' },
                        { value: 300, name: '其他地区' }
                    ],
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: 'rgba(0, 0, 0, 0.2)',
                        borderWidth: 2
                    },
                    label: {
                        color: '#ffffff'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 212, 255, 0.5)'
                        }
                    }
                }
            ]
        };
        
        chart.setOption(option);
        this.charts.set('chinaMap', chart);
    }

    initRevenueChart() {
        const chartContainer = document.getElementById('revenueChart');
        if (!chartContainer) return;

        const chart = echarts.init(chartContainer);
        
        const option = {
            ...this.theme,
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 212, 255, 0.5)',
                textStyle: {
                    color: '#ffffff'
                },
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: 'rgba(0, 212, 255, 0.5)'
                    }
                }
            },
            legend: {
                data: ['收入', '交易量'],
                top: 10,
                textStyle: {
                    color: '#b8c5d6'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: [], // 将通过updateChartData更新
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    axisLabel: {
                        color: '#b8c5d6'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '收入(元)',
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    axisLabel: {
                        color: '#b8c5d6',
                        formatter: function(value) {
                            return value >= 10000 ? (value / 10000) + 'w' : value;
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    }
                },
                {
                    type: 'value',
                    name: '交易量',
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    axisLabel: {
                        color: '#b8c5d6'
                    }
                }
            ],
            series: [
                {
                    name: '收入',
                    type: 'line',
                    smooth: true,
                    data: [],
                    lineStyle: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#667eea' },
                            { offset: 1, color: '#764ba2' }
                        ])
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
                            { offset: 1, color: 'rgba(118, 75, 162, 0.1)' }
                        ])
                    },
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: {
                        color: '#667eea',
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }
                },
                {
                    name: '交易量',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: [],
                    lineStyle: {
                        width: 2,
                        color: '#00d4ff'
                    },
                    symbol: 'diamond',
                    symbolSize: 5,
                    itemStyle: {
                        color: '#00d4ff'
                    }
                }
            ]
        };
        
        chart.setOption(option);
        this.charts.set('revenueChart', chart);
    }

    initDividendChart() {
        const chartContainer = document.getElementById('dividendChart');
        if (!chartContainer) return;

        const chart = echarts.init(chartContainer);
        
        const option = {
            ...this.theme,
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 212, 255, 0.5)',
                textStyle: {
                    color: '#ffffff'
                },
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'middle',
                textStyle: {
                    color: '#b8c5d6'
                }
            },
            series: [
                {
                    name: '分红分布',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['60%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: 'rgba(0, 0, 0, 0.2)',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '18',
                            fontWeight: 'bold',
                            color: '#ffffff'
                        },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 212, 255, 0.5)'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { 
                            value: 40, 
                            name: '合伙人',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#667eea' },
                                    { offset: 1, color: '#764ba2' }
                                ])
                            }
                        },
                        { 
                            value: 25, 
                            name: '商务',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#f093fb' },
                                    { offset: 1, color: '#f5576c' }
                                ])
                            }
                        },
                        { 
                            value: 20, 
                            name: '商户',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#4facfe' },
                                    { offset: 1, color: '#00f2fe' }
                                ])
                            }
                        },
                        { 
                            value: 15, 
                            name: '用户',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#43e97b' },
                                    { offset: 1, color: '#38f9d7' }
                                ])
                            }
                        }
                    ]
                }
            ]
        };
        
        chart.setOption(option);
        this.charts.set('dividendChart', chart);
    }

    updateAllCharts(data) {
        this.updateMapData('revenue', data.map);
        this.updateRevenueChart(data.charts.revenue);
        this.updateDividendChart(data.charts.dividend);
    }

    updateMapData(type, mapData) {
        const chart = this.charts.get('chinaMap');
        if (!chart || !mapData) return;

        const option = chart.getOption();
        
        // 更新地图数据
        const seriesData = mapData.map(item => ({
            name: item.name,
            value: type === 'revenue' ? item.value : 
                   type === 'stores' ? item.storeCount : 
                   item.value,
            storeCount: item.storeCount
        }));

        option.series[0].data = seriesData;
        
        // 更新visualMap的最大值
        const maxValue = Math.max(...seriesData.map(item => item.value));
        if (option.visualMap && option.visualMap[0]) {
            option.visualMap[0].max = maxValue;
        }
        
        chart.setOption(option);
    }

    updateRevenueChart(revenueData) {
        const chart = this.charts.get('revenueChart');
        if (!chart || !revenueData) return;

        const dates = revenueData.map(item => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        const revenues = revenueData.map(item => item.revenue);
        const transactions = revenueData.map(item => item.transactions);

        const option = chart.getOption();
        option.xAxis[0].data = dates;
        option.series[0].data = revenues;
        option.series[1].data = transactions;
        
        chart.setOption(option);
    }

    updateDividendChart(dividendData) {
        const chart = this.charts.get('dividendChart');
        if (!chart || !dividendData) return;

        const option = chart.getOption();
        option.series[0].data = dividendData;
        
        chart.setOption(option);
    }

    updateChartPeriod(chartId, period) {
        // 根据时间周期更新图表数据
        console.log(`Updating chart ${chartId} for period ${period}`);
        
        // 这里可以重新获取对应时间周期的数据
        // 暂时使用模拟数据
        if (chartId === 'revenueChart') {
            this.generateMockRevenueData(period);
        }
    }

    generateMockRevenueData(period) {
        const chart = this.charts.get('revenueChart');
        if (!chart) return;

        let days;
        switch (period) {
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
            default: days = 30;
        }

        const dates = [];
        const revenues = [];
        const transactions = [];
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
            revenues.push(Math.floor(Math.random() * 100000) + 50000);
            transactions.push(Math.floor(Math.random() * 500) + 200);
        }

        const option = chart.getOption();
        option.xAxis[0].data = dates;
        option.series[0].data = revenues;
        option.series[1].data = transactions;
        
        chart.setOption(option);
    }

    // 响应式处理
    handleResize() {
        this.charts.forEach(chart => {
            chart.resize();
        });
    }

    // 销毁所有图表
    destroy() {
        this.charts.forEach(chart => {
            chart.dispose();
        });
        this.charts.clear();
    }
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
    if (window.dashboard && window.dashboard.chartManager) {
        window.dashboard.chartManager.handleResize();
    }
});