import BackgroundAnimation from '../common/BackgroundAnimation'
import Header from './Header'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * 主布局组件
 * 完全匹配HTML版本的整体布局结构
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`dashboard-container ${className}`}>
      {/* 动态背景 */}
      <BackgroundAnimation />
      
      {/* 顶部导航栏 */}
      <Header />
      
      {/* 主内容区域 */}
      <main className="dashboard-main">
        <div className="content-area full-width">
          {children}
        </div>
      </main>
    </div>
  )
}

export default MainLayout