import { useUserConsumptionRankings } from '@/hooks/useUserConsumptionRankings';
import RankingItem from './RankingItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { UserConsumptionRanking as UserConsumptionRankingType } from '@/types/dashboard';

const UserConsumptionRanking: React.FC = () => {
  const { data, isLoading, isError } = useUserConsumptionRankings();

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
        <CardTitle>User Consumption Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {(data.data as UserConsumptionRankingType[]).map((item, index) => (
            <RankingItem key={item.id} item={item} index={index} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UserConsumptionRanking;