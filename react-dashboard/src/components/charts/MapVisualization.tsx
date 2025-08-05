import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { formatNumber, formatCurrency } from '../../utils/dataUtils';
import { BarChart3, DollarSign, Store, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as echarts from 'echarts';

export const MapVisualization: React.FC = () => {
  const { data, loading } = useDashboardStore();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [activeType, setActiveType] = useState<'revenue' | 'stores' | 'users'>('revenue');

  const getGradientColors = (index: number): [string, string] => {
    const gradients: [string, string][] = [
      ['#667eea', '#764ba2'], // 四川省 - 蓝紫渐变
      ['#43e97b', '#38f9d7'], // 广东省 - 绿青渐变
      ['#f093fb', '#f5576c'], // 北京市 - 粉红渐变
      ['#4facfe', '#00f2fe'], // 上海市 - 蓝青渐变
      ['#fa709a', '#fee140'], // 其他地区 - 粉黄渐变
    ];
    return gradients[index] || gradients[0];
  };

  const updateChart = () => {
    if (!chartInstance.current || !data?.map) return;

    const chartData = data.map.slice(0, 5).map((region, index) => {
      let value;
      switch (activeType) {
        case 'revenue':
          value = region.revenue;
          break;
        case 'stores':
          value = region.storeCount;
          break;
        case 'users':
          value = region.revenue * 0.1; // 模拟用户数据
          break;
        default:
          value = region.revenue;
      }

      return {
        name: region.name,
        value: value,
        revenue: region.revenue,
        storeCount: region.storeCount,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: getGradientColors(index)[0] },
            { offset: 1, color: getGradientColors(index)[1] }
          ])
        }
      };
    });

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(0, 212, 255, 0.5)',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 12
        },
        formatter: (params: any) => {
          const data = params.data;
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 6px; color: #00d4ff;">${data.name}</div>
              <div style="margin-bottom: 4px;">收入: ${formatCurrency(data.revenue)}</div>
              <div style="margin-bottom: 4px;">商户: ${formatNumber(data.storeCount)}家</div>
              <div>占比: ${params.percent}%</div>
            </div>
          `;
        }
      },
      series: [{
        name: '业务分布',
        type: 'pie',
        radius: ['35%', '75%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: 'rgba(0, 0, 0, 0.2)',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          color: '#ffffff',
          fontSize: 12,
          formatter: '{b}\n{d}%'
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 212, 255, 0.6)'
          },
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          scale: true,
          scaleSize: 5
        },
        data: chartData
      }],
      animation: true,
      animationEasing: 'elasticOut' as const,
      animationDelay: (idx: number) => idx * 100
    };

    chartInstance.current.setOption(option, true);
  };

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current || !data?.map) return;

    // 销毁现有图表实例
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // 创建新的图表实例
    chartInstance.current = echarts.init(chartRef.current);

    // 添加点击事件
    chartInstance.current.on('click', (params: any) => {
      if (params.data) {
        console.log('Region clicked:', params.data);
        // 这里可以添加钻取逻辑，比如显示详细信息或跳转到地区详情页
        // 可以触发一个回调或状态更新
      }
    });

    // 清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data?.map]);

  // 当activeType变化时更新图表
  useEffect(() => {
    if (chartInstance.current && data?.map) {
      updateChart();
    }
  }, [activeType, data?.map]);

  // 窗口大小变化时重新调整图表
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTypeChange = (type: 'revenue' | 'stores' | 'users') => {
    setActiveType(type);
  };

  if (!data || loading) {
    return (
      <Card className="glass-card p-6 h-96 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg font-medium mb-2">加载数据中...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 h-96 relative overflow-hidden">
      {/* 卡片头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">全国数据总览（当日）</h3>
        </div>

        {/* 交互式控制按钮 */}
        <div className="flex gap-1 bg-slate-800/30 rounded-lg p-1">
          {[
            { type: 'revenue', icon: DollarSign, label: '收入', color: 'from-green-500 to-emerald-600' },
            { type: 'stores', icon: Store, label: '商户', color: 'from-blue-500 to-cyan-600' },
            { type: 'users', icon: Users, label: '用户', color: 'from-purple-500 to-pink-600' }
          ].map(({ type, icon: Icon, label, color }) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeChange(type as 'revenue' | 'stores' | 'users')}
              className={`relative px-4 py-2 rounded-md text-xs font-medium transition-all duration-300 ${activeType === type
                  ? 'text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              {/* 活跃状态背景 */}
              <AnimatePresence>
                {activeType === type && (
                  <motion.div
                    layoutId="activeTab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 bg-gradient-to-r ${color} rounded-md`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>

              {/* 按钮内容 */}
              <div className="relative flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
                {activeType === type && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 主要内容区域 - 左右布局 */}
      <div className="flex gap-6 h-full">
        {/* 左侧：排名列表 */}
        <div className="w-80 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium text-slate-300">
              {activeType === 'revenue' && '收入排行榜'}
              {activeType === 'stores' && '商户数量排行榜'}
              {activeType === 'users' && '用户数量排行榜'}
            </h4>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {data.map.slice(0, 8).map((region, index) => {
                const value = activeType === 'revenue' ? region.revenue :
                  activeType === 'stores' ? region.storeCount :
                    Math.floor(region.revenue * 0.1);
                const isTop3 = index < 3;

                return (
                  <motion.div
                    key={`${region.code}-${activeType}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isTop3
                        ? 'bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-primary/20'
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                      }`}
                  >
                    {/* 排名 */}
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900' :
                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-slate-900' :
                          index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white' :
                            'bg-slate-700 text-slate-300'
                      }`}>
                      {index + 1}
                    </div>

                    {/* 地区信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${getGradientColors(index)[0]}, ${getGradientColors(index)[1]})`
                          }}
                        />
                        <span className="font-medium text-sm truncate">{region.name}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {activeType === 'revenue' && formatCurrency(value)}
                        {activeType === 'stores' && `${formatNumber(value)}家商户`}
                        {activeType === 'users' && `${formatNumber(value)}用户`}
                      </div>
                    </div>

                    {/* 趋势指示器 */}
                    <div className="flex items-center gap-1">
                      {Math.random() > 0.5 ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span className={`text-xs ${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                        {(Math.random() * 20 + 5).toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* 右侧：居中图表 */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            key={activeType}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <div
              ref={chartRef}
              className="w-full h-full max-w-sm"
              style={{ minHeight: '280px' }}
            />
          </motion.div>
        </div>
      </div>

      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
    </Card>
  );
};