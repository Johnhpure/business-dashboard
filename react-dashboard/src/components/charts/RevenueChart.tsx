import React from 'react';
import { Card } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { formatCurrency, formatNumber } from '../../utils/dataUtils';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const RevenueChart: React.FC = () => {
  const { data, loading } = useDashboardStore();

  if (!data || loading) {
    return (
      <Card className="glass-card p-6 h-80 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg font-medium mb-2">加载图表数据中...</div>
        </div>
      </Card>
    );
  }

  const chartData = data.charts.revenue;
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const maxTransactions = Math.max(...chartData.map(d => d.transactions));

  // 计算总收入和增长率
  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = totalRevenue / chartData.length;
  const firstRevenue = chartData[0]?.revenue || 0;
  const lastRevenue = chartData[chartData.length - 1]?.revenue || 0;
  const growthRate = firstRevenue > 0 ? ((lastRevenue - firstRevenue) / firstRevenue * 100) : 0;

  return (
    <Card className="glass-card p-6 h-96">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">收入趋势分析</h3>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-green-400" />
          <span className={growthRate >= 0 ? 'text-green-400' : 'text-red-400'}>
            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <div className="text-xl font-bold text-primary mb-1">{formatCurrency(totalRevenue)}</div>
          <div className="text-xs text-muted-foreground">总收入</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <div className="text-xl font-bold text-green-400 mb-1">{formatCurrency(avgRevenue)}</div>
          <div className="text-xs text-muted-foreground">平均收入</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <div className="text-xl font-bold text-yellow-400 mb-1">
            {formatNumber(chartData.reduce((sum, d) => sum + d.transactions, 0))}
          </div>
          <div className="text-xs text-muted-foreground">总交易数</div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="relative h-48 bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
        <div className="absolute inset-4 flex items-end justify-between gap-2">
          {chartData.map((item, index) => {
            const revenueHeight = (item.revenue / maxRevenue) * 100;
            const transactionHeight = (item.transactions / maxTransactions) * 100;
            
            return (
              <div key={item.date} className="flex-1 flex flex-col items-center gap-1 max-w-8">
                {/* 收入柱状图 */}
                <motion.div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md relative group cursor-pointer shadow-lg"
                  style={{ height: `${revenueHeight}%`, minHeight: '4px' }}
                  initial={{ height: 0 }}
                  animate={{ height: `${revenueHeight}%` }}
                  transition={{ delay: index * 0.05, duration: 0.8 }}
                >
                  {/* 悬停提示 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-xl border border-slate-600">
                    <div className="font-semibold">{formatCurrency(item.revenue)}</div>
                    <div className="text-green-400">{formatNumber(item.transactions)}笔交易</div>
                    <div className="text-muted-foreground">{new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</div>
                  </div>
                </motion.div>

                {/* 交易量线条 */}
                <motion.div
                  className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-md opacity-70 shadow-md"
                  style={{ height: `${transactionHeight * 0.25}%`, minHeight: '2px' }}
                  initial={{ height: 0 }}
                  animate={{ height: `${transactionHeight * 0.25}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.8 }}
                />
              </div>
            );
          })}
        </div>

        {/* Y轴标签 */}
        <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-between text-xs text-muted-foreground -ml-16">
          <span className="bg-slate-800/80 px-2 py-1 rounded">{formatCurrency(maxRevenue)}</span>
          <span className="bg-slate-800/80 px-2 py-1 rounded">{formatCurrency(maxRevenue * 0.5)}</span>
          <span className="bg-slate-800/80 px-2 py-1 rounded">0</span>
        </div>

        {/* 网格线 */}
        <div className="absolute inset-4 pointer-events-none">
          <div className="h-full border-l border-slate-700/30"></div>
          <div className="absolute top-0 left-0 right-0 border-t border-slate-700/30"></div>
          <div className="absolute top-1/2 left-0 right-0 border-t border-slate-700/20"></div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/30"></div>
        </div>
      </div>

      {/* X轴标签 */}
      <div className="flex justify-between mt-3 text-xs text-muted-foreground px-4">
        <span className="bg-slate-800/50 px-2 py-1 rounded">
          {new Date(chartData[0]?.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
        </span>
        <span className="font-medium">收入趋势分析</span>
        <span className="bg-slate-800/50 px-2 py-1 rounded">
          {new Date(chartData[chartData.length - 1]?.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* 图例 */}
      <div className="flex justify-center gap-8 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded shadow-sm"></div>
          <span className="font-medium">收入</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-600 to-green-400 rounded opacity-70 shadow-sm"></div>
          <span className="font-medium">交易量</span>
        </div>
      </div>
    </Card>
  );
};