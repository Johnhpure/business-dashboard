import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface ProvinceData {
  name: string
  value: number
}

interface ChinaMapChartProps {
  data: ProvinceData[]
  onProvinceClick?: (provinceName: string) => void
  className?: string
}

/**
 * 中国地图图表组件
 * 完全匹配HTML版本的地图可视化效果
 */
const ChinaMapChart: React.FC<ChinaMapChartProps> = ({
  data,
  onProvinceClick,
  className = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // 初始化图表
    chartInstance.current = echarts.init(chartRef.current)

    // 配置饼图选项 - 匹配HTML版本的配置
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(0, 212, 255, 0.5)',
        textStyle: { color: '#ffffff' },
        formatter: function (params: any) {
          // 根据数据动态生成 tooltip 内容
          return `${params.name}<br/>业绩流水: ¥${params.value.toLocaleString()}<br/>占比: ${params.percent}%`
        }
      },
      series: [{
        name: '全国业绩流水',
        type: 'pie',
        radius: ['10%', '85%'],
        center: ['50%', '50%'],
        data: data.slice(0, 10), // 只显示前10名
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.2)',
          borderWidth: 1
        },
        label: {
          show: true,
          position: 'outside',
          formatter: function (params: any) {
            // 根据数值大小，决定是否显示业绩流水，优化标签显示
            if (params.value >= 500000) {
              return `${params.name}\n¥${(params.value / 10000).toFixed(0)}万`
            } else if (params.value >= 200000) {
              return `${params.name}\n${(params.value / 10000).toFixed(0)}万`
            } else {
              return params.name
            }
          },
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 600,
          distanceToLabelLine: 8
        },
        labelLine: {
          show: true,
          length: 25,
          length2: 15,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.7)',
            width: 1.5
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 212, 255, 0.5)'
          }
        }
      }],
      color: [
        '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
        '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
        '#ff9a9e', '#fecfef', '#ffecd2', '#fcb69f', '#667eea', '#764ba2',
        '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
        '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3', '#ff9a9e', '#fecfef',
        '#667eea', '#764ba2', '#f093fb', '#f5576c'
      ]
    }

    chartInstance.current.setOption(option)

    // 添加点击事件
    chartInstance.current.on('click', (params: any) => {
      if (onProvinceClick) {
        onProvinceClick(params.name)
      }
    })

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
    }
  }, [data, onProvinceClick])

  return (
    <div 
      ref={chartRef} 
      className={`w-full h-full min-h-[300px] ${className}`}
    />
  )
}

export default ChinaMapChart