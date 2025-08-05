import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

// 定义图标类型
type IconComponent = React.ComponentType<{ className?: string }>;

interface KPICardProps {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend: string;
  icon: IconComponent;
  color: string;
  loading?: boolean;
  delay?: number;
  showProgress?: boolean;
  progress?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  color,
  loading = false,
  delay = 0,
  showProgress = false,
  progress = 0
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // 数字动画
  useEffect(() => {
    if (loading) return;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(interval);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, loading, delay]);

  // 导入格式化工具
  const formatNumber = (num: number): string => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + '亿';
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const isPositiveTrend = trend.startsWith('+');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
    >
      <Card className="glass-card p-5 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden h-32">
        {/* 顶部渐变线 */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
        
        <div className="flex items-start justify-between h-full">
          {/* 左侧内容 */}
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* 标题 */}
            <div className="text-sm text-muted-foreground font-medium">{title}</div>

            {/* 数值 */}
            <div className="flex items-baseline gap-2 my-2">
              <span className={`text-3xl font-bold font-mono transition-all duration-300 ${
                isVisible ? 'number-animate' : ''
              }`}>
                {loading ? '...' : formatNumber(animatedValue)}
              </span>
              <span className="text-sm text-muted-foreground font-medium">{unit}</span>
            </div>

            {/* 趋势或进度 */}
            {showProgress ? (
              <div className="space-y-2">
                <div className="w-full bg-secondary/30 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, delay: delay / 1000 + 0.5 }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  距离下次分红 {progress}%
                </div>
              </div>
            ) : (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                isPositiveTrend ? 'text-green-400' : 'text-red-400'
              }`}>
                {isPositiveTrend ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{trend}</span>
              </div>
            )}
          </div>

          {/* 右侧图标 */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} p-2.5 flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* 悬停效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Card>
    </motion.div>
  );
};