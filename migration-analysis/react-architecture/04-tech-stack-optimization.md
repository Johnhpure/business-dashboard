# 技术栈优化方案

## 当前技术栈分析

### 现有技术栈
```json
{
  "核心框架": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "typescript": "~5.8.3"
  },
  "构建工具": {
    "vite": "^7.0.4",
    "@vitejs/plugin-react": "^4.6.0"
  },
  "状态管理": {
    "zustand": "^5.0.7"
  },
  "UI框架": {
    "tailwindcss": "^4.1.11",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-slot": "^1.2.3"
  },
  "图表库": {
    "echarts": "^5.6.0",
    "echarts-for-react": "^3.0.2"
  },
  "动画库": {
    "framer-motion": "^12.23.12"
  },
  "工具库": {
    "dayjs": "^1.11.13",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1",
    "class-variance-authority": "^0.7.1"
  },
  "开发工具": {
    "eslint": "^9.30.1",
    "vitest": "^3.2.4",
    "@testing-library/react": "^16.3.0"
  }
}
```

## 技术栈优化策略

### 1. 核心框架优化

#### React 19 特性利用
```typescript
// 利用React 19的新特性
import { use, startTransition } from 'react';

// 1. 使用新的use Hook处理Promise
const DataComponent: React.FC = () => {
  const data = use(fetchDashboardData()); // 直接使用Promise
  return <div>{data.title}</div>;
};

// 2. 利用并发特性优化大数据渲染
const LargeDataList: React.FC<{ items: any[] }> = ({ items }) => {
  const [isPending, startTransition] = useTransition();
  const [filteredItems, setFilteredItems] = useState(items);

  const handleFilter = (filterValue: string) => {
    startTransition(() => {
      // 大数据过滤操作放在transition中
      setFilteredItems(items.filter(item => 
        item.name.includes(filterValue)
      ));
    });
  };

  return (
    <div>
      <input onChange={(e) => handleFilter(e.target.value)} />
      {isPending && <div>过滤中...</div>}
      <VirtualList items={filteredItems} />
    </div>
  );
};

// 3. 使用Server Components概念（如果需要SSR）
// 注意：这需要Next.js或类似框架支持
async function ServerDataComponent() {
  const data = await fetchServerData();
  return <ClientDataComponent initialData={data} />;
}
```

#### TypeScript 5.8 高级特性
```typescript
// 1. 使用更精确的类型推导
type DashboardConfig = {
  readonly [K in keyof DashboardData]: {
    readonly enabled: boolean;
    readonly config: DashboardData[K] extends Array<infer T> 
      ? T extends object 
        ? Partial<T> 
        : never
      : never;
  };
};

// 2. 使用模板字面量类型
type EventName = `dashboard:${string}:${string}`;
type EventHandler<T extends EventName> = (event: CustomEvent<T>) => void;

// 3. 使用条件类型优化API类型
type APIResponse<T> = T extends 'success' 
  ? { status: 'success'; data: any }
  : { status: 'error'; error: string };

// 4. 使用映射类型优化组件Props
type ComponentVariants<T extends Record<string, any>> = {
  [K in keyof T]: {
    variant: K;
    props: T[K];
  };
}[keyof T];
```

### 2. 构建工具优化

#### Vite 配置优化
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // 启用React Fast Refresh
      fastRefresh: true,
      // 启用React DevTools
      jsxImportSource: '@emotion/react'
    })
  ],
  
  // 路径别名优化
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // 构建优化
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库分离
          vendor: ['react', 'react-dom'],
          charts: ['echarts', 'echarts-for-react'],
          ui: ['framer-motion', '@radix-ui/react-select'],
          utils: ['dayjs', 'clsx', 'tailwind-merge']
        }
      }
    },
    
    // 压缩优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true
      }
    },
    
    // 资源优化
    assetsInlineLimit: 4096, // 小于4kb的资源内联
    chunkSizeWarningLimit: 1000 // chunk大小警告阈值
  },
  
  // 开发服务器优化
  server: {
    hmr: {
      overlay: false // 关闭错误覆盖层
    },
    fs: {
      strict: false // 允许访问工作区外的文件
    }
  },
  
  // 依赖预构建优化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'echarts',
      'framer-motion'
    ],
    exclude: [
      '@testing-library/react' // 测试库不需要预构建
    ]
  }
});
```

#### 新增构建插件
```typescript
// 添加有用的Vite插件
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react(),
    
    // 包大小分析
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    }),
    
    // HTML模板处理
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: '拼好拼数据看板',
          description: '现代化数据可视化看板'
        }
      }
    }),
    
    // 旧浏览器兼容
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
});
```

### 3. 状态管理优化

#### Zustand 高级配置
```typescript
// 增强的Zustand配置
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 1. 组合多个中间件
const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // store实现
          data: null,
          loading: false,
          
          // 使用immer简化不可变更新
          updateData: (newData) => set((state) => {
            state.data = { ...state.data, ...newData };
          }),
          
          // 批量更新
          batchUpdate: (updates) => set((state) => {
            Object.assign(state, updates);
          })
        }))
      ),
      {
        name: 'dashboard-store',
        // 选择性持久化
        partialize: (state) => ({
          filters: state.filters,
          preferences: state.preferences
        })
      }
    ),
    { name: 'Dashboard Store' }
  )
);

// 2. 状态选择器优化
const useOptimizedSelector = <T>(
  selector: (state: DashboardState) => T,
  equalityFn?: (a: T, b: T) => boolean
) => {
  return useDashboardStore(selector, equalityFn || shallow);
};

// 3. 状态订阅优化
const useStoreSubscription = () => {
  useEffect(() => {
    const unsubscribe = useDashboardStore.subscribe(
      (state) => state.data,
      (data, prevData) => {
        if (data !== prevData) {
          // 数据变化时的副作用
          console.log('Data updated:', data);
        }
      }
    );
    
    return unsubscribe;
  }, []);
};
```

#### 新增状态管理工具
```typescript
// React Query集成（用于服务器状态）
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});

// 数据获取Hook
const useDashboardData = (filters: FilterState) => {
  return useQuery({
    queryKey: ['dashboard-data', filters],
    queryFn: () => fetchDashboardData(filters),
    enabled: !!filters,
    refetchInterval: 30000, // 30秒自动刷新
    refetchIntervalInBackground: false
  });
};

// Jotai集成（用于原子化状态）
import { atom, useAtom } from 'jotai';

// 原子化状态定义
const filtersAtom = atom<FilterState>(initialFilters);
const dataAtom = atom<DashboardData | null>(null);
const loadingAtom = atom<boolean>(false);

// 派生状态
const filteredDataAtom = atom((get) => {
  const data = get(dataAtom);
  const filters = get(filtersAtom);
  return data ? applyFilters(data, filters) : null;
});
```

### 4. UI框架优化

#### Tailwind CSS 配置优化
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html'
  ],
  
  // 暗色模式优化
  darkMode: 'class',
  
  theme: {
    extend: {
      // 自定义设计系统
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)'
        }
      },
      
      // 自定义动画
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      
      // 自定义字体
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      
      // 自定义间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    }
  },
  
  plugins: [
    // 添加有用的插件
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    
    // 自定义插件
    function({ addUtilities }) {
      addUtilities({
        '.glass-effect': {
          'backdrop-filter': 'blur(20px)',
          'background': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)'
        }
      });
    }
  ]
};
```

#### Radix UI 组件优化
```typescript
// 创建统一的组件系统
import * as RadixSelect from '@radix-ui/react-select';
import { cva, type VariantProps } from 'class-variance-authority';

// 使用CVA创建变体系统
const selectVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

// 封装Radix组件
interface SelectProps extends VariantProps<typeof selectVariants> {
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  onValueChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ 
  variant, 
  size, 
  placeholder, 
  options, 
  onValueChange 
}) => {
  return (
    <RadixSelect.Root onValueChange={onValueChange}>
      <RadixSelect.Trigger className={selectVariants({ variant, size })}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon />
      </RadixSelect.Trigger>
      
      <RadixSelect.Portal>
        <RadixSelect.Content className="glass-effect rounded-md p-1">
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="absolute right-2">
                  ✓
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};
```

### 5. 图表库优化

#### ECharts 按需加载
```typescript
// echarts按需导入配置
import * as echarts from 'echarts/core';

// 按需导入图表类型
import {
  LineChart,
  BarChart,
  PieChart,
  MapChart,
  ScatterChart
} from 'echarts/charts';

// 按需导入组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent
} from 'echarts/components';

// 按需导入渲染器
import { CanvasRenderer } from 'echarts/renderers';

// 注册必需的组件
echarts.use([
  LineChart,
  BarChart,
  PieChart,
  MapChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  CanvasRenderer
]);

// 创建图表主题
const darkTheme = {
  color: ['#00d4ff', '#667eea', '#764ba2', '#f093fb', '#f5576c'],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#ffffff'
  },
  title: {
    textStyle: {
      color: '#ffffff'
    }
  },
  legend: {
    textStyle: {
      color: '#b8c5d6'
    }
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    axisLabel: {
      color: '#b8c5d6'
    }
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    axisLabel: {
      color: '#b8c5d6'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
};

// 注册主题
echarts.registerTheme('dark', darkTheme);

// 优化的图表Hook
const useOptimizedChart = (containerId: string) => {
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      chartRef.current = echarts.init(
        containerRef.current,
        'dark',
        {
          renderer: 'canvas', // 使用Canvas渲染器获得更好性能
          useDirtyRect: true, // 启用脏矩形优化
          width: 'auto',
          height: 'auto'
        }
      );
    }
    
    return () => {
      chartRef.current?.dispose();
    };
  }, []);
  
  // 响应式处理
  useEffect(() => {
    const handleResize = debounce(() => {
      chartRef.current?.resize();
    }, 300);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { chartRef, containerRef };
};
```

### 6. 动画库优化

#### Framer Motion 配置优化
```typescript
// 创建动画预设
const animationPresets = {
  // 页面切换动画
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  
  // 卡片动画
  cardHover: {
    whileHover: { 
      scale: 1.02, 
      y: -2,
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.98 }
  },
  
  // 列表项动画
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.2 }
  },
  
  // 数字滚动动画
  numberRoll: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

// 性能优化的动画组件
const OptimizedMotionDiv = motion(
  forwardRef<HTMLDivElement, any>((props, ref) => (
    <div ref={ref} {...props} />
  ))
);

// 减少重渲染的动画Hook
const useOptimizedAnimation = (isVisible: boolean) => {
  const controls = useAnimation();
  
  useEffect(() => {
    if (isVisible) {
      controls.start('animate');
    } else {
      controls.start('initial');
    }
  }, [isVisible, controls]);
  
  return controls;
};
```

### 7. 工具库优化

#### 日期处理优化
```typescript
// Day.js 插件配置
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/zh-cn';

// 按需加载插件
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.locale('zh-cn');

// 创建日期工具类
class DateUtils {
  static format(date: Date | string, format = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(date).format(format);
  }
  
  static fromNow(date: Date | string) {
    return dayjs(date).fromNow();
  }
  
  static duration(start: Date | string, end: Date | string) {
    return dayjs(end).diff(dayjs(start), 'millisecond');
  }
  
  static isToday(date: Date | string) {
    return dayjs(date).isSame(dayjs(), 'day');
  }
  
  static getTimeRange(range: TimeRange) {
    const now = dayjs();
    switch (range) {
      case 'today':
        return [now.startOf('day'), now.endOf('day')];
      case 'week':
        return [now.startOf('week'), now.endOf('week')];
      case 'month':
        return [now.startOf('month'), now.endOf('month')];
      case 'quarter':
        return [now.startOf('quarter'), now.endOf('quarter')];
      case 'year':
        return [now.startOf('year'), now.endOf('year')];
      default:
        return [now, now];
    }
  }
}
```

#### 工具函数优化
```typescript
// 创建高性能工具函数
import { debounce, throttle, memoize } from 'lodash-es';

// 防抖和节流工具
export const createDebounced = <T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
) => debounce(fn, delay);

export const createThrottled = <T extends (...args: any[]) => any>(
  fn: T,
  delay = 100
) => throttle(fn, delay);

// 记忆化工具
export const createMemoized = <T extends (...args: any[]) => any>(
  fn: T,
  resolver?: (...args: Parameters<T>) => string
) => memoize(fn, resolver);

// 数据格式化工具
export class FormatUtils {
  static number(value: number, options?: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat('zh-CN', {
      maximumFractionDigits: 2,
      ...options
    }).format(value);
  }
  
  static currency(value: number) {
    return this.number(value, {
      style: 'currency',
      currency: 'CNY'
    });
  }
  
  static percentage(value: number) {
    return this.number(value / 100, {
      style: 'percent',
      minimumFractionDigits: 1
    });
  }
  
  static largeNumber(value: number) {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}亿`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return this.number(value);
  }
}
```

### 8. 开发工具优化

#### ESLint 配置优化
```javascript
// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      
      // TypeScript规则
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // React规则
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      
      // 代码质量规则
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-debugger': 'error'
    }
  }
);
```

#### Vitest 配置优化
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // 性能配置
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1
      }
    }
  }
});
```

## 包大小优化策略

### 1. Bundle分析和优化
```typescript
// 使用webpack-bundle-analyzer分析包大小
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// 在vite.config.ts中添加
export default defineConfig({
  plugins: [
    // 其他插件...
    process.env.ANALYZE && new BundleAnalyzerPlugin()
  ]
});

// package.json中添加脚本
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### 2. 代码分割策略
```typescript
// 路由级代码分割
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// 组件级代码分割
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// 条件加载
const AdminPanel = lazy(() => 
  import('./components/AdminPanel').then(module => ({
    default: module.AdminPanel
  }))
);

// 动态导入工具函数
const loadUtility = async (utilityName: string) => {
  const module = await import(`./utils/${utilityName}`);
  return module.default;
};
```

### 3. Tree Shaking优化
```typescript
// 确保正确的导入方式
// ❌ 错误方式 - 导入整个库
import _ from 'lodash';

// ✅ 正确方式 - 按需导入
import { debounce, throttle } from 'lodash-es';

// ❌ 错误方式 - 导入整个图标库
import * as Icons from 'lucide-react';

// ✅ 正确方式 - 按需导入图标
import { ChartLine, Users, Store } from 'lucide-react';

// 配置支持Tree Shaking的包
// package.json
{
  "sideEffects": false, // 标记为无副作用
  "type": "module" // 使用ES模块
}
```

## 性能监控和优化

### 1. 性能监控工具
```typescript
// Web Vitals监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // 发送到分析服务
  console.log('Performance metric:', metric);
};

// 监控核心Web指标
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// React性能监控
const ProfilerOnRender = (id: string, phase: string, actualDuration: number) => {
  if (actualDuration > 16) { // 超过一帧时间
    console.warn(`Slow render in ${id}: ${actualDuration}ms`);
  }
};

// 使用Profiler包装组件
<Profiler id="Dashboard" onRender={ProfilerOnRender}>
  <Dashboard />
</Profiler>
```

### 2. 内存泄漏检测
```typescript
// 内存泄漏检测工具
class MemoryLeakDetector {
  private static instance: MemoryLeakDetector;
  private subscriptions = new Set<() => void>();
  private timers = new Set<NodeJS.Timeout>();
  private observers = new Set<any>();

  static getInstance() {
    if (!this.instance) {
      this.instance = new MemoryLeakDetector();
    }
    return this.instance;
  }

  addSubscription(unsubscribe: () => void) {
    this.subscriptions.add(unsubscribe);
  }

  addTimer(timer: NodeJS.Timeout) {
    this.timers.add(timer);
  }

  addObserver(observer: any) {
    this.observers.add(observer);
  }

  cleanup() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.timers.forEach(timer => clearTimeout(timer));
    this.observers.forEach(observer => observer.disconnect?.());
    
    this.subscriptions.clear();
    this.timers.clear();
    this.observers.clear();
  }
}

// Hook使用示例
const useMemoryLeakProtection = () => {
  const detector = MemoryLeakDetector.getInstance();
  
  useEffect(() => {
    return () => detector.cleanup();
  }, []);
  
  return detector;
};
```

## 新技术集成建议

### 1. React Server Components (未来)
```typescript
// 为未来的RSC做准备
// 服务器组件（在服务器运行）
async function ServerDashboardData() {
  const data = await fetchDashboardData();
  return <DashboardDataDisplay data={data} />;
}

// 客户端组件（在浏览器运行）
'use client';
function InteractiveDashboard({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  // 客户端交互逻辑
  return <Dashboard data={data} />;
}
```

### 2. Web Workers集成
```typescript
// 大数据处理Web Worker
// worker.ts
self.onmessage = function(e) {
  const { data, operation } = e.data;
  
  switch (operation) {
    case 'processLargeDataset':
      const result = processLargeDataset(data);
      self.postMessage({ result });
      break;
    case 'calculateStatistics':
      const stats = calculateStatistics(data);
      self.postMessage({ stats });
      break;
  }
};

// 主线程使用
const useWebWorker = (workerScript: string) => {
  const workerRef = useRef<Worker | null>(null);
  
  useEffect(() => {
    workerRef.current = new Worker(workerScript);
    
    return () => {
      workerRef.current?.terminate();
    };
  }, [workerScript]);
  
  const postMessage = useCallback((data: any) => {
    return new Promise((resolve) => {
      if (workerRef.current) {
        workerRef.current.postMessage(data);
        workerRef.current.onmessage = (e) => resolve(e.data);
      }
    });
  }, []);
  
  return { postMessage };
};
```

### 3. PWA功能集成
```typescript
// PWA配置
// vite-plugin-pwa配置
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.dashboard\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
              }
            }
          }
        ]
      },
      manifest: {
        name: '拼好拼数据看板',
        short_name: '数据看板',
        description: '现代化数据可视化看板',
        theme_color: '#00d4ff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

## 升级路径规划

### 短期优化 (1-2周)
1. **Vite配置优化**
   - 添加构建分析工具
   - 优化代码分割策略
   - 配置性能监控

2. **依赖优化**
   - ECharts按需加载
   - 工具库Tree Shaking
   - 移除未使用依赖

3. **开发工具优化**
   - ESLint规则完善
   - Vitest配置优化
   - 添加性能监控

### 中期优化 (2-4周)
1. **状态管理升级**
   - React Query集成
   - 状态持久化优化
   - 错误处理完善

2. **UI框架优化**
   - 设计系统完善
   - 组件库标准化
   - 主题系统升级

3. **性能优化**
   - 虚拟滚动实现
   - 图片懒加载
   - 缓存策略优化

### 长期优化 (1-2月)
1. **新技术集成**
   - Web Workers应用
   - PWA功能添加
   - 微前端架构

2. **架构升级**
   - 服务器组件准备
   - 边缘计算集成
   - 实时数据流优化

## 总结

技术栈优化方案的核心目标：

### 优化效果预期
1. **性能提升**: 首屏加载时间减少30-40%
2. **包大小优化**: 总包大小减少25-35%
3. **开发效率**: 构建速度提升50%以上
4. **用户体验**: 交互响应时间减少20-30%

### 关键优化点
1. **按需加载**: ECharts、图标库、工具函数
2. **代码分割**: 路由级和组件级分割
3. **缓存策略**: 多层缓存和智能失效
4. **性能监控**: 实时性能指标收集

### 实施优先级
1. **高优先级**: Vite配置、依赖优化、性能监控
2. **中优先级**: 状态管理升级、UI框架优化
3. **低优先级**: 新技术集成、架构升级

这个技术栈优化方案为React Dashboard项目提供了全面的性能提升和开发体验改善策略。