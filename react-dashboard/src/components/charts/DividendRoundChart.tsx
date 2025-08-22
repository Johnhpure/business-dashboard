import { useDividendData } from '@/hooks/useDividendData';
import type { DividendChartData } from '@/types/dashboard';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DividendRoundChart: React.FC = () => {
  const { data, isLoading, isError } = useDividendData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const distributionData = data?.distribution || {};
  const chartData = Object.entries(distributionData).map(([name, value]) => ({
    name,
    value: (value as number) * (data?.estimatedAmount ?? 0),
  }));

  return (
    <Card className="bg-glass">
      <CardHeader>
        <CardTitle>Dividend Rounds</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DividendRoundChart;