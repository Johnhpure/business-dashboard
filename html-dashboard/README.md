# HTML版本大屏数据看板

这是拼好拼业务数据看板的原始HTML版本，包含完整的前端展示功能。

## 项目结构

```
html-dashboard/
├── README.md                    # 项目说明文档
├── dashboard.html              # 主要数据看板页面
├── index.html                  # 首页数据看板
├── test-business-cards.html    # 业务卡片测试页面
├── test-revenue-chart.html     # 收入趋势图测试页面
├── test.html                   # 基础功能测试页面
├── styles/                     # 样式文件目录
│   ├── main.css               # 主要样式文件
│   ├── components.css         # 组件样式文件
│   └── animations.css         # 动画样式文件
└── js/                        # JavaScript文件目录
    ├── main.js               # 主要逻辑文件
    ├── charts.js             # 图表相关功能
    ├── data.js               # 数据管理功能
    └── animations.js         # 动画相关功能
```

## 功能特性

### 主要页面功能

1. **dashboard.html** - 完整的业务数据看板
   - KPI概览卡片（总交易金额、活跃商户、活跃用户、认证商务、分红池）
   - 业务数据卡片（消费点发放、抵用券消费、好点消费、抵用券提现）
   - 全国业绩流水概览（省份分布饼图）
   - 分红轮次详情展示
   - 收入趋势分析图表
   - 分红轮次和次数趋势图表
   - 商户收益排行榜
   - 商务进件排行榜
   - 用户消费排行榜

2. **index.html** - 简化版数据看板
   - 基础KPI展示
   - 地域筛选功能
   - 角色筛选功能
   - 分红轮次筛选
   - 全国业务分布地图
   - 分红轮次进度展示
   - 收入趋势和角色分红分布图表
   - 合伙人和商户收益排行榜

### 测试页面

- **test-business-cards.html** - 业务数据卡片样式测试
- **test-revenue-chart.html** - 收入趋势图表功能测试
- **test.html** - 基础数据加载和显示测试

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计，包含玻璃态效果和动画
- **JavaScript ES6+** - 交互逻辑和数据处理
- **ECharts 5.4.3** - 图表可视化库
- **Font Awesome 6.4.0** - 图标库

## 样式特色

- **玻璃态设计** - 现代化的半透明玻璃效果
- **渐变背景** - 深色主题配合渐变色彩
- **动态粒子背景** - 增强视觉效果的动态背景
- **响应式布局** - 适配不同屏幕尺寸
- **平滑动画** - 数字滚动和图表过渡动画

## 使用方法

### 直接访问
1. 在浏览器中打开任意HTML文件即可查看
2. 推荐使用 `dashboard.html` 查看完整功能
3. 使用 `index.html` 查看简化版本

### 本地服务器运行
```bash
# 进入html-dashboard目录
cd html-dashboard

# 使用Python启动简单HTTP服务器
python -m http.server 8080

# 或使用Node.js的http-server
npx http-server -p 8080

# 然后在浏览器访问 http://localhost:8080
```

## 数据说明

当前版本使用模拟数据进行展示，包括：
- KPI指标数据
- 业务统计数据
- 地理分布数据
- 排行榜数据
- 图表时间序列数据

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 注意事项

1. 部分功能需要在HTTP服务器环境下运行（如ES6模块导入）
2. 图表功能依赖ECharts库的CDN加载
3. 字体图标依赖Font Awesome的CDN加载
4. 建议使用现代浏览器以获得最佳体验

## 与React版本的关系

此HTML版本是原始的静态实现，React版本（位于 `../react-dashboard/` 目录）是基于此版本进行的现代化重构，提供了：
- 组件化架构
- TypeScript支持
- 更好的状态管理
- 更强的可维护性

两个版本在功能上保持一致，可以根据项目需求选择使用。