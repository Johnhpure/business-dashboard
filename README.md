# Business Dashboard

一个现代化的商业仪表板项目，包含原生JavaScript和React两个版本的实现。

## 项目特性

- 📊 **多种图表展示** - 收入趋势、分红分布、地图可视化
- 📈 **KPI指标卡片** - 实时业务关键指标展示
- 🏆 **排名系统** - 门店和合作伙伴排名
- 📱 **响应式设计** - 适配各种设备屏幕
- ✨ **动画效果** - 流畅的交互动画
- 🎨 **现代UI设计** - 简洁美观的界面

## 项目结构

```
├── index.html              # 原生JS版本主页面
├── js/                     # 原生JS版本脚本
│   ├── main.js            # 主要逻辑
│   ├── charts.js          # 图表组件
│   ├── data.js            # 数据管理
│   └── animations.js      # 动画效果
├── styles/                 # 原生版本样式
│   ├── main.css           # 主样式
│   ├── components.css     # 组件样式
│   └── animations.css     # 动画样式
└── react-dashboard/        # React版本
    ├── src/
    │   ├── components/    # React组件
    │   ├── services/      # 数据服务
    │   ├── types/         # TypeScript类型
    │   └── utils/         # 工具函数
    └── package.json       # 依赖配置
```

## 快速开始

### 原生JavaScript版本

直接在浏览器中打开 `index.html` 文件即可运行。

### React版本

```bash
cd react-dashboard
npm install
npm run dev
```

## 技术栈

### 原生版本
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript
- Chart.js (图表库)

### React版本
- React 18
- TypeScript
- Tailwind CSS
- Recharts (图表库)
- Zustand (状态管理)

## 功能模块

- **KPI指标**: 总收入、月增长率、活跃用户、转化率
- **收入分析**: 月度收入趋势图表
- **分红分布**: 饼图展示分红分配
- **地图可视化**: 地理位置数据展示
- **排名系统**: 门店和合作伙伴业绩排名

## 开发计划

查看 `.kiro/specs/business-dashboard/` 目录下的详细规划文档：
- `requirements.md` - 需求文档
- `design.md` - 设计文档
- `tasks.md` - 任务清单

## 许可证

MIT License