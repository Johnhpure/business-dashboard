# React Dashboard 重构计划与改进建议

本文档旨在为 `react-dashboard` 项目提供一套全面的重构计划和具体的改进建议。目标是将项目从当前的静态原型阶段，推进到一个数据驱动、结构清晰、易于扩展的生产级应用。

## 核心原则

重构将遵循以下核心原则：

1.  **数据驱动**: UI 应完全由状态驱动，移除所有硬编码的模拟数据。
2.  **关注点分离**: 明确划分组件、状态管理、数据获取和业务逻辑的职责。
3.  **类型安全**: 统一并强制使用在 `src/types` 中定义的全局类型。
4.  **可测试性**: 架构设计应易于进行单元测试和集成测试。

## 改进建议详情

### 建议一：创建统一的数据服务与模拟层

**目标**: 解耦组件与数据获取逻辑，为未来接入真实 API 做准备。

**实施步骤**:

1.  **创建模拟数据文件**:
    *   在 `src/services/` 目录下创建一个新文件 `mockData.ts`。
    *   将 `html-dashboard` 和当前 `react-dashboard` 组件中所有的模拟数据统一迁移到此文件中。
    *   导出一个包含所有模拟数据的对象。

    **`src/services/mockData.ts` (示例)**:
    ```typescript
    import type { Statistics, RevenueChartData, /* ... other types */ } from '@/types';

    export const mockStatistics: Statistics = {
      totalRevenue: 12580000,
      // ... 其他统计数据
    };

    export const mockRevenueData: RevenueChartData = {
      monthly: [
        // ... 月度数据
      ],
      // ... 其他周期数据
    };

    // ... 其他模拟数据
    ```

2.  **创建模拟服务层**:
    *   在 `src/services/` 目录下创建一个新文件 `mockService.ts`。
    *   这个文件将模拟 `dashboardService.ts` 中的 API 调用，但返回 `mockData.ts` 中的数据，并模拟网络延迟。

    **`src/services/mockService.ts` (示例)**:
    ```typescript
    import { mockStatistics, mockRevenueData } from './mockData';
    import type { Statistics, RevenueChartData } from '@/types';

    const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

    export const mockDashboardService = {
      async getStatistics(filters?: any): Promise<Statistics> {
        await simulateDelay(500);
        console.log('Mock API: Fetching statistics with filters', filters);
        return mockStatistics;
      },

      async getRevenueData(filters?: any): Promise<RevenueChartData> {
        await simulateDelay(800);
        console.log('Mock API: Fetching revenue data with filters', filters);
        return mockRevenueData;
      },
      // ... 模拟其他所有 dashboardService 中的方法
    };
    ```

3.  **修改 `dashboardService.ts`**:
    *   在开发环境中，使其调用 `mockService` 而不是真实的 `apiClient`。

    **`src/services/dashboardService.ts` (修改)**:
    ```typescript
    import { apiClient } from './api';
    import { mockDashboardService } from './mockService';
    // ... 其他导入

    const useMock = import.meta.env.VITE_USE_MOCK === 'true';

    export class DashboardService {
      static async getStatistics(filters?: FilterOptions): Promise<Statistics> {
        if (useMock) return mockDashboardService.getStatistics(filters);
        return apiClient.get<Statistics>('/dashboard/statistics', { params: filters });
      }
      // ... 对所有方法应用相同的逻辑
    }
    ```

### 建议二：以 Hooks 为中心重构数据流

**目标**: 将数据获取和状态管理的逻辑从组件中抽离，实现真正的关注点分离。

**实施步骤**:

1.  **创建自定义 Hooks**:
    *   在 `src/hooks/` 目录下，为每个主要的数据域创建一个自定义 Hook。
    *   这些 Hooks 将使用 `React Query` 来调用 `DashboardService`，并处理加载、错误和数据状态。
    *   同时，它们可以从 `Zustand` store 中获取筛选条件，并在筛选条件变化时自动重新获取数据。

    **`src/hooks/useStatistics.ts` (示例)**:
    ```typescript
    import { useQuery } from '@tanstack/react-query';
    import { DashboardService } from '@/services';
    import { useDashboardStore } from '@/stores';

    export function useStatistics() {
      const filters = useDashboardStore(state => state.filters);

      return useQuery({
        queryKey: ['statistics', filters],
        queryFn: () => DashboardService.getStatistics(filters),
        placeholderData: (previousData) => previousData, // 避免加载时闪烁
      });
    }
    ```

2.  **重构页面和组件**:
    *   修改 `Dashboard.tsx`, `KPIGrid.tsx`, `MapContainer.tsx` 等组件。
    *   移除所有硬编码的数据和局部的 `useState`。
    *   调用新创建的自定义 Hooks 来获取数据。
    *   处理 `isLoading`, `isError`, 和 `data` 状态，渲染加载指示器、错误信息或数据。

    **`src/pages/Dashboard.tsx` (重构后示例)**:
    ```typescript
    import { useStatistics } from '@/hooks/useStatistics';
    // ... 其他导入

    const Dashboard: React.FC = () => {
      const { data: statistics, isLoading, isError } = useStatistics();

      if (isLoading) return <LoadingSpinner />;
      if (isError) return <ErrorMessage />;

      return (
        <MainLayout>
          {statistics && <KPIGrid data={statistics} />}
          {/* ... 其他组件 */}
        </MainLayout>
      );
    };
    ```

### 建议三：统一并强化类型系统

**目标**: 消除类型冗余，确保整个应用的数据结构一致性和类型安全。

**实施步骤**:

1.  **移除局部类型**:
    *   删除 `KPIGrid.tsx` 中定义的 `KPIData` 和 `BusinessData` 接口。
2.  **使用全局类型**:
    *   修改 `KPIGrid.tsx` 的 props，使其直接使用从 `@/types` 导入的 `Statistics` 类型。

    **`src/components/kpi/KPIGrid.tsx` (重构后 props)**:
    ```typescript
    import type { Statistics } from '@/types';

    interface KPIGridProps {
      data: Statistics;
      className?: string;
    }
    ```

### 建议四：实现缺失的功能模块

**目标**: 完成 `html-dashboard` 中所有核心功能的迁移。

**实施步骤**:

1.  **创建图表组件**:
    *   在 `src/components/charts/` 目录下，创建 `RevenueChart.tsx`, `DividendTrendChart.tsx` 等新组件。
    *   每个图表组件内部都应该有一个对应的自定义 Hook (例如 `useRevenueData`) 来获取数据。
    *   使用 `echarts-for-react` 来渲染图表，并将数据和配置传递给它。

2.  **创建排行榜组件**:
    *   在 `src/components/rankings/` 目录下，创建 `StoreRanking.tsx`, `BusinessRanking.tsx` 等新组件。
    *   同样，每个排行榜组件也应该有自己的数据 Hook (例如 `useStoreRanking`)。
    *   创建可复用的 `RankingItem.tsx` 组件来渲染每一行的数据。

3.  **集成到主页面**:
    *   在 `Dashboard.tsx` 中，引入并渲染新创建的图表和排行榜组件，将它们放置在正确的布局位置。

## 建议的目录结构

为了支持上述重构，建议的文件结构如下：

```
src/
├── components/
│   ├── charts/
│   │   ├── RevenueChart.tsx
│   │   └── ... (其他图表)
│   ├── common/
│   ├── kpi/
│   │   ├── KPIGrid.tsx
│   │   └── KPICard.tsx
│   ├── layout/
│   ├── rankings/
│   │   ├── StoreRanking.tsx
│   │   └── RankingItem.tsx
│   └── ui/
├── hooks/
│   ├── useStatistics.ts
│   ├── useRevenueData.ts
│   └── ... (其他数据 Hooks)
├── pages/
│   └── Dashboard.tsx
├── services/
│   ├── api.ts
│   ├── dashboardService.ts
│   ├── mockData.ts       (新增)
│   └── mockService.ts      (新增)
├── stores/
│   └── dashboardStore.ts
└── types/
    └── dashboard.ts
```

## 下一步

这份重构计划为后续的开发工作提供了清晰的路线图。我建议您审查这份计划。如果计划获得批准，下一步就是请求切换到“代码”模式，并开始按照本计划中的步骤逐一实施。