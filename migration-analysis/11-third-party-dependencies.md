# 第三方依赖清单

## 核心依赖库

### 1. 图表可视化库

#### ECharts (Apache ECharts)
**版本：** 5.4.0+
**CDN链接：** `https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.min.js`
**用途：** 主要图表渲染引擎
**功能模块：**
- 折线图（收入趋势图）
- 饼图（分红分布图）
- 柱状图（分红统计图）
- 地图（中国地图可视化）
- 工具提示（Tooltip）
- 图例（Legend）
- 数据缩放（DataZoom）

**关键特性：**
- Canvas渲染
- 响应式图表
- 动画效果
- 交互功能
- 主题定制

**迁移考虑：**
- React版本：`echarts-for-react`
- 替代方案：`recharts`, `victory`, `d3.js`
- 性能影响：大型库，需要按需加载

#### ECharts地图扩展
**文件：** `china.js` (中国地图数据)
**用途：** 提供中国地图的GeoJSON数据
**功能：**
- 省份边界数据
- 地理坐标信息
- 省份名称映射

**数据结构：**
```javascript
{
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "省份名称" },
            geometry: { type: "Polygon", coordinates: [...] }
        }
    ]
}
```

### 2. 字体和图标库

#### Font Awesome (可选)
**版本：** 6.0+
**用途：** 图标显示
**使用场景：**
- 趋势箭头图标
- 菜单图标
- 状态指示图标
- 操作按钮图标

**迁移方案：**
- React版本：`@fortawesome/react-fontawesome`
- 替代方案：`react-icons`, `lucide-react`
- 自定义SVG图标

### 3. 工具库

#### Lodash (部分功能)
**版本：** 4.17.21
**用途：** 数据处理工具函数
**使用功能：**
- `_.debounce()` - 防抖函数
- `_.throttle()` - 节流函数
- `_.cloneDeep()` - 深拷贝
- `_.merge()` - 对象合并
- `_.sortBy()` - 数组排序

**代码示例：**
```javascript
// 搜索防抖
const debouncedSearch = _.debounce(searchFunction, 300);

// 滚动节流
const throttledScroll = _.throttle(scrollHandler, 16);
```

**迁移考虑：**
- 按需导入减少包大小
- 原生JavaScript替代
- 现代浏览器API支持

## 开发和构建工具

### 1. 模块加载器

#### ES6 Modules (原生)
**用途：** JavaScript模块化
**语法：**
```javascript
// 导出
export class Dashboard { }
export default DataManager;

// 导入
import { Dashboard } from './dashboard.js';
import DataManager from './data-manager.js';
```

**浏览器支持：**
- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 16+

### 2. CSS预处理器 (未使用)

#### 原生CSS
**特性使用：**
- CSS变量 (Custom Properties)
- CSS Grid布局
- Flexbox布局
- CSS动画和过渡
- 媒体查询

**现代CSS特性：**
```css
/* CSS变量 */
:root {
    --primary-color: #00d4ff;
    --glass-bg: rgba(255, 255, 255, 0.05);
}

/* Grid布局 */
.kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* 背景模糊 */
.glass-card {
    backdrop-filter: blur(20px);
}
```

## 浏览器API依赖

### 1. 现代浏览器API

#### Intersection Observer API
**用途：** 元素可见性检测
**功能：** 滚动动画触发
**浏览器支持：** Chrome 51+, Firefox 55+, Safari 12.1+

**代码示例：**
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
});
```

#### ResizeObserver API
**用途：** 元素尺寸变化监听
**功能：** 响应式图表重绘
**浏览器支持：** Chrome 64+, Firefox 69+, Safari 13.1+

#### RequestAnimationFrame API
**用途：** 动画帧控制
**功能：** 平滑动画效果
**浏览器支持：** 所有现代浏览器

### 2. Web Storage API

#### LocalStorage
**用途：** 本地数据缓存
**存储内容：**
- 用户偏好设置
- 筛选器状态
- 图表配置
- 缓存数据

**代码示例：**
```javascript
// 存储数据
localStorage.setItem('dashboard-config', JSON.stringify(config));

// 读取数据
const config = JSON.parse(localStorage.getItem('dashboard-config'));
```

#### SessionStorage
**用途：** 会话级数据存储
**存储内容：**
- 临时筛选状态
- 页面状态
- 用户操作历史

## 可选依赖和增强功能

### 1. 动画库

#### 原生CSS动画
**当前实现：** 纯CSS动画和过渡
**优势：** 性能好，无额外依赖
**功能：**
- 关键帧动画
- 过渡效果
- 变换动画

**可选增强库：**
- `framer-motion` (React动画库)
- `react-spring` (基于物理的动画)
- `lottie-react` (Lottie动画)

### 2. 数据处理库

#### 当前实现：原生JavaScript
**功能：**
- 数据格式化
- 数组操作
- 对象处理
- 数学计算

**可选增强库：**
- `date-fns` (日期处理)
- `numeral.js` (数字格式化)
- `d3-array` (数组处理)
- `ramda` (函数式编程)

### 3. 状态管理库

#### 当前实现：原生事件系统
**模式：** 观察者模式
**功能：** 组件间通信

**React迁移选项：**
- `zustand` (轻量状态管理)
- `redux-toolkit` (Redux现代化)
- `jotai` (原子化状态)
- React Context API

## 开发工具依赖

### 1. 代码质量工具

#### ESLint (推荐)
**配置文件：** `.eslintrc.js`
**规则集：**
- `@eslint/js/recommended`
- `eslint-plugin-react` (React迁移后)
- `eslint-plugin-react-hooks`

#### Prettier (推荐)
**配置文件：** `.prettierrc`
**格式化规则：**
```json
{
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 80,
    "tabWidth": 2
}
```

### 2. 构建工具

#### Vite (推荐用于React迁移)
**优势：**
- 快速热重载
- ES模块支持
- 现代浏览器优化
- 插件生态丰富

**配置示例：**
```javascript
// vite.config.js
export default {
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    }
}
```

#### Webpack (备选方案)
**适用场景：** 复杂构建需求
**配置复杂度：** 较高
**生态系统：** 成熟完善

## 测试依赖

### 1. 单元测试

#### Jest
**用途：** JavaScript测试框架
**功能：**
- 单元测试
- 快照测试
- 模拟函数
- 覆盖率报告

#### React Testing Library (React迁移后)
**用途：** React组件测试
**功能：**
- 组件渲染测试
- 用户交互测试
- 可访问性测试

### 2. 端到端测试

#### Playwright (推荐)
**优势：**
- 多浏览器支持
- 现代API设计
- 自动等待机制
- 强大的调试工具

#### Cypress (备选)
**优势：**
- 开发者友好
- 实时重载
- 时间旅行调试
- 丰富的生态系统

## 性能监控依赖

### 1. 性能分析

#### Web Vitals
**用途：** 核心网页指标监控
**指标：**
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

**代码示例：**
```javascript
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

### 2. 错误监控

#### Sentry (可选)
**用途：** 错误追踪和性能监控
**功能：**
- 错误捕获
- 性能监控
- 用户会话重放
- 告警通知

## 部署和CDN依赖

### 1. CDN服务

#### jsDelivr
**用途：** ECharts库CDN加载
**优势：** 全球CDN，加载速度快
**备选：** unpkg, cdnjs

#### 字体CDN
**Google Fonts (可选)：**
- 系统字体优先
- 网络字体作为备选
- 字体显示优化

### 2. 静态资源

#### 图片资源
**格式支持：**
- WebP (现代浏览器)
- PNG (兼容性备选)
- SVG (图标和简单图形)

**优化策略：**
- 响应式图片
- 懒加载
- 压缩优化

## 迁移建议和替代方案

### 1. React生态系统迁移

#### 图表库迁移
**推荐方案：**
1. `echarts-for-react` - 保持ECharts功能
2. `recharts` - React原生图表库
3. `victory` - 模块化图表库
4. `d3.js + React` - 自定义图表

#### 状态管理迁移
**推荐方案：**
1. `zustand` - 简单轻量
2. `jotai` - 原子化状态
3. React Context - 原生方案
4. `redux-toolkit` - 复杂应用

#### 动画库迁移
**推荐方案：**
1. `framer-motion` - 声明式动画
2. `react-spring` - 基于物理的动画
3. CSS-in-JS动画 - 样式库集成
4. 原生CSS动画 - 性能最优

### 2. 现代化升级建议

#### TypeScript集成
**优势：**
- 类型安全
- 更好的IDE支持
- 重构友好
- 文档化代码

#### 包管理器升级
**推荐：** pnpm > yarn > npm
**优势：**
- 更快的安装速度
- 更少的磁盘占用
- 更好的依赖管理

#### 构建工具现代化
**推荐：** Vite > Webpack
**优势：**
- 更快的开发体验
- 更简单的配置
- 更好的ES模块支持

这份第三方依赖清单详细记录了HTML Dashboard项目的所有依赖关系，为React迁移提供了完整的技术栈参考和升级建议。