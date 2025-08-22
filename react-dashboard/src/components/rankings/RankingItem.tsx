import type { RankingItem as RankingItemType } from '@/types/dashboard';
import { cn } from '@/utils/cn';

interface RankingItemProps {
  item: RankingItemType;
  index: number;
}

const RankingItem: React.FC<RankingItemProps> = ({ item, index }) => {
  const rankColor =
    index === 0
      ? 'text-yellow-400'
      : index === 1
      ? 'text-gray-300'
      : index === 2
      ? 'text-yellow-600'
      : 'text-gray-400';

  return (
    <li className="flex items-center justify-between p-2 border-b border-gray-700">
      <div className="flex items-center">
        <span className={cn('mr-4 font-bold text-lg', rankColor)}>{item.rank}</span>
        <div>
          <p className="font-semibold text-white">{item.name}</p>
          {item.location && (
            <p className="text-sm text-gray-400">{item.location}</p>
          )}
        </div>
      </div>
      <span className="font-semibold text-green-400">{item.value.toLocaleString()}</span>
    </li>
  );
};

export default RankingItem;