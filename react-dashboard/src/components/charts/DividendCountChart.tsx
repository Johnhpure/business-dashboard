import { useDividendData } from '@/hooks/useDividendData';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { DividendChartData } from '@/types/dashboard';

const DividendCountChart: React.FC = () => {
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

  const chartData = (data as DividendChartData).byBusiness;

  return (
    <Card className="bg-glass">
      <CardHeader>
        <CardTitle>Dividend Count by Business</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="label" stroke="white" />
            <YAxis stroke="white" />
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DividendCountChart;