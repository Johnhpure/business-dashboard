// 数据工具函数

// 格式化数字显示
export const formatNumber = (num: number): string => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
};

// 格式化货币
export const formatCurrency = (amount: number): string => {
  return '¥' + formatNumber(amount);
};

// 格式化百分比
export const formatPercentage = (value: number): string => {
  return (value * 100).toFixed(1) + '%';
};

// 格式化日期
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 格式化时间
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 计算增长率颜色
export const getTrendColor = (trend: string): string => {
  if (trend.startsWith('+')) {
    return 'text-green-500';
  } else if (trend.startsWith('-')) {
    return 'text-red-500';
  }
  return 'text-gray-500';
};

// 获取状态颜色
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
    case 'completed':
      return 'text-green-500';
    case 'pending':
      return 'text-yellow-500';
    case 'inactive':
    case 'failed':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

// 获取等级颜色
export const getLevelColor = (level: string): string => {
  switch (level) {
    case '5GP':
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    case '4GP':
      return 'bg-gradient-to-r from-purple-400 to-purple-600';
    case '3GP':
      return 'bg-gradient-to-r from-blue-400 to-blue-600';
    case '2GP':
      return 'bg-gradient-to-r from-green-400 to-green-600';
    case 'LP':
      return 'bg-gradient-to-r from-gray-400 to-gray-600';
    default:
      return 'bg-gradient-to-r from-gray-300 to-gray-500';
  }
};

// 数据排序工具
export const sortData = <T>(
  data: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'desc' 
        ? bVal.localeCompare(aVal, 'zh-CN')
        : aVal.localeCompare(bVal, 'zh-CN');
    }
    
    return 0;
  });
};

// 数据筛选工具
export const filterData = <T>(
  data: T[],
  filters: Record<string, any>
): T[] => {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === '') return true;
      
      const itemValue = (item as any)[key];
      
      if (typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      
      if (typeof itemValue === 'number') {
        return itemValue === value;
      }
      
      return itemValue === value;
    });
  });
};

// 计算数据统计
export const calculateStats = (data: number[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  growth: number;
} => {
  if (data.length === 0) {
    return { total: 0, average: 0, max: 0, min: 0, growth: 0 };
  }
  
  const total = data.reduce((sum, val) => sum + val, 0);
  const average = total / data.length;
  const max = Math.max(...data);
  const min = Math.min(...data);
  
  // 计算增长率（最后一个值相对于第一个值）
  const growth = data.length > 1 
    ? ((data[data.length - 1] - data[0]) / data[0]) * 100
    : 0;
  
  return { total, average, max, min, growth };
};

// 生成颜色渐变
export const generateGradient = (colors: string[]): string => {
  return `linear-gradient(135deg, ${colors.join(', ')})`;
};

// 时间范围工具
export const getTimeRangeLabel = (range: string): string => {
  const labels: Record<string, string> = {
    realtime: '实时',
    today: '今日',
    week: '本周',
    month: '本月',
    quarter: '本季度',
    year: '本年'
  };
  return labels[range] || range;
};

// 数据导出工具
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};