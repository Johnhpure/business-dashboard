import React from 'react';
import { Card } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { formatCurrency } from '../../utils/dataUtils';
import { PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export const DividendDistribution: React.FC = () => {
  const { data, loading } = useDashboardStore();

  if (!data || loading) {
    return (
      <Card className="glass-card p-6 h-80 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg font-medium mb-2">加载分红数据中...</div>
        </div>
      </Card>
    );
  }

  const distributionData = data.dividend.currentDistribution;
  const totalAmount = data.dividend.estimatedAmount;

  // 饼图数据
  const pieData = [
    { name: '合伙人', value: distributionData.partners.percentage, amount: distributionData.partners.amount, color: '#667eea' },
    { name: '商务', value: distributionData.business.percentage, amount: distributionData.business.amount, color: '#764ba2' },
    { name: '商户', value: distributionData.stores.percentage, amount: distributionData.stores.amount, color: '#f093fb' },
    { name: '用户', value: distributionData.users.percentage, amount: distributionData.users.amount, color: '#f5576c' }
  ];

  // 计算饼图路径
  const createPieSlice = (startAngle: number, endAngle: number, radius: number = 60) => {
    const start = polarToCartesian(0, 0, radius, endAngle);
    const end = polarToCartesian(0, 0, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", 0, 0,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  let currentAngle = 0;

  return (
    <Card className="glass-card p-6 h-96">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">角色分红分布</h3>
      </div>

      <div className="grid grid-cols-5 gap-6 h-full">
        {/* 左侧：饼图 */}
        <div className="col-span-2 flex items-center justify-center">
          <div className="relative">
            <svg width="150" height="150" viewBox="-75 -75 150 150" className="transform -rotate-90">
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.4)"/>
                </filter>
              </defs>
              
              {pieData.map((item, index) => {
                const sliceAngle = (item.value / 100) * 360;
                const path = createPieSlice(currentAngle, currentAngle + sliceAngle);
                currentAngle += sliceAngle;

                return (
                  <motion.path
                    key={item.name}
                    d={path}
                    fill={item.color}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    filter="url(#shadow)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15, duration: 0.8 }}
                    className="hover:brightness-110 cursor-pointer transition-all"
                  />
                );
              })}
              
              {/* 中心圆 */}
              <circle
                cx="0"
                cy="0"
                r="30"
                fill="rgba(15, 23, 42, 0.95)"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="2"
              />
            </svg>

            {/* 中心文字 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-xs text-muted-foreground mb-1">第{data.dividend.currentRound}轮</div>
              <div className="text-sm font-bold text-primary">{formatCurrency(totalAmount)}</div>
            </div>
          </div>
        </div>

        {/* 右侧：图例和详情 */}
        <div className="col-span-3 space-y-3 flex flex-col justify-center">
          {pieData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-colors border border-slate-700/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-semibold">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold mb-1">{formatCurrency(item.amount)}</div>
                <div className="text-xs text-muted-foreground bg-slate-700/50 px-2 py-1 rounded">
                  {item.value.toFixed(1)}%
                </div>
              </div>
            </motion.div>
          ))}

          {/* 分红进度 */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">分红进度</span>
              <span className="text-lg font-bold text-primary">{data.dividend.progress}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${data.dividend.progress}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              预计{data.dividend.estimatedTime}开始分红
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};