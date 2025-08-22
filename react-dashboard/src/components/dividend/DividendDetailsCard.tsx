
interface DividendItem {
  role: string
  amount: number
  icon: string
  iconClass: string
}

interface DividendDetailsCardProps {
  title: string
  roundNumber: number
  items: DividendItem[]
  totalAmount: number
  countdown?: string
  className?: string
}

/**
 * 分红详情卡片组件
 * 完全匹配HTML版本的分红详情展示
 */
const DividendDetailsCard: React.FC<DividendDetailsCardProps> = ({
  title,
  roundNumber,
  items,
  totalAmount,
  countdown,
  className = ''
}) => {
  return (
    <div className={`dividend-details glass-card compact-card ${className}`}>
      <div className="card-header">
        <h3>
          <i className="fas fa-coins"></i> {title}
        </h3>
      </div>
      
      <div className="dividend-details-content">
        <div className="dividend-grid">
          {/* 分红项目行 */}
          <div className="dividend-row">
            {items.slice(0, 2).map((item, index) => (
              <div key={index} className="dividend-item">
                <div className={`dividend-icon ${item.iconClass}`}>
                  <i className={item.icon}></i>
                </div>
                <div className="dividend-info">
                  <div className="dividend-label">{item.role}分红</div>
                  <div className="dividend-value">¥{item.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 如果有更多项目，继续显示 */}
          {items.length > 2 && (
            <div className="dividend-row">
              {items.slice(2, 4).map((item, index) => (
                <div key={index + 2} className="dividend-item">
                  <div className={`dividend-icon ${item.iconClass}`}>
                    <i className={item.icon}></i>
                  </div>
                  <div className="dividend-info">
                    <div className="dividend-label">{item.role}分红</div>
                    <div className="dividend-value">¥{item.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* 预估总额 */}
          <div className="dividend-item total-item">
            <div className="dividend-icon total-icon">
              <i className="fas fa-calculator"></i>
            </div>
            <div className="dividend-info">
              <div className="dividend-label">预估总额</div>
              <div className="dividend-value highlight">¥{totalAmount.toLocaleString()}</div>
            </div>
          </div>
          
          {/* 倒计时 */}
          {countdown && (
            <div className="dividend-item countdown-item">
              <div className="dividend-icon countdown-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="dividend-info">
                <div className="dividend-label">距下轮分红倒计时</div>
                <div className="dividend-value countdown">{countdown}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DividendDetailsCard