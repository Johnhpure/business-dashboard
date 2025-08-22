import { useBusinessRankings } from '@/hooks/useBusinessRankings';
import RankingItem from './RankingItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { BusinessRanking as BusinessRankingType } from '@/types/dashboard';

const BusinessRanking: React.FC = () => {
  const { data, isLoading, isError } = useBusinessRankings();

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
        <CardTitle>Business Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {(data.data as BusinessRankingType[]).map((item, index) => (
            <RankingItem key={item.id} item={item} index={index} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default BusinessRanking;