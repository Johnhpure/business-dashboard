# 样式规范清单

## 设计系统概览

### 设计理念
- **科技感暗黑主题** - 深色背景配合青蓝色主色调
- **玻璃拟态设计** - 半透明背景配合模糊效果
- **现代化界面** - 圆角、阴影、渐变的现代设计语言
- **数据可视化** - 突出数据展示的清晰度和可读性

## 颜色规范

### 1. 主色调系统

#### 主色调 (Primary)
```css
--primary-color: #00d4ff;      /* 青蓝色 - 主要强调色 */
--primary-dark: #0099cc;       /* 深青蓝 - 悬停状态 */
--primary-light: #33ddff;      /* 浅青蓝 - 高亮状态 */
```

**使用场景：**
- 品牌标识和Logo
- 主要按钮和链接
- 重要数据高亮
- 进度条和指示器
- 图表主色调

#### 背景色系统
```css
--bg-primary: #0a0a0f;         /* 主背景 - 深黑色 */
--bg-secondary: #1a1a2e;       /* 次背景 - 深蓝灰 */
--bg-tertiary: #16213e;        /* 第三背景 - 蓝灰色 */
```

**使用场景：**
- `bg-primary`: 页面主背景
- `bg-secondary`: 卡片和容器背景
- `bg-tertiary`: 嵌套容器背景

#### 玻璃效果色彩
```css
--glass-bg: rgba(255, 255, 255, 0.05);      /* 玻璃背景 - 5%白色透明 */
--glass-border: rgba(255, 255, 255, 0.1);   /* 玻璃边框 - 10%白色透明 */
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); /* 玻璃阴影 */
```

**使用场景：**
- 所有卡片组件背景
- 按钮和输入框背景
- 弹窗和模态框背景

### 2. 文字颜色系统

```css
--text-primary: #ffffff;       /* 主文字 - 纯白色 */
--text-secondary: #b8c5d6;     /* 次文字 - 浅灰蓝 */
--text-muted: #6b7280;         /* 弱化文字 - 灰色 */
```

**使用层级：**
- `text-primary`: 标题、重要数据、主要内容
- `text-secondary`: 副标题、说明文字、标签
- `text-muted`: 占位符、禁用状态、辅助信息

### 3. 功能色彩系统

```css
--success-color: #10b981;      /* 成功色 - 绿色 */
--warning-color: #f59e0b;      /* 警告色 - 橙色 */
--error-color: #ef4444;        /* 错误色 - 红色 */
--info-color: #3b82f6;         /* 信息色 - 蓝色 */
```

**使用场景：**
- 状态指示器
- 趋势箭头和数据变化
- 通知和提示信息
- 表单验证反馈

### 4. 渐变色系统

```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
--gradient-warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
--gradient-error: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
```

**使用场景：**
- KPI卡片顶部装饰条
- 按钮背景渐变
- 图表区域填充
- 进度条背景

### 5. KPI卡片专用色彩

```css
/* 收入卡片 */
.kpi-card[data-kpi="revenue"]::before {
    background: var(--gradient-primary);
}

/* 商户卡片 */
.kpi-card[data-kpi="stores"]::before {
    background: var(--gradient-success);
}

/* 用户卡片 */
.kpi-card[data-kpi="users"]::before {
    background: var(--gradient-warning);
}

/* 商务卡片 */
.kpi-card[data-kpi="business"]::before {
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
}

/* 分红卡片 */
.kpi-card[data-kpi="dividend"]::before {
    background: var(--gradient-error);
}
```

## 字体规范

### 1. 字体族系统

```css
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;
```

**字体选择原则：**
- 优先使用系统字体确保性能
- 无衬线字体提高屏幕可读性
- 等宽字体用于数字和代码显示

### 2. 字体大小系统

#### 标题字体
```css
h1 { font-size: 2.25rem; }    /* 36px - 页面主标题 */
h2 { font-size: 1.875rem; }   /* 30px - 区域标题 */
h3 { font-size: 1.5rem; }     /* 24px - 卡片标题 */
h4 { font-size: 1.25rem; }    /* 20px - 子标题 */
```

#### 正文字体
```css
.text-lg { font-size: 1.125rem; }   /* 18px - 大号正文 */
.text-base { font-size: 1rem; }     /* 16px - 标准正文 */
.text-sm { font-size: 0.875rem; }   /* 14px - 小号正文 */
.text-xs { font-size: 0.75rem; }    /* 12px - 极小正文 */
```

#### 数据字体
```css
.kpi-value .number {
    font-family: var(--font-mono);
    font-size: 2rem;              /* 32px - KPI主数据 */
    font-weight: 700;
}

.ranking-amount {
    font-family: var(--font-mono);
    font-size: 1rem;              /* 16px - 排行榜数据 */
    font-weight: 700;
}
```

### 3. 字体权重系统

```css
.font-light { font-weight: 300; }     /* 细体 - 辅助信息 */
.font-normal { font-weight: 400; }    /* 常规 - 正文内容 */
.font-medium { font-weight: 500; }    /* 中等 - 强调文字 */
.font-semibold { font-weight: 600; }  /* 半粗 - 小标题 */
.font-bold { font-weight: 700; }      /* 粗体 - 数据和标题 */
```

### 4. 行高系统

```css
.leading-tight { line-height: 1.25; }    /* 紧密行高 - 标题 */
.leading-normal { line-height: 1.5; }    /* 标准行高 - 正文 */
.leading-relaxed { line-height: 1.625; } /* 宽松行高 - 长文本 */
```

## 间距规范

### 1. 间距系统

```css
--spacing-xs: 0.25rem;    /* 4px - 极小间距 */
--spacing-sm: 0.5rem;     /* 8px - 小间距 */
--spacing-md: 1rem;       /* 16px - 标准间距 */
--spacing-lg: 1.5rem;     /* 24px - 大间距 */
--spacing-xl: 2rem;       /* 32px - 超大间距 */
--spacing-2xl: 3rem;      /* 48px - 巨大间距 */
```

### 2. 间距使用规则

#### 组件内部间距
```css
/* 卡片内边距 */
.kpi-card { padding: var(--spacing-xl); }           /* 32px */
.chart-container { padding: var(--spacing-xl); }    /* 32px */
.ranking-card { padding: var(--spacing-xl); }       /* 32px */

/* 元素间距 */
.kpi-content > * + * { margin-top: var(--spacing-xs); }  /* 4px */
.filter-group { margin-bottom: var(--spacing-xl); }      /* 32px */
```

#### 布局间距
```css
/* 网格间距 */
.kpi-grid { gap: var(--spacing-lg); }        /* 24px */
.charts-grid { gap: var(--spacing-lg); }     /* 24px */
.ranking-grid { gap: var(--spacing-lg); }    /* 24px */

/* 区域间距 */
.content-area > * + * { margin-top: var(--spacing-xl); } /* 32px */
```

### 3. 响应式间距

```css
/* 移动端间距调整 */
@media (max-width: 768px) {
    .kpi-card { padding: var(--spacing-md); }      /* 16px */
    .kpi-grid { gap: var(--spacing-md); }          /* 16px */
    .dashboard-header { padding: var(--spacing-md); } /* 16px */
}
```

## 圆角规范

### 1. 圆角系统

```css
--radius-sm: 0.375rem;    /* 6px - 小圆角 */
--radius-md: 0.5rem;      /* 8px - 标准圆角 */
--radius-lg: 0.75rem;     /* 12px - 大圆角 */
--radius-xl: 1rem;        /* 16px - 超大圆角 */
```

### 2. 圆角使用规则

```css
/* 主要容器 */
.glass-card { border-radius: var(--radius-lg); }      /* 12px */
.dashboard-header { border-radius: var(--radius-lg); } /* 12px */

/* 交互元素 */
.glass-button { border-radius: var(--radius-md); }     /* 8px */
.glass-select { border-radius: var(--radius-md); }     /* 8px */
.control-btn { border-radius: var(--radius-sm); }      /* 6px */

/* 装饰元素 */
.progress-bar { border-radius: 2px; }                  /* 固定2px */
.avatar { border-radius: 50%; }                        /* 圆形 */
```

## 阴影规范

### 1. 阴影系统

```css
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);        /* 玻璃阴影 */
--hover-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);       /* 悬停阴影 */
--focus-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);     /* 焦点阴影 */
```

### 2. 阴影使用场景

```css
/* 基础阴影 */
.glass-card {
    box-shadow: var(--glass-shadow);
}

/* 交互阴影 */
.kpi-card:hover {
    box-shadow: var(--glass-shadow), 0 0 20px rgba(0, 212, 255, 0.2);
}

/* 焦点阴影 */
.glass-select:focus {
    box-shadow: var(--focus-shadow);
}
```

## 动画规范

### 1. 动画时长系统

```css
--transition-fast: 0.2s;      /* 快速动画 - 按钮反馈 */
--transition-normal: 0.3s;    /* 标准动画 - 悬停效果 */
--transition-slow: 0.5s;      /* 慢速动画 - 数据变化 */
```

### 2. 缓动函数系统

```css
.ease-in { animation-timing-function: ease-in; }
.ease-out { animation-timing-function: ease-out; }
.ease-in-out { animation-timing-function: ease-in-out; }
.ease-bounce { animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }
```

### 3. 常用动画效果

#### 进入动画
```css
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
```

#### 交互动画
```css
/* 悬停上浮 */
.kpi-card:hover {
    transform: translateY(-2px);
    transition: all var(--transition-normal) ease;
}

/* 点击波纹 */
@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
```

#### 数据动画
```css
/* 数字计数动画 */
@keyframes countUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 进度条动画 */
@keyframes progressFill {
    from { width: 0%; }
}
```

## 布局规范

### 1. 网格系统

#### 主要网格布局
```css
/* KPI网格 - 自适应列数 */
.kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
}

/* 可视化网格 - 固定比例 */
.viz-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-lg);
    align-items: stretch;
}

/* 排行榜网格 - 三等分 */
.ranking-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--spacing-lg);
}
```

#### 响应式网格
```css
@media (max-width: 1200px) {
    .viz-grid,
    .charts-grid {
        grid-template-columns: 1fr;
    }
    
    .ranking-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .kpi-grid,
    .business-grid {
        grid-template-columns: 1fr;
    }
}
```

### 2. Flexbox系统

#### 头部布局
```css
.dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
}

.header-left,
.header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
}

.header-center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

#### 卡片布局
```css
.kpi-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
}

.ranking-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}
```

### 3. 定位系统

#### 固定定位
```css
.background-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.dashboard-header {
    position: sticky;
    top: var(--spacing-md);
    z-index: 100;
}
```

#### 相对定位
```css
.glass-card {
    position: relative;
    overflow: hidden;
}

.glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
}
```

## 组件样式规范

### 1. 玻璃卡片组件

```css
.glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--glass-shadow);
    position: relative;
    overflow: hidden;
}

.glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}
```

### 2. 按钮组件

```css
.glass-button {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast) ease;
}

.glass-button:hover {
    border-color: var(--primary-color);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    transform: translateY(-1px);
}

.control-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all var(--transition-fast) ease;
}

.control-btn.active {
    color: var(--primary-color);
    border-color: var(--primary-color);
    background: rgba(0, 212, 255, 0.2);
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}
```

### 3. 输入组件

```css
.glass-select {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-fast) ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right var(--spacing-sm) center;
    background-repeat: no-repeat;
    background-size: 1rem;
    padding-right: 2.5rem;
}

.glass-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}
```

### 4. 排行榜组件

```css
.ranking-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: var(--spacing-sm);
    transition: all var(--transition-fast) ease;
    position: relative;
    overflow: hidden;
}

.ranking-item:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--primary-color);
    transform: translateX(4px);
}

.ranking-number {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
}

.ranking-number.top-1 {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #000;
}

.ranking-number.top-2 {
    background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
    color: #000;
}

.ranking-number.top-3 {
    background: linear-gradient(135deg, #cd7f32, #daa520);
    color: #fff;
}
```

## 响应式设计规范

### 1. 断点系统

```css
/* 大屏幕 */
@media (min-width: 1201px) {
    /* 桌面端样式 */
}

/* 中等屏幕 */
@media (max-width: 1200px) {
    .viz-grid,
    .charts-grid {
        grid-template-columns: 1fr;
    }
    
    .ranking-grid {
        grid-template-columns: 1fr;
    }
}

/* 小屏幕 */
@media (max-width: 768px) {
    .dashboard-main {
        flex-direction: column;
    }
    
    .kpi-grid,
    .business-grid {
        grid-template-columns: 1fr;
    }
    
    .dashboard-header {
        flex-direction: column;
        height: auto;
        gap: var(--spacing-md);
    }
}
```

### 2. 响应式字体

```css
@media (max-width: 768px) {
    .kpi-value .number {
        font-size: 1.5rem;  /* 从2rem缩小到1.5rem */
    }
    
    .province-item {
        font-size: 0.7rem;  /* 从0.75rem缩小到0.7rem */
    }
}
```

### 3. 响应式间距

```css
@media (max-width: 768px) {
    .kpi-card {
        padding: var(--spacing-md);  /* 从xl缩小到md */
    }
    
    .dashboard-header {
        padding: var(--spacing-md);  /* 从xl缩小到md */
    }
}
```

## 主题扩展规范

### 1. 主题变量结构

```css
:root {
    /* 基础颜色 */
    --primary-hue: 195;
    --primary-saturation: 100%;
    --primary-lightness: 50%;
    
    /* 计算颜色 */
    --primary-color: hsl(var(--primary-hue), var(--primary-saturation), var(--primary-lightness));
    --primary-dark: hsl(var(--primary-hue), var(--primary-saturation), calc(var(--primary-lightness) - 10%));
    --primary-light: hsl(var(--primary-hue), var(--primary-saturation), calc(var(--primary-lightness) + 10%));
}
```

### 2. 暗色主题适配

```css
[data-theme="dark"] {
    --bg-primary: #0a0a0f;
    --bg-secondary: #1a1a2e;
    --text-primary: #ffffff;
    --text-secondary: #b8c5d6;
}

[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --text-primary: #1a202c;
    --text-secondary: #4a5568;
}
```

### 3. 高对比度支持

```css
@media (prefers-contrast: high) {
    :root {
        --glass-bg: rgba(255, 255, 255, 0.1);
        --glass-border: rgba(255, 255, 255, 0.3);
        --text-secondary: #ffffff;
    }
}
```

### 4. 减少动画支持

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## 性能优化规范

### 1. CSS优化

```css
/* 使用transform代替position变化 */
.kpi-card:hover {
    transform: translateY(-2px);  /* 而不是 top: -2px; */
}

/* 使用opacity代替visibility */
.fade-in {
    opacity: 0;
    transition: opacity var(--transition-normal) ease;
}

.fade-in.visible {
    opacity: 1;
}
```

### 2. GPU加速

```css
.gpu-accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}
```

### 3. 关键CSS内联

```html
<style>
/* 关键路径CSS - 首屏渲染必需样式 */
body { 
    background: #0a0a0f; 
    color: #ffffff; 
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
.dashboard-container { 
    min-height: 100vh; 
    display: flex; 
    flex-direction: column; 
}
</style>
```

这份样式规范清单为HTML Dashboard项目提供了完整的视觉设计标准，确保在React迁移过程中能够准确还原原有的视觉效果和用户体验。