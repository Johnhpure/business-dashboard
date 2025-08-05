import React, { useState } from 'react';
import { Card } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { formatCurrency, formatNumber } from '../../utils/dataUtils';
import { Store, TrendingUp, TrendingDown, MapPin, ShoppingCart, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

export const StoreRanking: React.FC = () => {
  const { data, loading } = useDashboardStore();
  const [sortBy, setSortBy] = useState<'revenue' | 'dividend' | 'transactions'>('revenue');

  if (!data || loading) {
    return (
      <Card className="glass-card p-6 h-96 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg font-medium mb-2">加载商户数据中...</div>
        </div>
      </Card>
    );
  }

  // 根据选择的排序方式排序
  const sortedStores = [...data.rankings.stores].sort((a, b) => {
    switch (sortBy) {
      case 'dividend':
        return b.dividendAmount - a.dividendAmount;
      case 'transactions':
        return b.transactionCount - a.transactionCount;
      default:
        return b.revenue - a.revenue;
    }
  });

  const getRankBadge = (index: number) => {
    const colors = [
      'bg-gradient-to-r from-yellow-400 to-yellow-600',
      'bg-gradient-to-r from-gray-300 to-gray-500',
      'bg-gradient-to-r from-amber-600 to-amber-800'
    ];
    
    if (index < 3) {
      return (
        <div className={`w-6 h-6 rounded-full ${colors[index]} flex items-center justify-center text-white text-xs font-bold`}>
          {index + 1}
        </div>
      );
    }
    
    return (
      <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold">
        {index + 1}
      </div>
    );
  };

  const getSortValue = (store: any) => {
    switch (sortBy) {
      case 'dividend':
        return formatCurrency(store.dividendAmount);
      case 'transactions':
        return `${formatNumber(store.transactionCount)}笔`;
      default:
        return formatCurrency(store.revenue);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      '餐饮': 'bg-red-500/20 text-red-400',
      '零售': 'bg-blue-500/20 text-blue-400',
      '服务': 'bg-green-500/20 text-green-400',
      '娱乐': 'bg-purple-500/20 text-purple-400',
      '美容': 'bg-pink-500/20 text-pink-400',
      '教育': 'bg-yellow-500/20 text-yellow-400',
      '医疗': 'bg-cyan-500/20 text-cyan-400',
      '汽车': 'bg-orange-500/20 text-orange-400',
      '家居': 'bg-indigo-500/20 text-indigo-400',
      '数码': 'bg-teal-500/20 text-teal-400'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <Card className="glass-card p-6 h-96">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">商户收益排行</h3>
        </div>
        
        {/* 排序选择 */}
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
          {[
            { key: 'revenue', label: '收入' },
            { key: 'dividend', label: '分红' },
            { key: 'transactions', label: '交易' }
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key as any)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                sortBy === option.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 商户列表 */}
      <div className="space-y-2 overflow-y-auto h-80">
        {sortedStores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-200 group"
          >
            {/* 排名 */}
            <div className="flex items-center justify-center">
              {getRankBadge(index)}
            </div>

            {/* 商户信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">{store.name}</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(store.type)}`}>
                    {store.type}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    store.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                  } shadow-sm`} />
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{getSortValue(store)}</div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    store.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {store.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {store.change >= 0 ? '+' : ''}{store.change}%
                  </div>
                </div>
              </div>

              {/* 地址 */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{store.region} · {store.address}</span>
              </div>

              {/* 详细数据 */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-1 bg-slate-800/30 rounded-lg px-2 py-1">
                  <ShoppingCart className="h-3 w-3 text-blue-400" />
                  <span className="text-muted-foreground font-medium">
                    {formatNumber(store.transactionCount)}笔
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-800/30 rounded-lg px-2 py-1">
                  <Percent className="h-3 w-3 text-green-400" />
                  <span className="text-muted-foreground font-medium">
                    {store.discountRate}%折扣
                  </span>
                </div>
                <div className="text-muted-foreground bg-slate-800/30 rounded-lg px-2 py-1 font-medium">
                  客单价: ¥{store.averageOrderValue}
                </div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="w-20 flex-shrink-0">
              <div className="w-full bg-slate-700/50 rounded-full h-2 mb-1">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (store.revenue / sortedStores[0].revenue) * 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                />
              </div>
              <div className="text-xs text-center text-muted-foreground">
                {Math.round((store.revenue / sortedStores[0].revenue) * 100)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 底部统计 */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <div className="font-bold text-primary">
              {formatCurrency(sortedStores.reduce((sum, s) => sum + s.revenue, 0))}
            </div>
            <div className="text-muted-foreground">总收入</div>
          </div>
          <div>
            <div className="font-bold text-green-400">
              {formatCurrency(sortedStores.reduce((sum, s) => sum + s.dividendAmount, 0))}
            </div>
            <div className="text-muted-foreground">总分红</div>
          </div>
          <div>
            <div className="font-bold text-blue-400">
              {formatNumber(sortedStores.reduce((sum, s) => sum + s.transactionCount, 0))}笔
            </div>
            <div className="text-muted-foreground">总交易</div>
          </div>
          <div>
            <div className="font-bold text-yellow-400">
              {sortedStores.filter(s => s.status === 'active').length}家
            </div>
            <div className="text-muted-foreground">活跃商户</div>
          </div>
        </div>
      </div>
    </Card>
  );
};