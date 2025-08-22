# 组件设计规范和最佳实践

## 组件设计原则

### 1. SOLID原则在React中的应用

#### 单一职责原则 (Single Responsibility Principle)
```typescript
// ❌ 错误：一个组件承担多个职责
const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // 用户数据获取
  useEffect(() => { /* fetch user */ }, []);
  // 帖子数据获取
  useEffect(() => { /* fetch posts */ }, []);
  // 通知数据获取
  useEffect(() => { /* fetch notifications */ }, []);
  
  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <NotificationPanel notifications={notifications} />
    </div>
  );
};

// ✅ 正确：每个组件只负责一个职责
const UserDashboard = () => {
  return (
    <div>
      <UserProfileContainer />
      <PostListContainer />
      <NotificationContainer />
    </div>
  );
};

const UserProfileContainer = () => {
  const { user, loading, error } = useUserData();
  
  if (loading) return <UserProfileSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <UserProfile user={user} />;
};
```

#### 开放封闭原则 (Open/Closed Principle)
```typescript
// ✅ 通过props和组合实现扩展
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}) => {
  const baseClasses = 'rounded-lg border';
  const variantClasses = {
    default: 'bg-white border-gray-200',
    glass: 'bg-glass border-glass-border backdrop-blur-md',
    elevated: 'bg-white border-gray-200 shadow-lg'
  };
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

// 扩展使用
const KPICard = ({ title, value, trend }: KPICardProps) => (
  <Card variant="glass" size="md" className="hover:scale-105 transition-transform">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <TrendIndicator trend={trend} />
    </CardContent>
  </Card>
);
```

#### 依赖倒置原则 (Dependency Inversion Principle)
```typescript
// ✅ 依赖抽象而非具体实现
interface DataService {
  fetchDashboardData(filters: FilterState): Promise<DashboardData>;
  fetchUserData(userId: string): Promise<User>;
}

interface DashboardProps {
  dataService: DataService;
}

const Dashboard: React.FC<DashboardProps> = ({ dataService }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  
  useEffect(() => {
    dataService.fetchDashboardData(filters).then(setData);
  }, [dataService, filters]);
  
  return <DashboardContent data={data} />;
};

// 具体实现可以替换
const ApiDataService: DataService = {
  fetchDashboardData: (filters) => api.get('/dashboard', { params: filters }),
  fetchUserData: (userId) => api.get(`/users/${userId}`)
};

const MockDataService: DataService = {
  fetchDashboardData: (filters) => Promise.resolve(mockDashboardData),
  fetchUserData: (userId) => Promise.resolve(mockUser)
};
```

### 2. 组件分类和命名规范

#### 组件分类
```typescript
// 1. UI组件 (Presentational Components)
// 纯展示，无状态逻辑
const Button: React.FC<ButtonProps> = ({ children, onClick, variant }) => (
  <button 
    className={cn('btn', `btn-${variant}`)}
    onClick={onClick}
  >
    {children}
  </button>
);

// 2. 容器组件 (Container Components)
// 处理数据和状态逻辑
const DashboardContainer: React.FC = () => {
  const { data, loading, error } = useDashboardData();
  
  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorBoundary error={error} />;
  
  return <Dashboard data={data} />;
};

// 3. 高阶组件 (Higher-Order Components)
const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { user, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!user) return <LoginPrompt />;
    
    return <Component {...props} />;
  };
};

// 4. 渲染属性组件 (Render Props)
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const { data, loading, error } = useAsyncData<T>(() => fetch(url));
  return <>{children(data, loading, error)}</>;
};
```

#### 命名规范
```typescript
// ✅ 组件命名：PascalCase
const UserProfile = () => {};
const DashboardHeader = () => {};
const KPICard = () => {};

// ✅ Props接口命名：组件名 + Props
interface UserProfileProps {
  user: User;
  onEdit: () => void;
}

interface DashboardHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

// ✅ 事件处理器命名：handle + 动作
const handleUserEdit = () => {};
const handleDataRefresh = () => {};
const handleFilterChange = (filters: FilterState) => {};

// ✅ 状态变量命名：描述性名称
const [isLoading, setIsLoading] = useState(false);
const [userData, setUserData] = useState<User | null>(null);
const [filterState, setFilterState] = useState<FilterState>(initialFilters);

// ✅ 自定义Hook命名：use + 功能描述
const useUserData = (userId: string) => {};
const useDashboardFilters = () => {};
const useChartInteraction = () => {};
```

## 组件结构规范

### 1. 组件文件结构
```typescript
// UserProfile.tsx
import React, { useState, useCallback, useMemo } from 'react';
import type { User } from '@types/user';
import { cn } from '@utils/cn';
import { Avatar } from '@components/ui/Avatar';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';

// 1. 类型定义
interface UserProfileProps {
  user: User;
  editable?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  className?: string;
}

interface EditFormData {
  name: string;
  email: string;
  bio: string;
}

// 2. 常量定义
const DEFAULT_AVATAR = '/images/default-avatar.png';
const MAX_BIO_LENGTH = 200;

// 3. 辅助函数
const formatJoinDate = (date: string): string => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 4. 主组件
export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  editable = false,
  onEdit,
  onDelete,
  className
}) => {
  // 5. 状态定义
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    name: user.name,
    email: user.email,
    bio: user.bio || ''
  });

  // 6. 计算属性
  const displayName = useMemo(() => {
    return user.name || user.email.split('@')[0];
  }, [user.name, user.email]);

  const avatarUrl = useMemo(() => {
    return user.avatar || DEFAULT_AVATAR;
  }, [user.avatar]);

  // 7. 事件处理器
  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
    if (isEditing) {
      // 重置表单数据
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || ''
      });
    }
  }, [isEditing, user]);

  const handleSave = useCallback(() => {
    const updatedUser = { ...user, ...formData };
    onEdit?.(updatedUser);
    setIsEditing(false);
  }, [user, formData, onEdit]);

  const handleDelete = useCallback(() => {
    if (window.confirm('确定要删除此用户吗？')) {
      onDelete?.(user.id);
    }
  }, [user.id, onDelete]);

  // 8. 渲染函数
  const renderEditForm = () => (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">姓名</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">邮箱</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">个人简介</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          maxLength={MAX_BIO_LENGTH}
          className="w-full px-3 py-2 border rounded-md h-20 resize-none"
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.bio.length}/{MAX_BIO_LENGTH}
        </div>
      </div>
    </form>
  );

  const renderProfile = () => (
    <div className="flex items-start space-x-4">
      <Avatar src={avatarUrl} alt={displayName} size="lg" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{displayName}</h3>
        <p className="text-gray-600">{user.email}</p>
        {user.bio && (
          <p className="mt-2 text-gray-700">{user.bio}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          加入时间：{formatJoinDate(user.createdAt)}
        </p>
      </div>
    </div>
  );

  // 9. 主渲染
  return (
    <Card className={cn('p-6', className)}>
      {isEditing ? renderEditForm() : renderProfile()}
      
      {editable && (
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleEditToggle}>
                取消
              </Button>
              <Button onClick={handleSave}>
                保存
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEditToggle}>
                编辑
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                删除
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

// 10. 默认导出
export default UserProfile;
```

### 2. Props设计规范

#### Props接口设计
```typescript
// ✅ 完整的Props接口定义
interface ComponentProps {
  // 必需属性
  id: string;
  title: string;
  
  // 可选属性
  description?: string;
  disabled?: boolean;
  
  // 事件处理器
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onChange?: (value: string) => void;
  
  // 渲染属性
  children?: React.ReactNode;
  icon?: React.ReactNode;
  
  // 样式属性
  className?: string;
  style?: React.CSSProperties;
  
  // 变体属性
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  
  // 数据属性
  data?: Record<string, any>;
  
  // HTML属性扩展
  'data-testid'?: string;
  'aria-label'?: string;
}

// ✅ 使用泛型提高复用性
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  loading?: boolean;
  empty?: React.ReactNode;
  className?: string;
}

const List = <T,>({ items, renderItem, keyExtractor, loading, empty }: ListProps<T>) => {
  if (loading) return <ListSkeleton />;
  if (items.length === 0) return <>{empty}</>;
  
  return (
    <div>
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};
```

#### Props验证和默认值
```typescript
// ✅ 使用TypeScript进行类型验证
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

// ✅ 使用默认参数
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className
}) => {
  // 组件实现
};

// ✅ 或使用defaultProps（较老的方式）
Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
};
```

### 3. 状态管理规范

#### 本地状态管理
```typescript
// ✅ 合理的状态分组
const UserForm: React.FC<UserFormProps> = ({ user, onSubmit }) => {
  // 表单数据状态
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  
  // UI状态
  const [uiState, setUiState] = useState({
    isSubmitting: false,
    showValidation: false,
    isDirty: false
  });
  
  // 验证状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 状态更新函数
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setUiState(prev => ({ ...prev, isDirty: true }));
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);
  
  // 表单验证
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  // 表单提交
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    setUiState(prev => ({ ...prev, showValidation: true }));
    
    if (!validateForm()) return;
    
    setUiState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      await onSubmit(formData);
      setUiState(prev => ({ ...prev, isDirty: false }));
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setUiState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formData, validateForm, onSubmit]);
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
    </form>
  );
};
```

#### 状态提升规范
```typescript
// ✅ 合理的状态提升
// 父组件管理共享状态
const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  return (
    <div>
      <FilterPanel 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      <DataTable 
        filters={filters}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
      />
      <ActionPanel 
        selectedItems={selectedItems}
        onClearSelection={() => setSelectedItems([])}
      />
    </div>
  );
};

// 子组件只管理自己的UI状态
const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? '收起' : '展开'}筛选
      </button>
      {isExpanded && (
        <FilterForm 
          filters={filters} 
          onChange={onFiltersChange} 
        />
      )}
    </div>
  );
};
```

## 性能优化最佳实践

### 1. 渲染优化

#### React.memo使用
```typescript
// ✅ 正确使用React.memo
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserCard = React.memo<UserCardProps>(({ user, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => {
    onEdit(user);
  }, [user, onEdit]);
  
  const handleDelete = useCallback(() => {
    onDelete(user.id);
  }, [user.id, onDelete]);
  
  return (
    <Card>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <Button onClick={handleEdit}>编辑</Button>
      <Button onClick={handleDelete}>删除</Button>
    </Card>
  );
});

// ✅ 自定义比较函数
const UserCard = React.memo<UserCardProps>(
  ({ user, onEdit, onDelete }) => {
    // 组件实现
  },
  (prevProps, nextProps) => {
    // 自定义比较逻辑
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.name === nextProps.user.name &&
      prevProps.user.email === nextProps.user.email &&
      prevProps.user.updatedAt === nextProps.user.updatedAt
    );
  }
);
```

#### useMemo和useCallback优化
```typescript
// ✅ 合理使用useMemo
const DataTable: React.FC<DataTableProps> = ({ data, filters, sortConfig }) => {
  // 过滤和排序数据
  const processedData = useMemo(() => {
    let filtered = data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
      });
    });
    
    if (sortConfig.field) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [data, filters, sortConfig]);
  
  // 分页数据
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);
  
  // 事件处理器
  const handleSort = useCallback((field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);
  
  return (
    <table>
      <thead>
        {columns.map(column => (
          <th key={column.key} onClick={() => handleSort(column.key)}>
            {column.title}
          </th>
        ))}
      </thead>
      <tbody>
        {paginatedData.map(item => (
          <tr key={item.id}>
            {columns.map(column => (
              <td key={column.key}>
                {column.render ? column.render(item[column.key], item) : item[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### 2. 代码分割和懒加载

#### 路由级别的代码分割
```typescript
// ✅ 路由懒加载
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

// 懒加载页面组件
const Dashboard = lazy(() => import('@pages/Dashboard'));
const UserManagement = lazy(() => import('@pages/UserManagement'));
const Settings = lazy(() => import('@pages/Settings'));

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      } />
      <Route path="/users" element={
        <Suspense fallback={<LoadingSpinner />}>
          <UserManagement />
        </Suspense>
      } />
      <Route path="/settings" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Settings />
        </Suspense>
      } />
    </Routes>
  );
};
```

#### 组件级别的懒加载
```typescript
// ✅ 条件渲染的组件懒加载
const Dashboard: React.FC = () => {
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);
  
  // 懒加载高级图表组件
  const AdvancedCharts = lazy(() => import('@components/charts/AdvancedCharts'));
  
  return (
    <div>
      <BasicCharts />
      
      <button onClick={() => setShowAdvancedCharts(true)}>
        显示高级图表
      </button>
      
      {showAdvancedCharts && (
        <Suspense fallback={<ChartSkeleton />}>
          <AdvancedCharts />
        </Suspense>
      )}
    </div>
  );
};
```

### 3. 虚拟化和无限滚动

#### 虚拟列表实现
```typescript
// ✅ 虚拟列表组件
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

const VirtualList = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleRange = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount, items.length - 1);
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);
  
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute' as const,
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight
        }
      });
    }
    return result;
  }, [visibleRange, items, itemHeight]);
  
  const totalHeight = items.length * itemHeight;
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, style }) => (
          <div key={index} style={style}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 错误处理和边界情况

### 1. 错误边界
```typescript
// ✅ 错误边界组件
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // 错误上报
    console.error('Error caught by boundary:', error, errorInfo);
    // reportError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>出现了一些问题</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>错误详情</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// ✅ 使用Hook的错误边界
const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);
  
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  const handleError = useCallback((error: Error) => {
    setError(error);
    console.error('Error handled:', error);
    // reportError(error);
  }, []);
  
  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);
  
  return { handleError, resetError };
};
```

### 2. 加载状态处理
```typescript
// ✅ 统一的加载状态组件
interface LoadingStateProps {
  loading: boolean;
  error: Error | null;
  empty: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  empty,
  children,
  loadingComponent = <LoadingSpinner />,
  errorComponent,
  emptyComponent = <EmptyState />
}) => {
  if (loading) return <>{loadingComponent}</>;
  
  if (error) {
    return errorComponent || (
      <ErrorMessage
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  if (empty) return <>{emptyComponent}</>;
  
  return <>{children}</>;
};

// ✅ 使用示例
const UserList: React.FC = () => {
  const { data: users, loading, error } = useUsers();
  
  return (
    <LoadingState
      loading={loading}
      error={error}
      empty={!users || users.length === 0}
      emptyComponent={<EmptyUserList />}
    >
      <div className="user-list">
        {users?.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </LoadingState>
  );
};
```

### 3. 表单验证和错误处理
```typescript
// ✅ 表单字段组件
interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required,
  placeholder,
  disabled,
  className
}) => {
  const inputId = `field-${name}`;
  const errorId = `error-${name}`;
  
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  
  return (
    <div className={cn('form-field', className)}>
      <label
        htmlFor={inputId}
        className={cn(
          'block text-sm font-medium mb-1',
          error && 'text-red-600',
          required && 'after:content-["*"] after:text-red-500 after:ml-1'
        )}
      >
        {label}
      </label>
      
      <InputComponent
        id={inputId}
        name={name}
        type={type !== 'textarea' ? type : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'w-full px-3 py-2 border rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          error ? 'border-red-500' : 'border-gray-300',
          disabled && 'bg-gray-100 cursor-not-allowed'
        )}
      />
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
```

## 可访问性最佳实践

### 1. 语义化HTML
```typescript
// ✅ 语义化的组件结构
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className="article-card">
      <header>
        <h2>{article.title}</h2>
        <p className="article-meta">
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          <span>作者：{article.author}</span>
        </p>
      </header>
      
      <main>
        <p>{article.excerpt}</p>
      </main>
      
      <footer>
        <nav aria-label="文章操作">
          <button type="button">点赞</button>
          <button type="button">分享</button>
          <button type="button">收藏</button>
        </nav>
      </footer>
    </article>
  );
};
```

### 2. ARIA属性使用
```typescript
// ✅ 正确使用ARIA属性
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const titleId = useId();
  const descriptionId = useId();
  
  useEffect(() => {
    if (isOpen) {
      // 焦点管理
      const previousFocus = document.activeElement as HTMLElement;
      const modal = document.querySelector('[role="dialog"]') as HTMLElement;
      modal?.focus();
      
      return () => {
        previousFocus?.focus();
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <header className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭对话框"
            className="modal-close"
          >
            ×
          </button>
        </header>
        
        <div id={descriptionId} className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
```

### 3. 键盘导航支持
```typescript
// ✅ 键盘导航支持
const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev =>
            prev < items.length - 1 ? prev + 1 : 0
          );
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev =>
            prev > 0 ? prev - 1 : items.length - 1
          );
        }
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          onSelect(items[focusedIndex]);
          setIsOpen(false);
          setFocusedIndex(-1);
        } else {
          setIsOpen(!isOpen);
        }
        break;
    }
  }, [isOpen, focusedIndex, items, onSelect]);
  
  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="dropdown-trigger"
      >
        {trigger}
      </button>
      
      {isOpen && (
        <ul
          role="listbox"
          className="dropdown-menu"
          aria-activedescendant={
            focusedIndex >= 0 ? `option-${focusedIndex}` : undefined
          }
        >
          {items.map((item, index) => (
            <li
              key={item.id}
              id={`option-${index}`}
              role="option"
              aria-selected={index === focusedIndex}
              className={cn(
                'dropdown-item',
                index === focusedIndex && 'focused'
              )}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
                setFocusedIndex(-1);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## 测试最佳实践

### 1. 组件单元测试
```typescript
// ✅ 组件测试示例
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from '../UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: '2023-01-01T00:00:00Z'
  };
  
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders user information correctly', () => {
    render(
      <UserCard
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockUser.avatar);
  });
  
  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <UserCard
        user={mockUser}
        editable
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const editButton = screen.getByRole('button', { name: /编辑/i });
    await user.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
  
  it('shows confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    
    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(
      <UserCard
        user={mockUser}
        editable
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: /删除/i });
    await user.click(deleteButton);
    
    expect(confirmSpy).toHaveBeenCalledWith('确定要删除此用户吗？');
    expect(mockOnDelete).toHaveBeenCalledWith(mockUser.id);
    
    confirmSpy.mockRestore();
  });
  
  it('handles loading state correctly', () => {
    render(
      <UserCard
        user={mockUser}
        loading
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
```

### 2. 集成测试
```typescript
// ✅ 集成测试示例
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserManagement } from '../UserManagement';
import * as userService from '@services/userService';

// Mock API service
jest.mock('@services/userService');
const mockUserService = userService as jest.Mocked<typeof userService>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('UserManagement Integration', () => {
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
  ];
  
  beforeEach(() => {
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    mockUserService.deleteUser.mockResolvedValue(undefined);
  });
  
  it('loads and displays users', async () => {
    render(<UserManagement />, { wrapper: createWrapper() });
    
    expect(screen.getByText('加载中...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    
    expect(mockUserService.getUsers).toHaveBeenCalledTimes(1);
  });
  
  it('deletes user and updates list', async () => {
    const user = userEvent.setup();
    
    render(<UserManagement />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Mock updated user list after deletion
    mockUserService.getUsers.mockResolvedValueOnce([mockUsers[1]]);
    
    const deleteButton = screen.getAllByRole('button', { name: /删除/i })[0];
    await user.click(deleteButton);
    
    await waitFor(() => {
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});
```

## 文档和注释规范

### 1. 组件文档
```typescript
/**
 * UserCard - 用户信息卡片组件
 *
 * @description
 * 显示用户基本信息的卡片组件，支持编辑和删除操作。
 * 可以配置为只读模式或可编辑模式。
 *
 * @example
 * ```tsx
 * // 只读模式
 * <UserCard user={user} />
 *
 * // 可编辑模式
 * <UserCard
 *   user={user}
 *   editable
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 *
 * @param user - 用户数据对象
 * @param editable - 是否可编辑，默认为false
 * @param onEdit - 编辑回调函数
 * @param onDelete - 删除回调函数
 * @param className - 自定义CSS类名
 *
 * @returns React组件
 *
 * @since 1.0.0
 * @author 开发团队
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  editable = false,
  onEdit,
  onDelete,
  className
}) => {
  // 组件实现...
};
```

### 2. 复杂逻辑注释
```typescript
const DataProcessor: React.FC<DataProcessorProps> = ({ rawData }) => {
  // 数据处理管道：过滤 -> 排序 -> 分组 -> 聚合
  const processedData = useMemo(() => {
    // 第一步：过滤无效数据
    // 移除null、undefined或不符合业务规则的数据项
    const validData = rawData.filter(item => {
      return item &&
             item.id &&
             item.value !== null &&
             item.timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000; // 30天内的数据
    });
    
    // 第二步：按时间戳排序
    // 确保数据按时间顺序排列，便于后续处理
    const sortedData = validData.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // 第三步：按类别分组
    // 将数据按category字段分组，便于分别处理不同类型的数据
    const groupedData = sortedData.reduce((groups, item) => {
      const category = item.category || 'default';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as Record<string, typeof sortedData>);
    
    // 第四步：计算聚合指标
    // 为每个分组计算总和、平均值、最大值、最小值等统计指标
    const aggregatedData = Object.entries(groupedData).map(([category, items]) => ({
      category,
      count: items.length,
      total: items.reduce((sum, item) => sum + item.value, 0),
      average: items.reduce((sum, item) => sum + item.value, 0) / items.length,
      max: Math.max(...items.map(item => item.value)),
      min: Math.min(...items.map(item => item.value)),
      items
    }));
    
    return aggregatedData;
  }, [rawData]);
  
  return (
    <div>
      {processedData.map(group => (
        <DataGroup key={group.category} data={group} />
      ))}
    </div>
  );
};
```

## 总结

### 设计原则总结
1. **单一职责**: 每个组件只负责一个明确的功能
2. **可复用性**: 通过Props和组合实现高度可复用
3. **可维护性**: 清晰的代码结构和完善的文档
4. **性能优化**: 合理使用React优化技术
5. **可访问性**: 遵循WCAG指南，支持键盘导航和屏幕阅读器
6. **类型安全**: 完整的TypeScript类型定义
7. **测试友好**: 易于编写和维护测试

### 实施建议
1. **渐进式采用**: 从新组件开始应用规范，逐步重构现有组件
2. **代码审查**: 建立代码审查流程，确保规范执行
3. **工具支持**: 使用ESLint、Prettier等工具自动化检查
4. **团队培训**: 定期进行团队培训，确保规范理解一致
5. **持续改进**: 根据项目实践不断完善和更新规范

这些组件设计规范将确保React Dashboard项目的代码质量、可维护性和团队协作效率。