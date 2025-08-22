import { useStoreRankings } from '@/hooks/useStoreRankings';
import RankingItem from './RankingItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { StoreRanking as StoreRankingType } from '@/types/dashboard';

const StoreRanking: React.FC = () => {
  const { data, isLoading, isError } = useStoreRankings();

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
        <CardTitle>Store Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {(data.data as StoreRankingType[]).map((item, index) => (
            <RankingItem key={item.id} item={item} index={index} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default StoreRanking;