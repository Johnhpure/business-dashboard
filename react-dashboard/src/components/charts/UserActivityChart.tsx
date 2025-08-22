import { useUserActivityData } from '@/hooks/useUserActivityData';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const UserActivityChart: React.FC = () => {
  const { data, isLoading, isError } = useUserActivityData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <Card className="bg-glass">
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data.daily}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" strokeOpacity={0.3} />
            <XAxis dataKey="date" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            />
            <Legend wrapperStyle={{ color: 'white' }} />
            <Bar dataKey="newUsers" barSize={20} fill="#413ea0" name="New Users" />
            <Line type="monotone" dataKey="activeUsers" stroke="#ff7300" name="Active Users" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;