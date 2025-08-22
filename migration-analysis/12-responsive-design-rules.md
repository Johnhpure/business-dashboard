# 响应式设计规则

## 断点系统

### 1. 主要断点定义

#### 断点分类
```css
/* 大屏幕 - 桌面端 */
@media (min-width: 1201px) {
    /* 桌面端优化样式 */
}

/* 中等屏幕 - 平板端 */
@media (max-width: 1200px) and (min-width: 769px) {
    /* 平板端适配样式 */
}

/* 小屏幕 - 移动端 */
@media (max-width: 768px) {
    /* 移动端适配样式 */
}

/* 超小屏幕 - 小型移动设备 */
@media (max-width: 480px) {
    /* 小型移动设备优化 */
}
```

#### 断点使用策略
**移动优先 (Mobile First)：**
- 基础样式针对移动端设计
- 使用 `min-width` 媒体查询向上扩展
- 渐进增强的设计理念

**关键断点值：**
- `768px` - 移动端与平板端分界线
- `1200px` - 平板端与桌面端分界线
- `480px` - 小型移动设备优化点

### 2. 容器响应式规则

#### 主容器适配
```css
.dashboard-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
}

/* 平板端 */
@media (max-width: 1200px) {
    .dashboard-container {
        max-width: 100%;
        padding: 0 24px;
    }
}

/* 移动端 */
@media (max-width: 768px) {
    .dashboard-container {
        padding: 0 16px;
    }
}
```

#### 内容区域适配
```css
.content-area {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

/* 桌面端 */
@media (min-width: 1201px) {
    .content-area {
        gap: 48px;
    }
}

/* 移动端 */
@media (max-width: 768px) {
    .content-area {
        gap: 24px;
    }
}
```

## 网格布局响应式

### 1. KPI卡片网格

#### 桌面端布局
```css
.kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    align-items: stretch;
}

/* 大屏幕优化 */
@media (min-width: 1400px) {
    .kpi-grid {
        grid-template-columns: repeat(5, 1fr);
        gap: 32px;
    }
}
```

#### 平板端适配
```css
@media (max-width: 1200px) {
    .kpi-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }
}
```

#### 移动端适配
```css
@media (max-width: 768px) {
    .kpi-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}

/* 小型移动设备 */
@media (max-width: 480px) {
    .kpi-grid {
        gap: 12px;
    }
}
```

### 2. 图表区域网格

#### 桌面端布局
```css
.charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    align-items: stretch;
    min-height: 400px;
}
```

#### 平板端适配
```css
@media (max-width: 1200px) {
    .charts-grid {
        grid-template-columns: 1fr;
        gap: 20px;
        min-height: auto;
    }
}
```

#### 移动端适配
```css
@media (max-width: 768px) {
    .charts-grid {
        gap: 16px;
    }
    
    .chart-container {
        min-height: 300px;
    }
}
```

### 3. 排行榜网格

#### 桌面端布局
```css
.ranking-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 24px;
    align-items: start;
}
```

#### 平板端适配
```css
@media (max-width: 1200px) {
    .ranking-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}
```

#### 移动端适配
```css
@media (max-width: 768px) {
    .ranking-grid {
        gap: 16px;
    }
}
```

## 组件响应式规则

### 1. 头部导航响应式

#### 桌面端布局
```css
.dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    padding: 0 32px;
}

.header-left,
.header-right {
    display: flex;
    align-items: center;
    gap: 24px;
}

.header-center {
    flex: 1;
    display: flex;
    justify-content: center;
}
```

#### 平板端适配
```css
@media (max-width: 1200px) {
    .dashboard-header {
        padding: 0 24px;
        height: 60px;
    }
    
    .header-left,
    .header-right {
        gap: 16px;
    }
}
```

#### 移动端适配
```css
@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        height: auto;
        padding: 16px;
        gap: 16px;
    }
    
    .header-left,
    .header-center,
    .header-right {
        width: 100%;
        justify-content: center;
    }
    
    .header-left {
        order: 2;
    }
    
    .header-center {
        order: 1;
    }
    
    .header-right {
        order: 3;
    }
}
```

### 2. KPI卡片响应式

#### 卡片内部布局
```css
.kpi-card {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 32px;
    min-height: 120px;
}

.kpi-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
}

.kpi-content {
    flex: 1;
    min-width: 0;
}
```

#### 平板端适配
```css
@media (max-width: 1200px) {
    .kpi-card {
        gap: 20px;
        padding: 24px;
        min-height: 100px;
    }
    
width: 40px;
        height: 40px;
    }
}
```

#### 移动端适配
```css
@media (max-width: 768px) {
    .kpi-card {
        gap: 16px;
        padding: 20px;
        min-height: 80px;
    }
    
    .kpi-icon {
        width: 36px;
        height: 36px;
    }
    
    .kpi-value .number {
        font-size: 1.5rem;
    }
    
    .kpi-value .label {
        font-size: 0.875rem;
    }
}
```

### 3. 图表组件响应式

#### 图表容器适配
```css
.chart-container {
    position: relative;
    width: 100%;
    height: 400px;
    padding: 32px;
}

/* 平板端 */
@media (max-width: 1200px) {
    .chart-container {
        height: 350px;
        padding: 24px;
    }
}

/* 移动端 */
@media (max-width: 768px) {
    .chart-container {
        height: 300px;
        padding: 16px;
    }
}

/* 小型移动设备 */
@media (max-width: 480px) {
    .chart-container {
        height: 250px;
        padding: 12px;
    }
}
```

#### 图表标题响应式
```css
.chart-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 16px;
}

@media (max-width: 768px) {
    .chart-title {
        font-size: 1.125rem;
        margin-bottom: 12px;
    }
}

@media (max-width: 480px) {
    .chart-title {
        font-size: 1rem;
        margin-bottom: 8px;
    }
}
```

### 4. 排行榜组件响应式

#### 排行榜项目布局
```css
.ranking-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    margin-bottom: 8px;
}

.ranking-number {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
}

.ranking-info {
    flex: 1;
    min-width: 0;
}

.ranking-amount {
    flex-shrink: 0;
    font-weight: 700;
}
```

#### 移动端适配
```css
@media (max-width: 768px) {
    .ranking-item {
        gap: 12px;
        padding: 12px;
        margin-bottom: 6px;
    }
    
    .ranking-number {
        width: 28px;
        height: 28px;
    }
    
    .ranking-info .name {
        font-size: 0.875rem;
    }
    
    .ranking-amount {
        font-size: 0.875rem;
    }
}
```

## 字体响应式规则

### 1. 标题字体缩放

#### 主标题响应式
```css
h1 {
    font-size: 2.25rem;
    line-height: 1.2;
}

@media (max-width: 1200px) {
    h1 {
        font-size: 2rem;
    }
}

@media (max-width: 768px) {
    h1 {
        font-size: 1.75rem;
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 1.5rem;
    }
}
```

#### 副标题响应式
```css
h2 {
    font-size: 1.875rem;
    line-height: 1.3;
}

@media (max-width: 1200px) {
    h2 {
        font-size: 1.625rem;
    }
}

@media (max-width: 768px) {
    h2 {
        font-size: 1.5rem;
    }
}

@media (max-width: 480px) {
    h2 {
        font-size: 1.25rem;
    }
}
```

### 2. 正文字体缩放

#### 基础字体大小
```css
body {
    font-size: 16px;
    line-height: 1.5;
}

@media (max-width: 768px) {
    body {
        font-size: 14px;
        line-height: 1.4;
    }
}

@media (max-width: 480px) {
    body {
        font-size: 13px;
    }
}
```

#### 数据字体响应式
```css
.kpi-value .number {
    font-size: 2rem;
    font-weight: 700;
    font-family: 'SF Mono', monospace;
}

@media (max-width: 1200px) {
    .kpi-value .number {
        font-size: 1.75rem;
    }
}

@media (max-width: 768px) {
    .kpi-value .number {
        font-size: 1.5rem;
    }
}

@media (max-width: 480px) {
    .kpi-value .number {
        font-size: 1.25rem;
    }
}
```

## 间距响应式规则

### 1. 容器间距

#### 主要间距系统
```css
:root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
}

/* 平板端间距调整 */
@media (max-width: 1200px) {
    :root {
        --spacing-lg: 20px;
        --spacing-xl: 28px;
        --spacing-2xl: 40px;
    }
}

/* 移动端间距调整 */
@media (max-width: 768px) {
    :root {
        --spacing-md: 12px;
        --spacing-lg: 16px;
        --spacing-xl: 24px;
        --spacing-2xl: 32px;
    }
}
```

### 2. 组件内部间距

#### 卡片内边距
```css
.glass-card {
    padding: var(--spacing-xl);
}

@media (max-width: 768px) {
    .glass-card {
        padding: var(--spacing-lg);
    }
}

@media (max-width: 480px) {
    .glass-card {
        padding: var(--spacing-md);
    }
}
```

#### 网格间距
```css
.grid-container {
    gap: var(--spacing-lg);
}

@media (max-width: 768px) {
    .grid-container {
        gap: var(--spacing-md);
    }
}
```

## 交互元素响应式

### 1. 按钮响应式

#### 按钮尺寸适配
```css
.glass-button {
    padding: 12px 24px;
    font-size: 0.875rem;
    min-height: 44px;
}

@media (max-width: 768px) {
    .glass-button {
        padding: 14px 28px;
        font-size: 1rem;
        min-height: 48px;
    }
}

@media (max-width: 480px) {
    .glass-button {
        padding: 16px 32px;
        width: 100%;
        min-height: 52px;
    }
}
```

#### 控制按钮适配
```css
.control-btn {
    padding: 8px 16px;
    font-size: 0.75rem;
    min-height: 36px;
}

@media (max-width: 768px) {
    .control-btn {
        padding: 10px 20px;
        font-size: 0.875rem;
        min-height: 44px;
    }
}
```

### 2. 表单元素响应式

#### 选择器适配
```css
.glass-select {
    padding: 12px 16px;
    font-size: 0.875rem;
    min-height: 44px;
}

@media (max-width: 768px) {
    .glass-select {
        padding: 14px 20px;
        font-size: 1rem;
        min-height: 48px;
    }
}
```

#### 输入框适配
```css
.glass-input {
    padding: 12px 16px;
    font-size: 0.875rem;
    min-height: 44px;
}

@media (max-width: 768px) {
    .glass-input {
        padding: 14px 20px;
        font-size: 1rem;
        min-height: 48px;
    }
}
```

## 图片和媒体响应式

### 1. 图片响应式

#### 基础图片适配
```css
img {
    max-width: 100%;
    height: auto;
    display: block;
}

.responsive-image {
    width: 100%;
    height: auto;
    object-fit: cover;
}
```

#### 头像图片适配
```css
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

@media (max-width: 768px) {
    .avatar {
        width: 36px;
        height: 36px;
    }
}

@media (max-width: 480px) {
    .avatar {
        width: 32px;
        height: 32px;
    }
}
```

### 2. 图标响应式

#### 图标尺寸适配
```css
.icon {
    width: 24px;
    height: 24px;
}

.icon-sm {
    width: 16px;
    height: 16px;
}

.icon-lg {
    width: 32px;
    height: 32px;
}

@media (max-width: 768px) {
    .icon {
        width: 20px;
        height: 20px;
    }
    
    .icon-lg {
        width: 28px;
        height: 28px;
    }
}
```

## 动画响应式规则

### 1. 动画性能优化

#### 减少动画设置
```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

#### 移动端动画优化
```css
@media (max-width: 768px) {
    .animation-heavy {
        animation: none;
    }
    
    .transition-smooth {
        transition-duration: 0.2s;
    }
}
```

### 2. 触摸设备优化

#### 悬停效果适配
```css
@media (hover: hover) {
    .hover-effect:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }
}

@media (hover: none) {
    .hover-effect:active {
        transform: scale(0.98);
    }
}
```

## 性能优化响应式

### 1. 图片懒加载

#### 响应式图片加载
```css
.lazy-image {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.lazy-image.loaded {
    opacity: 1;
}

@media (max-width: 768px) {
    .lazy-image {
        transition-duration: 0.2s;
    }
}
```

### 2. 内容优先级

#### 移动端内容隐藏
```css
.desktop-only {
    display: block;
}

@media (max-width: 768px) {
    .desktop-only {
        display: none;
    }
}

.mobile-only {
    display: none;
}

@media (max-width: 768px) {
    .mobile-only {
        display: block;
    }
}
```

## 可访问性响应式

### 1. 焦点管理

#### 焦点指示器适配
```css
.focusable:focus {
    outline: 2px solid #00d4ff;
    outline-offset: 2px;
}

@media (max-width: 768px) {
    .focusable:focus {
        outline-width: 3px;
        outline-offset: 3px;
    }
}
```

### 2. 触摸目标尺寸

#### 最小触摸目标
```css
.touch-target {
    min-width: 44px;
    min-height: 44px;
}

@media (max-width: 768px) {
    .touch-target {
        min-width: 48px;
        min-height: 48px;
    }
}
```

## 测试和调试

### 1. 响应式测试断点

#### 常用测试尺寸
```css
/* 测试断点 */
/* 320px - iPhone SE */
/* 375px - iPhone 12 Mini */
/* 414px - iPhone 12 Pro Max */
/* 768px - iPad */
/* 1024px - iPad Pro */
/* 1200px - 小型桌面 */
/* 1400px - 标准桌面 */
/* 1920px - 大型桌面 */
```

### 2. 调试工具

#### 响应式调试类
```css
.debug-breakpoint::before {
    content: 'XS';
    position: fixed;
    top: 0;
    right: 0;
    background: red;
    color: white;
    padding: 4px 8px;
    z-index: 9999;
}

@media (min-width: 768px) {
    .debug-breakpoint::before {
        content: 'SM';
        background: orange;
    }
}

@media (min-width: 1200px) {
    .debug-breakpoint::before {
        content: 'LG';
        background: green;
    }
}
```

这份响应式设计规则文档详细记录了HTML Dashboard项目的所有响应式设计策略和实现细节，为React迁移提供了完整的响应式设计参考标准。
    .kpi-icon {