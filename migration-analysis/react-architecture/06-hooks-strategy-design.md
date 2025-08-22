# Hook策略和自定义Hook设计

## Hook架构设计原则

### 1. Hook分层策略
```
业务Hook层 (Business Hooks)
    ↓
复合Hook层 (Composite Hooks)
    ↓
原始Hook层 (Primitive Hooks)
    ↓
React内置Hook (Built-in Hooks)
```

#### 原始Hook层 (Primitive Hooks)
- **职责**: 封装单一功能的基础逻辑
- **特点**: 无业务逻辑，高度可复用
- **示例**: `useLocalStorage`, `useDebounce`, `useToggle`

#### 复合Hook层 (Composite Hooks)
- **职责**: 组合多个原始Hook实现复杂功能
- **特点**: 通用逻辑组合，跨功能复用
- **示例**: `usePersistentState`, `useAsyncData`, `useFormValidation`

#### 业务Hook层 (Business Hooks)
- **职责**: 封装特定业务逻辑
- **特点**: 业务相关，功能内复用
- **示例**: `useDashboardData`, `useChartInteraction`, `useFilterState`

### 2. Hook设计原则

#### 单一职责原则
```typescript
// ❌ 错误：一个Hook做太多事情
const useDashboardEverything = () => {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({});
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  // ... 太多职责
};

// ✅ 正确：每个Hook只负责一件事
const useDashboardData = () => { /* 只处理数据 */ };
const useFilters = () => { /* 只处理筛选 */ };
const useTheme = () => { /* 只处理主题 */ };
const useAuth = () => { /* 只处理认证 */ };
```

#### 组合优于继承
```typescript
// ✅ 通过组合创建复杂功能
const useDashboard = () => {
  const { data, loading, error, refetch } = useDashboardData();
  const { filters, setFilters } = useFilters();
  const { theme } = useTheme();
  
  return {
    data,
    loading,
    error,
    filters,
    theme,
    refetch,
    setFilters
  };
};
```

## 原始Hook层设计

### 1. 状态管理Hook

#### useToggle - 布尔状态切换
```typescript
import { useState, useCallback } from 'react';

interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

export const useToggle = (initialValue = false): UseToggleReturn => {
  const [value, setValue] = useState<boolean>(initialValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);
  
  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  };
};

// 使用示例
const Modal = () => {
  const { value: isOpen, toggle, setTrue: open, setFalse: close } = useToggle();
  
  return (
    <>
      <button onClick={open}>打开模态框</button>
      {isOpen && (
        <div className="modal">
          <button onClick={close}>关闭</button>
        </div>
      )}
    </>
  );
};
```

#### useCounter - 计数器状态
```typescript
import { useState, useCallback } from 'react';

interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
}

export const useCounter = (
  initialValue = 0,
  options: UseCounterOptions = {}
): UseCounterReturn => {
  const { min, max, step = 1 } = options;
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => {
      const newValue = prev + step;
      return max !== undefined ? Math.min(newValue, max) : newValue;
    });
  }, [step, max]);
  
  const decrement = useCallback(() => {
    setCount(prev => {
      const newValue = prev - step;
      return min !== undefined ? Math.max(newValue, min) : newValue;
    });
  }, [step, min]);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  const set = useCallback((value: number) => {
    setCount(value);
  }, []);
  
  return {
    count,
    increment,
    decrement,
    reset,
    set
  };
};
```

#### useLocalStorage - 本地存储状态
```typescript
import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] => {
  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // 设置值
  const setValue = useCallback((value: SetValue<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  // 删除值
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  
  // 监听存储变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);
  
  return [storedValue, setValue, removeValue];
};
```

### 2. 副作用管理Hook

#### useDebounce - 防抖Hook
```typescript
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// 使用示例
const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // 执行搜索
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  );
};
```

#### useThrottle - 节流Hook
```typescript
import { useRef, useCallback } from 'react';

export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(Date.now());
  
  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;
};

// 使用示例
const ScrollHandler = () => {
  const handleScroll = useThrottle(() => {
    console.log('Scroll event handled');
  }, 100);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  return <div>Scroll me!</div>;
};
```

#### useInterval - 定时器Hook
```typescript
import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();
  
  // 记住最新的回调函数
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // 设置定时器
  useEffect(() => {
    const tick = () => {
      savedCallback.current?.();
    };
    
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// 使用示例
const Timer = () => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  
  useInterval(() => {
    setCount(count => count + 1);
  }, isRunning ? 1000 : null);
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '暂停' : '开始'}
      </button>
    </div>
  );
};
```

### 3. DOM交互Hook

#### useClickOutside - 点击外部检测
```typescript
import { useEffect, useRef } from 'react';

export const useClickOutside = <T extends HTMLElement>(
  callback: () => void
) => {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);
  
  return ref;
};

// 使用示例
const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        切换下拉菜单
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div>选项 1</div>
          <div>选项 2</div>
        </div>
      )}
    </div>
  );
};
```

#### useIntersectionObserver - 交叉观察器
```typescript
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

export const useIntersectionObserver = <T extends HTMLElement>(
  options: UseIntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<T>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: options.threshold || 0,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px'
      }
    );
    
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [options.threshold, options.root, options.rootMargin]);
  
  return { ref, isIntersecting, entry };
};

// 使用示例
const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1
  });
  
  return (
    <div ref={ref}>
      {isIntersecting ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder">加载中...</div>
      )}
    </div>
  );
};
```

## 复合Hook层设计

### 1. 数据获取Hook

#### useAsyncData - 异步数据获取
```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseAsyncDataOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  deps?: React.DependencyList;
}

interface UseAsyncDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useAsyncData = <T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataReturn<T> => {
  const { initialData = null, onSuccess, onError, deps = [] } = options;
  
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, onSuccess, onError]);
  
  useEffect(() => {
    fetchData();
  }, [...deps, fetchData]);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

// 使用示例
const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user, loading, error, refetch } = useAsyncData(
    () => fetchUser(userId),
    {
      deps: [userId],
      onSuccess: (user) => console.log('User loaded:', user),
      onError: (error) => console.error('Failed to load user:', error)
    }
  );
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  if (!user) return <div>用户不存在</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={refetch}>刷新</button>
    </div>
  );
};
```

#### usePaginatedData - 分页数据获取
```typescript
import { useState, useCallback } from 'react';
import { useAsyncData } from './useAsyncData';

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UsePaginatedDataReturn<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  actions: {
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    setPageSize: (size: number) => void;
    refetch: () => Promise<void>;
  };
}

export const usePaginatedData = <T>(
  fetchFunction: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  initialPage = 1,
  initialPageSize = 10
): UsePaginatedDataReturn<T> => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  const { data: response, loading, error, refetch } = useAsyncData(
    () => fetchFunction({ page, pageSize }),
    { deps: [page, pageSize] }
  );
  
  const nextPage = useCallback(() => {
    if (response && page < response.totalPages) {
      setPage(prev => prev + 1);
    }
  }, [page, response?.totalPages]);
  
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);
  
  const goToPage = useCallback((newPage: number) => {
    if (response && newPage >= 1 && newPage <= response.totalPages) {
      setPage(newPage);
    }
  }, [response?.totalPages]);
  
  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setPage(1); // 重置到第一页
  }, []);
  
  return {
    data: response?.data || [],
    loading,
    error,
    pagination: {
      page,
      pageSize,
      total: response?.total || 0,
      totalPages: response?.totalPages || 0
    },
    actions: {
      nextPage,
      prevPage,
      goToPage,
      setPageSize: handleSetPageSize,
      refetch
    }
  };
};
```

### 2. 表单管理Hook

#### useForm - 表单状态管理
```typescript
import { useState, useCallback } from 'react';

interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

interface FieldConfig<T> {
  initialValue: T;
  validation?: ValidationRule<T>;
}

interface FormConfig<T extends Record<string, any>> {
  [K in keyof T]: FieldConfig<T[K]>;
}

interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  setTouched: <K extends keyof T>(field: K, touched: boolean) => void;
  handleChange: <K extends keyof T>(field: K) => (value: T[K]) => void;
  handleBlur: <K extends keyof T>(field: K) => () => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  validate: () => boolean;
}

export const useForm = <T extends Record<string, any>>(
  config: FormConfig<T>
): UseFormReturn<T> => {
  // 初始化状态
  const initialValues = Object.keys(config).reduce((acc, key) => {
    acc[key as keyof T] = config[key as keyof T].initialValue;
    return acc;
  }, {} as T);
  
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 验证单个字段
  const validateField = useCallback(<K extends keyof T>(field: K, value: T[K]): string | null => {
    const fieldConfig = config[field];
    if (!fieldConfig.validation) return null;
    
    const { required, minLength, maxLength, pattern, custom } = fieldConfig.validation;
    
    // 必填验证
    if (required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return '此字段为必填项';
    }
    
    // 字符串长度验证
    if (typeof value === 'string') {
      if (minLength && value.length < minLength) {
        return `最少需要 ${minLength} 个字符`;
      }
      if (maxLength && value.length > maxLength) {
        return `最多允许 ${maxLength} 个字符`;
      }
      if (pattern && !pattern.test(value)) {
        return '格式不正确';
      }
    }
    
    // 自定义验证
    if (custom) {
      return custom(value);
    }
    
    return null;
  }, [config]);
  
  // 验证所有字段
  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    
    Object.keys(config).forEach((key) => {
      const field = key as keyof T;
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [config, values, validateField]);
  
  // 设置字段值
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // 实时验证
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [validateField]);
  
  // 设置字段错误
  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);
  
  // 设置字段触摸状态
  const setTouched = useCallback(<K extends keyof T>(field: K, touched: boolean) => {
    setTouchedState(prev => ({ ...prev, [field]: touched }));
  }, []);
  
  // 处理字段变化
  const handleChange = useCallback(<K extends keyof T>(field: K) => (value: T[K]) => {
    setValue(field, value);
  }, [setValue]);
  
  // 处理字段失焦
  const handleBlur = useCallback(<K extends keyof T>(field: K) => () => {
    setTouched(field, true);
  }, [setTouched]);
  
  // 处理表单提交
  const handleSubmit = useCallback((onSubmit: (values: T) => Promise<void> | void) => 
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      if (!validate()) return;
      
      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }, [values, validate]);
  
  // 重置表单
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // 计算表单是否有效
  const isValid = Object.keys(errors).length === 0;
  
  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setError,
    setTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validate
  };
};

// 使用示例
const LoginForm = () => {
  const form = useForm({
    email: {
      initialValue: '',
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    password: {
      initialValue: '',
      validation: {
        required: true,
        minLength: 6
      }
    }
  });
  
  const handleSubmit = form.handleSubmit(async (values) => {
    console.log('Submitting:', values);
    // 提交逻辑
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={form.values.email}
          onChange={(e) => form.handleChange('email')(e.target.value)}
          onBlur={form.handleBlur('email')}
          placeholder="邮箱"
        />
        {form.touched.email && form.errors.email && (
          <span className="error">{form.errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          type="password"
          value={form.values.password}
          onChange={(e) => form.handleChange('password')(e.target.value)}
          onBlur={form.handleBlur('password')}
          placeholder="密码"
        />
        {form.touched.password && form.errors.password && (
          <span className="error">{form.errors.password}</span>
        )}
      </div>
      
      <button type="submit" disabled={!form.isValid || form.isSubmitting}>
        {form.isSubmitting ? '登录中...' : '登录'}
      </button>
    </form>
  );
};
```

## 业务Hook层设计

### 1. Dashboard相关Hook

#### useDashboardData - 仪表板数据管理
```typescript
import { useCallback } from 'react';
import { useDashboardStore } from '@shared/stores';
import { useAsyncData } from '@shared/hooks';
import { dashboardService } from '@features/dashboard/services';
import type { FilterState, DashboardData } from '@features/dashboard/types';

interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: Error | null;
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  refetch: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const { filters, setFilters } = useDashboardStore();
  
  const { data, loading, error, refetch } = useAsyncData(
    () => dashboardService.getDashboardData(filters),
    {
      deps: [filters],
      onSuccess: (data) => {
        console.log('Dashboard data loaded:', data);
      },
      onError: (error) => {
        console.error('Failed to load dashboard data:', error);
      }
    }
  );
  
  const refreshData = useCallback(async () => {
    await refetch();
  }, [refetch]);
  
  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    refetch,
    refreshData
  };
};
```

#### useChartInteraction - 图表交互管理
```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
import type { EChartsInstance } from 'echarts';

interface ChartInteractionState {
  activeDataPoint: any | null;
  selectedDataPoints: any[];
  hoveredDataPoint: any | null;
  zoomLevel: number;
}

interface UseChartInteractionReturn extends ChartInteractionState {
  chartRef: React.RefObject<EChartsInstance>;
  actions: {
    setActiveDataPoint: (dataPoint: any) => void;
    addSelectedDataPoint: (dataPoint: any) => void;
    removeSelectedDataPoint: (dataPoint: any) => void;
    clearSelection: () => void;
    setHoveredDataPoint: (dataPoint: any) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
  };
}

export const useChartInteraction = (): UseChartInteractionReturn => {
  const chartRef = useRef<EChartsInstance>(null);
  const [state, setState] = useState<ChartInteractionState>({
    activeDataPoint: null,
    selectedDataPoints: [],
    hoveredDataPoint: null,
    zoomLevel: 1
  });
  
  const setActiveDataPoint = useCallback((dataPoint: any) => {
    setState(prev => ({ ...prev, activeDataPoint: dataPoint }));
  }, []);
  
  const addSelectedDataPoint = useCallback((dataPoint: any) => {
    setState(prev => ({
      ...prev,
      selectedDataPoints: [...prev.selectedDataPoints, dataPoint]
    }));
  }, []);
  
  const removeSelectedDataPoint = useCallback((dataPoint: any) => {
    setState(prev => ({
      ...prev,
      selectedDataPoints: prev.selectedDataPoints.filter(point => point !== dataPoint)
    }));
  }, []);
  
  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedDataPoints: [] }));
  }, []);
  
  const setHoveredDataPoint = useCallback((dataPoint: any) => {
    setState(prev => ({ ...prev, hoveredDataPoint: dataPoint }));
  }, []);
  
  const zoomIn = useCallback(() => {
    setState(prev => ({ ...prev, zoomLevel: Math.min(prev.zoomLevel * 1.2, 5) }));
  }, []);
  
  const zoomOut = useCallback(() => {
    setState(prev => ({ ...prev, zoomLevel: Math.max(prev.zoomLevel / 1.2, 0.2) }));
  }, []);
  
  const resetZoom = useCallback(() => {
    setState(prev => ({ ...prev, zoomLevel: 1 }));
  }, []);
  
  // 监听图表事件
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    
    const handleClick = (params: any) => {
      setActiveDataPoint(params.data);
    };
    
    const handleMouseOver = (params: any) => {
      setHoveredDataPoint(params.data);
    };
    
    const handleMouseOut = () => {
      setHoveredDataPoint(null);
    };
    
    chart.on('click', handleClick);
    chart.on('mouseover', handleMouseOver);
    chart.on('mouseout', handleMouseOut);
    
    return () => {
      chart.off('click', handleClick);
      chart.off('mouseover', handleMouseOver);
      chart.off('mouseout', handleMouseOut);
    };
  }, [setActiveDataPoint, setHoveredDataPoint]);
  
  return {
    ...state,
    chartRef,
    actions: {
      setActiveDataPoint,
      addSelectedDataPoint,
      removeSelectedDataPoint,
      clearSelection,
      setHoveredDataPoint,
      zoomIn,
      zoomOut,
      resetZoom
    }
  };
};
```

#### useFilterState - 筛选状态管理
```typescript
import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@shared/hooks';
import type { FilterState, FilterHistory } from '@features/dashboard/types';

interface UseFilterStateReturn {
  filters: FilterState;
  history: FilterHistory[];
  actions: {
    setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    setFilters: (filters: Partial<FilterState>) => void;
    resetFilters: () => void;
    saveCurrentFilter: (name: string) => void;
    loadFilterFromHistory: (index: number) => void;
    deleteFilterFromHistory: (index: number) => void;
    clearHistory: () => void;
  };
  computed: {
    hasActiveFilters: boolean;
    filterCount: number;
    canGoBack: boolean;
  };
}

const initialFilters: FilterState = {
  timeRange: 'month',
  province: '',
  city: '',
  district: '',
  roles: ['partners', 'business', 'stores', 'users'],
  round: 25
};

export const useFilterState = (): UseFilterStateReturn => {
  const [filters, setFiltersState] = useState<FilterState>(initialFilters);
  const [history, setHistory] = useLocalStorage<FilterHistory[]>('filter-history', []);
  
  const setFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFiltersState(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
  }, []);
  
  const saveCurrentFilter = useCallback((name: string) => {
    const newHistoryItem: FilterHistory = {
      id: Date.now().toString(),
      name,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };
    
    setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // 保留最近10个
  }, [filters, setHistory]);
  
  const loadFilterFromHistory = useCallback((index: number) => {
    const historyItem = history[index];
    if (historyItem) {
      setFiltersState(historyItem.filters);
    }
  }, [history]);
  
  const deleteFilterFromHistory = useCallback((index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  }, [setHistory]);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);
  
  // 计算属性
  const computed = useMemo(() => {
    const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(initialFilters);
    const filterCount = Object.values(filters).filter(value =>
      Array.isArray(value) ? value.length > 0 : value !== '' && value !== initialFilters.timeRange
    ).length;
    const canGoBack = history.length > 0;
    
    return {
      hasActiveFilters,
      filterCount,
      canGoBack
    };
  }, [filters, history.length]);
  
  return {
    filters,
    history,
    actions: {
      setFilter,
      setFilters,
      resetFilters,
      saveCurrentFilter,
      loadFilterFromHistory,
      deleteFilterFromHistory,
      clearHistory
    },
    computed
  };
};
```

### 2. 性能优化Hook

#### useVirtualList - 虚拟列表
```typescript
import { useState, useEffect, useMemo, useCallback } from 'react';

interface UseVirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface UseVirtualListReturn {
  visibleItems: Array<{
    index: number;
    data: any;
    style: React.CSSProperties;
  }>;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
  containerProps: {
    style: React.CSSProperties;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  };
}

export const useVirtualList = <T>(
  items: T[],
  options: UseVirtualListOptions
): UseVirtualListReturn => {
  const { itemHeight, containerHeight, overscan = 5 } = options;
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
        data: items[i],
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
  
  const scrollToIndex = useCallback((index: number) => {
    const element = document.querySelector('[data-virtual-list-container]') as HTMLElement;
    if (element) {
      element.scrollTop = index * itemHeight;
    }
  }, [itemHeight]);
  
  return {
    visibleItems,
    totalHeight,
    scrollToIndex,
    containerProps: {
      style: {
        height: containerHeight,
        overflow: 'auto'
      },
      onScroll: handleScroll
    }
  };
};

// 使用示例
const VirtualListExample = () => {
  const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
  
  const { visibleItems, totalHeight, containerProps } = useVirtualList(items, {
    itemHeight: 50,
    containerHeight: 400,
    overscan: 5
  });
  
  return (
    <div {...containerProps} data-virtual-list-container>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, data, style }) => (
          <div key={index} style={style}>
            {data.name}
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### useMemoizedCallback - 记忆化回调
```typescript
import { useCallback, useRef } from 'react';

export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const ref = useRef<T>();
  const depsRef = useRef<React.DependencyList>();
  
  // 检查依赖是否变化
  const depsChanged = !depsRef.current ||
    depsRef.current.length !== deps.length ||
    depsRef.current.some((dep, index) => dep !== deps[index]);
  
  if (depsChanged) {
    ref.current = callback;
    depsRef.current = deps;
  }
  
  return useCallback((...args: Parameters<T>) => {
    return ref.current!(...args);
  }, []) as T;
};

// 使用示例
const ExpensiveComponent = ({ data, onItemClick }: {
  data: any[];
  onItemClick: (item: any) => void;
}) => {
  // 避免每次渲染都创建新的回调函数
  const memoizedOnClick = useMemoizedCallback(
    (item: any) => {
      console.log('Expensive calculation...');
      onItemClick(item);
    },
    [onItemClick]
  );
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => memoizedOnClick(item)}>
          {item.name}
        </div>
      ))}
    </div>
  );
};
```

## Hook测试策略

### 1. Hook单元测试
```typescript
// __tests__/hooks/useToggle.test.ts
import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../useToggle';

describe('useToggle', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });
  
  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });
  
  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.value).toBe(true);
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.value).toBe(false);
  });
  
  it('should set value to true', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current.setTrue();
    });
    
    expect(result.current.value).toBe(true);
  });
  
  it('should set value to false', () => {
    const { result } = renderHook(() => useToggle(true));
    
    act(() => {
      result.current.setFalse();
    });
    
    expect(result.current.value).toBe(false);
  });
});
```

### 2. 异步Hook测试
```typescript
// __tests__/hooks/useAsyncData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAsyncData } from '../useAsyncData';

const mockAsyncFunction = jest.fn();

describe('useAsyncData', () => {
  beforeEach(() => {
    mockAsyncFunction.mockClear();
  });
  
  it('should handle successful data fetching', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockAsyncFunction.mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useAsyncData(mockAsyncFunction));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
  });
  
  it('should handle error', async () => {
    const mockError = new Error('Test error');
    mockAsyncFunction.mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useAsyncData(mockAsyncFunction));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBe(null);
    expect(result.current.error).toEqual(mockError);
  });
  
  it('should refetch data', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockAsyncFunction.mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useAsyncData(mockAsyncFunction));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
    
    await act(async () => {
      await result.current.refetch();
    });
    
    expect(mockAsyncFunction).toHaveBeenCalledTimes(2);
  });
});
```

## Hook性能优化

### 1. 避免不必要的重新渲染
```typescript
// 使用useMemo优化计算
const useOptimizedData = (rawData: any[]) => {
  const processedData = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }));
  }, [rawData]);
  
  return processedData;
};

// 使用useCallback优化函数
const useOptimizedHandlers = (onSave: (data: any) => void) => {
  const handleSave = useCallback((data: any) => {
    // 预处理数据
    const processedData = preprocessData(data);
    onSave(processedData);
  }, [onSave]);
  
  return { handleSave };
};
```

### 2. 内存泄漏防护
```typescript
const useMemorySafeEffect = () => {
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const data = await api.getData();
        if (isMounted) {
          setData(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);
};
```

## Hook文档和规范

### 1. Hook命名规范
```typescript
// ✅ 正确的Hook命名
useUserData()        // 获取用户数据
useToggleState()     // 切换状态
useFormValidation()  // 表单验证
useApiCall()         // API调用

// ❌ 错误的Hook命名
getUserData()        // 缺少use前缀
useData()           // 太泛化
useStuff()          // 不明确
```

### 2. Hook文档模板
```typescript
/**
 * useLocalStorage - 本地存储状态管理Hook
 *
 * @description 提供与localStorage同步的状态管理功能
 *
 * @param key - localStorage的键名
 * @param initialValue - 初始值
 *
 * @returns 包含当前值、设置函数和删除函数的数组
 *
 * @example
 * ```tsx
 * const [user, setUser, removeUser] = useLocalStorage('user', null);
 *
 * // 设置用户
 * setUser({ name: 'John', email: 'john@example.com' });
 *
 * // 删除用户
 * removeUser();
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] => {
  // 实现...
};
```

## 总结

Hook策略设计的核心目标：

### 设计优势
1. **分层架构**: 原始Hook、复合Hook、业务Hook三层清晰分离
2. **高度复用**: 通过组合模式实现功能复用
3. **类型安全**: 完整的TypeScript类型支持
4. **性能优化**: 内置性能优化和内存泄漏防护
5. **易于测试**: 标准化的测试策略和工具

### 关键特性
1. **单一职责**: 每个Hook只负责一个明确的功能
2. **组合优先**: 通过Hook组合实现复杂功能
3. **状态隔离**: 不同层级的Hook状态相互独立
4. **错误处理**: 完善的错误处理和边界情况处理

### 实施建议
1. **渐进式采用**: 从简单Hook开始，逐步构建复杂Hook
2. **文档完善**: 为每个Hook编写详细的使用文档
3. **测试覆盖**: 确保所有Hook都有完整的测试覆盖
4. **性能监控**: 建立Hook性能监控和优化机制

这个Hook策略设计为React Dashboard项目提供了完整的状态逻辑复用解决方案，确保代码的可维护性和可扩展性。