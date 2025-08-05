import React from 'react';
import { Card } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { formatCurrency } from '../../utils/dataUtils';
import { PieChart, Users, Store, Briefcase, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const DividendDistributionCard: React.FC = () => {
  const { data, loading } = useDashboardStore();

  if (!data || loading) {
    return (
      <Card className="glass-card p-6 h-96 flex items-center justify-center">
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
    { 
      name: '合伙人', 
      value: distributionData.partners.percentage, 
      amount: distributionData.partners.amount, 
      color: '#667eea',
      icon: UserCheck
    },
    { 
      name: '商务', 
      value: distributionData.business.percentage, 
      amount: distributionData.business.amount, 
      color: '#764ba2',
      icon: Briefcase
    },
    { 
      name: '商户', 
      value: distributionData.stores.percentage, 
      amount: distributionData.stores.amount, 
      color: '#f093fb',
      icon: Store
    },
    { 
      name: '用户', 
      value: distributionData.users.percentage, 
      amount: distributionData.users.amount, 
      color: '#f5576c',
      icon: Users
    }
  ];

  // 计算饼图路径
  const createPieSlice = (startAngle: number, endAngle: number, radius: number = 50) => {
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
    <Card className="glass-card p-6 h-96 relative overflow-hidden">
      {/* 顶部渐变线 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
      
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">第{data.dividend.currentRound}轮分红分布</h3>
      </div>

      <div className="grid grid-cols-5 gap-6 h-full">
        {/* 左侧：饼图 */}
        <div className="col-span-2 flex items-center justify-center">
          <div className="relative">
            <svg width="160" height="160" viewBox="-80 -80 160 160" className="transform -rotate-90">
              {pieData.map((item, index) => {
                const sliceAngle = (item.value / 100) * 360;
                const path = createPieSlice(currentAngle, currentAngle + sliceAngle);
                currentAngle += sliceAngle;

                return (
                  <motion.path
                    key={item.name}
                    d={path}
                    fill={item.color}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15, duration: 0.8 }}
                    className="hover:brightness-110 cursor-pointer transition-all"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                  />
                );
              })}
              
              {/* 中心圆 */}
              <circle
                cx="0"
                cy="0"
                r="35"
                fill="rgba(15, 23, 42, 0.95)"
                stroke="rgba(59, 130, 246, 0.4)"
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

        {/* 右侧：详情列表 */}
        <div className="col-span-3 space-y-3 flex flex-col justify-center">
          {pieData.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-200 group border border-slate-700/30"
              >
                {/* 图标 */}
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}
                >
                  <Icon className="h-5 w-5" style={{ color: item.color }} />
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground bg-slate-700/50 px-2 py-1 rounded">
                      {item.value.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-lg font-bold" style={{ color: item.color }}>
                    {formatCurrency(item.amount)}
                  </div>
                </div>

                {/* 进度条 */}
                <div className="w-16 flex-shrink-0">
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.2, delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 底部进度信息 */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">分红进度: {data.dividend.progress}%</span>
          </div>
          <div className="text-primary font-medium">
            {data.dividend.estimatedTime}开始分红
          </div>
        </div>
        
        <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${data.dividend.progress}%` }}
            transition={{ duration: 2, delay: 1 }}
          />
        </div>
      </div>

      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
    </Card>
  );
};