import React from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDashboardStore } from '../../stores/dashboardStore';
import { regions } from '../../services/mockData';
import { BarChart3, RefreshCw, User, MapPin, Users, Coins } from 'lucide-react';

export const Header: React.FC = () => {
  const { filters, setFilters, refreshData, loading } = useDashboardStore();

  const handleTimeRangeChange = (value: string) => {
    setFilters({ 
      timeRange: value as 'realtime' | 'today' | 'week' | 'month' | 'quarter' | 'year' 
    });
  };

  const handleProvinceChange = (value: string) => {
    setFilters({ 
      province: value === 'all' ? '' : value,
      city: '',
      district: ''
    });
  };

  const handleCityChange = (value: string) => {
    setFilters({ 
      city: value === 'all' ? '' : value,
      district: ''
    });
  };

  const handleDistrictChange = (value: string) => {
    setFilters({ district: value === 'all' ? '' : value });
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    const newRoles = checked 
      ? [...filters.roles, role]
      : filters.roles.filter(r => r !== role);
    setFilters({ roles: newRoles });
  };

  const handleRoundChange = (value: number) => {
    setFilters({ round: value });
  };

  const handleRefresh = () => {
    refreshData();
  };

  const cities = filters.province ? regions.cities[filters.province as keyof typeof regions.cities] || [] : [];
  const districts = filters.city ? regions.districts[filters.city as keyof typeof regions.districts] || [] : [];

  return (
    <header className="glass-card sticky top-4 mx-4 mb-0 z-50 relative">
      {/* 主标题栏 */}
      <div className="flex items-center justify-between p-4 h-[70px] border-b border-slate-700/30">
        {/* 左侧 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-primary">拼好拼数据看板</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="pulse-dot"></div>
            <span className="text-sm text-slate-400">实时数据</span>
          </div>
        </div>

        {/* 中间 - 空白区域 */}
        <div className="flex-1"></div>

        {/* 右侧 */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
            className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-900" />
            </div>
            <span className="text-sm">管理员</span>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* 时间范围筛选 */}
          <div className="col-span-2 flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400 min-w-fit">
              <BarChart3 className="h-4 w-4" />
              <span>时间</span>
            </div>
            <Select value={filters.timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">实时</SelectItem>
                <SelectItem value="today">今日</SelectItem>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="quarter">本季度</SelectItem>
                <SelectItem value="year">本年</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 地域筛选 */}
          <div className="col-span-4 flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400 min-w-fit">
              <MapPin className="h-4 w-4" />
              <span>地域</span>
            </div>
            <div className="flex gap-2 flex-1">
              <Select value={filters.province || 'all'} onValueChange={handleProvinceChange}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-xs">
                  <SelectValue placeholder="全国" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全国</SelectItem>
                  {regions.provinces.map(province => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.city || 'all'} 
                onValueChange={handleCityChange}
                disabled={!filters.province}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-xs">
                  <SelectValue placeholder="城市" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">选择城市</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city.code} value={city.code}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.district || 'all'} 
                onValueChange={handleDistrictChange}
                disabled={!filters.city}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-xs">
                  <SelectValue placeholder="区县" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">选择区县</SelectItem>
                  {districts.map(district => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 角色筛选 */}
          <div className="col-span-3 flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400 min-w-fit">
              <Users className="h-4 w-4" />
              <span>角色</span>
            </div>
            <div className="flex gap-3 flex-1">
              {[
                { value: 'partners', label: '合伙人' },
                { value: 'business', label: '商务' },
                { value: 'stores', label: '商户' },
                { value: 'users', label: '用户' }
              ].map(role => (
                <label key={role.value} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.roles.includes(role.value)}
                    onChange={(e) => handleRoleChange(role.value, e.target.checked)}
                    className="w-3 h-3 rounded border-slate-700/50 bg-slate-800/50 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                  />
                  <span className="text-xs">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 分红轮次筛选 */}
          <div className="col-span-3 flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400 min-w-fit">
              <Coins className="h-4 w-4" />
              <span>轮次</span>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              {/* 轮次显示和控制 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">第1轮</span>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md">
                    <span className="text-xs font-semibold text-white">第{filters.round}轮</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400">第50轮</span>
              </div>
              
              {/* 自定义进度条 */}
              <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
                {/* 背景轨道 */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-700/30 to-slate-600/30"></div>
                
                {/* 进度填充 */}
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(filters.round / 50) * 100}%` }}
                >
                  {/* 光晕效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-purple-500/50 blur-sm"></div>
                </div>
                
                {/* 滑块 */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-cyan-400 transition-all duration-300 ease-out hover:scale-110 cursor-pointer"
                  style={{ left: `calc(${(filters.round / 50) * 100}% - 8px)` }}
                >
                  <div className="absolute inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                </div>
                
                {/* 隐藏的原生滑块 */}
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.round}
                  onChange={(e) => handleRoundChange(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              
              {/* 关键轮次标记 */}
              <div className="relative flex justify-between mt-1">
                {[10, 20, 30, 40].map(round => (
                  <div 
                    key={round}
                    className={`w-1 h-1 rounded-full transition-colors ${
                      filters.round >= round ? 'bg-cyan-400' : 'bg-slate-600'
                    }`}
                    style={{ marginLeft: `${(round / 50) * 100 - 2}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};