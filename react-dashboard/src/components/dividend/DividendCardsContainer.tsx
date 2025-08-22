import DividendDetailsCard from './DividendDetailsCard'

interface DividendCardsContainerProps {
  className?: string
}

/**
 * 分红卡片容器组件
 * 完全匹配HTML版本的分红详情展示
 */
const DividendCardsContainer: React.FC<DividendCardsContainerProps> = ({ className = '' }) => {
  // 当前分红轮次数据
  const currentDividendItems = [
    {
      role: '商户',
      amount: 136000,
      icon: 'fas fa-store',
      iconClass: 'store-icon'
    },
    {
      role: '用户',
      amount: 102000,
      icon: 'fas fa-users',
      iconClass: 'user-icon'
    }
  ]

  // 历史分红轮次数据
  const historyDividendItems = [
    {
      role: '合伙人',
      amount: 272000,
      icon: 'fas fa-handshake',
      iconClass: 'partner-icon'
    },
    {
      role: '商务',
      amount: 170000,
      icon: 'fas fa-user-tie',
      iconClass: 'business-icon'
    }
  ]

  return (
    <div className={`dividend-cards-container ${className}`}>
      {/* 当前分红轮次详情 */}
      <DividendDetailsCard
        title="第25次分红详情"
        roundNumber={25}
        items={currentDividendItems}
        totalAmount={680000}
        countdown="24h"
      />

      {/* 分红历史记录 */}
      <DividendDetailsCard
        title="第24轮分红详情"
        roundNumber={24}
        items={historyDividendItems}
        totalAmount={650000}
        countdown="24h"
      />
    </div>
  )
}

export default DividendCardsContainer