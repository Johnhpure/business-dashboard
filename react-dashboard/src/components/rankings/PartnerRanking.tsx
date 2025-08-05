import React, { useState } from 'react';
import { Card } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { formatCurrency, formatNumber, getLevelColor } from '../../utils/dataUtils';
import { Trophy, TrendingUp, TrendingDown, Users, Store } from 'lucide-react';
import { motion } from 'framer-motion';

export const PartnerRanking: React.FC = () => {
  const { data, loading } = useDashboardStore();
  const [sortBy, setSortBy] = useState<'revenue' | 'dividend' | 'stores'>('revenue');

  if (!data || loading) {
    return (
      <Card className="glass-card p-6 h-96 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg font-medium mb-2">加载排行数据中...</div>
        </div>
      </Card>
    );
  }

  // 根据选择的排序方式排序
  const sortedPartners = [...data.rankings.partners].sort((a, b) => {
    switch (sortBy) {
      case 'dividend':
        return b.dividendAmount - a.dividendAmount;
      case 'stores':
        return b.storeCount - a.storeCount;
      default:
        return b.revenue - a.revenue;
    }
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-yellow-400" />;
    if (index === 1) return <Trophy className="h-4 w-4 text-gray-300" />;
    if (index === 2) return <Trophy className="h-4 w-4 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>;
  };

  const getSortValue = (partner: any) => {
    switch (sortBy) {
      case 'dividend':
        return formatCurrency(partner.dividendAmount);
      case 'stores':
        return `${formatNumber(partner.storeCount)}家`;
      default:
        return formatCurrency(partner.revenue);
    }
  };

  return (
    <Card className="glass-card p-6 h-96">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">合伙人收益排行</h3>
        </div>
        
        {/* 排序选择 */}
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
          {[
            { key: 'revenue', label: '收入' },
            { key: 'dividend', label: '分红' },
            { key: 'stores', label: '商户' }
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

      {/* 排行榜列表 */}
      <div className="space-y-2 overflow-y-auto h-80">
        {sortedPartners.map((partner, index) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-200 group"
          >
            {/* 排名 */}
            <div className="flex items-center justify-center w-8 h-8">
              {getRankIcon(index)}
            </div>

            {/* 等级标识 */}
            <div className={`px-2 py-1 rounded text-xs font-bold text-white ${getLevelColor(partner.level)}`}>
              {partner.level}
            </div>

            {/* 合伙人信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-sm truncate">{partner.name}</div>
                  <div className="text-xs text-muted-foreground font-medium">{partner.region}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{getSortValue(partner)}</div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    partner.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {partner.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {partner.change >= 0 ? '+' : ''}{partner.change}%
                  </div>
                </div>
              </div>

              {/* 详细信息 */}
              <div className="flex items-center gap-3 mt-3 text-xs">
                <div className="flex items-center gap-1 bg-slate-800/30 rounded-lg px-2 py-1">
                  <Store className="h-3 w-3 text-blue-400" />
                  <span className="text-muted-foreground font-medium">
                    {formatNumber(partner.storeCount)}家
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-800/30 rounded-lg px-2 py-1">
                  <Users className="h-3 w-3 text-green-400" />
                  <span className="text-muted-foreground font-medium">
                    {formatNumber(partner.businessCount)}个商务
                  </span>
                </div>
                {sortBy !== 'dividend' && (
                  <div className="bg-slate-800/30 rounded-lg px-2 py-1 text-muted-foreground font-medium">
                    分红: {formatCurrency(partner.dividendAmount)}
                  </div>
                )}
              </div>
            </div>

            {/* 进度条 */}
            <div className="w-20 flex-shrink-0">
              <div className="w-full bg-slate-700/50 rounded-full h-2 mb-1">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (partner.revenue / sortedPartners[0].revenue) * 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                />
              </div>
              <div className="text-xs text-center text-muted-foreground">
                {Math.round((partner.revenue / sortedPartners[0].revenue) * 100)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 底部统计 */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <div className="font-bold text-primary">
              {formatCurrency(sortedPartners.reduce((sum, p) => sum + p.revenue, 0))}
            </div>
            <div className="text-muted-foreground">总收入</div>
          </div>
          <div>
            <div className="font-bold text-green-400">
              {formatCurrency(sortedPartners.reduce((sum, p) => sum + p.dividendAmount, 0))}
            </div>
            <div className="text-muted-foreground">总分红</div>
          </div>
          <div>
            <div className="font-bold text-yellow-400">
              {formatNumber(sortedPartners.reduce((sum, p) => sum + p.storeCount, 0))}家
            </div>
            <div className="text-muted-foreground">总商户</div>
          </div>
        </div>
      </div>
    </Card>
  );
};