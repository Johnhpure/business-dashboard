
interface HeaderProps {
  className?: string
}

/**
 * 顶部导航栏组件
 * 完全匹配HTML版本的头部设计
 */
const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`dashboard-header glass-card ${className}`}>
      {/* 左侧Logo区域 */}
      <div className="header-left">
        <div className="logo">
          <i className="fas fa-chart-line"></i>
          <span>拼好拼数据看板</span>
        </div>
      </div>

      {/* 中间分红轮次展示区域 */}
      <div className="header-center">
        <div className="round-display-header">
          <div className="round-info-card">
            <div className="round-number-display">
              <span className="round-label">当前分红为：</span>
              <span className="round-current" id="totalDividendCount">第24次</span>
            </div>
            <div className="round-number-display">
              <span className="round-label-secondary">最新分红轮次：</span>
              <span className="round-current">第25轮</span>
              <span className="round-status-badge">进行中</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧用户信息区域 */}
      <div className="header-right">
        <div className="user-info">
          <div className="avatar">
            <i className="fas fa-user"></i>
          </div>
          <span>管理员</span>
        </div>
      </div>
    </header>
  )
}

export default Header