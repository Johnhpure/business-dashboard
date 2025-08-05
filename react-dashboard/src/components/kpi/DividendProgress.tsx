import React from 'react';
import { Card } from '../ui/card';
import { useDashboardStore } from '../../stores/dashboardStore';
import { PieChart, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export const DividendProgress: React.FC = () => {
  const { data } = useDashboardStore();

  if (!data) return null;

  const { dividend } = data;
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (dividend.progress / 100) * circumference;

  return (
    <Card className="glass-card p-6 h-96 flex flex-col">
      {/* 顶部渐变线 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
      
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">分红轮次进度</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* 当前轮次 */}
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            第 <span className="text-primary text-4xl">{dividend.currentRound}</span> 轮
          </div>
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            进行中
          </div>
        </div>

        {/* 进度环 */}
        <div className="relative flex items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90" width="160" height="160">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* 背景环 */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* 进度环 */}
            <motion.circle
              cx="80"
              cy="80"
              r="60"
              stroke="url(#progressGradient)"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: "easeOut" }}
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </svg>
          {/* 中心文字 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-primary mb-1">{dividend.progress}%</span>
            <span className="text-xs text-muted-foreground">完成度</span>
          </div>
        </div>

        {/* 分红信息 */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">预计分红时间</span>
            </div>
            <span className="font-semibold text-primary">{dividend.estimatedTime}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">预计分红金额</span>
            </div>
            <span className="font-semibold text-green-400">¥{dividend.estimatedAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 装饰性背景 */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/5 to-transparent rounded-full translate-y-12 translate-x-12"></div>
    </Card>
  );
};