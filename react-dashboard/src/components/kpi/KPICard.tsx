import { useEffect, useRef } from 'react'

interface KPICardProps {
  kpiType: 'revenue' | 'stores' | 'users' | 'business' | 'dividend' | 'points-issued' | 'voucher-consumed' | 'good-points-consumed' | 'voucher-withdrawal'
  icon: string
  label: string
  value: number
  unit: string
  todayNew?: {
    value: number
    unit: string
  }
  progress?: number
  className?: string
}

/**
 * KPI卡片组件
 * 完全匹配HTML版本的KPI卡片设计和动画效果
 */
const KPICard: React.FC<KPICardProps> = ({
  kpiType,
  icon,
  label,
  value,
  unit,
  todayNew,
  progress,
  className = ''
}) => {
  const numberRef = useRef<HTMLSpanElement>(null)
  const trendValueRef = useRef<HTMLSpanElement>(null)

  // 数字动画函数 - 匹配HTML版本的动画效果
  const animateNumber = (element: HTMLElement | null, start: number, end: number, duration = 2000) => {
    if (!element) return

    const startTime = performance.now()
    const difference = end - start // 计算起始值和结束值之间的差值

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1) // 计算动画进度
      const easedProgress = easeOutCubic(progress) // 应用缓动函数，使动画更自然

      const currentValue = Math.floor(start + difference * easedProgress) // 计算当前帧的数值
      element.textContent = formatNumber(currentValue) // 格式化并更新DOM

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        element.textContent = formatNumber(end)
      }
    }

    requestAnimationFrame(animate)
  }

  // 缓动函数
  const easeOutCubic = (t: number) => {
    return (--t) * t * t + 1
  }

  // 数字格式化 - 匹配HTML版本的格式化逻辑
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w'
    }
    return num.toLocaleString()
  }

  // 组件挂载后启动动画
  useEffect(() => {
    if (numberRef.current) {
      animateNumber(numberRef.current, 0, value)
    }
    if (trendValueRef.current && todayNew) {
      animateNumber(trendValueRef.current, 0, todayNew.value)
    }
  }, [value, todayNew])

  return (
    <div className={`kpi-card glass-card ${className}`} data-kpi={kpiType}>
      <div className="kpi-icon">
        <i className={icon}></i>
      </div>
      <div className="kpi-content">
        <div className="kpi-value">
          <span className="number" ref={numberRef}>0</span>
          <span className="unit">{unit}</span>
        </div>
        <div className="kpi-label">{label}</div>
        {todayNew && (
          <div className="kpi-trend positive">
            <span>今日新增：</span>
            <span className="trend-value" ref={trendValueRef}>0</span>
            <span className="trend-unit">{todayNew.unit}</span>
          </div>
        )}
        {progress !== undefined && (
          <div className="kpi-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KPICard