import { useState } from 'react'
import ChinaMapChart from './ChinaMapChart'
import ProvincesList from './ProvincesList'

interface MapContainerProps {
  className?: string
}

/**
 * 地图容器组件
 * 完全匹配HTML版本的全国业绩流水概览
 */
const MapContainer: React.FC<MapContainerProps> = ({ className = '' }) => {
  const [activeProvince, setActiveProvince] = useState<string>('')
  const [mapType, setMapType] = useState<'revenue' | 'stores' | 'users'>('revenue')

  // 全国所有省份数据 - 匹配HTML版本的数据
  const allProvinceData = [
    { name: '广东省', value: 1248000 },
    { name: '江苏省', value: 1156000 },
    { name: '四川省', value: 1048000 },
    { name: '山东省', value: 986000 },
    { name: '浙江省', value: 892000 },
    { name: '河南省', value: 735000 },
    { name: '湖北省', value: 680000 },
    { name: '福建省', value: 625000 },
    { name: '北京市', value: 580000 },
    { name: '湖南省', value: 542000 },
    { name: '安徽省', value: 498000 },
    { name: '上海市', value: 484000 },
    { name: '河北省', value: 456000 },
    { name: '陕西省', value: 425000 },
    { name: '江西省', value: 398000 },
    { name: '重庆市', value: 365000 },
    { name: '辽宁省', value: 342000 },
    { name: '广西壮族自治区', value: 318000 },
    { name: '云南省', value: 295000 },
    { name: '山西省', value: 276000 },
    { name: '贵州省', value: 258000 },
    { name: '天津市', value: 235000 },
    { name: '黑龙江省', value: 218000 },
    { name: '吉林省', value: 198000 },
    { name: '甘肃省', value: 185000 },
    { name: '内蒙古自治区', value: 168000 },
    { name: '新疆维吾尔自治区', value: 145000 },
    { name: '海南省', value: 128000 },
    { name: '宁夏回族自治区', value: 115000 },
    { name: '青海省', value: 98000 },
    { name: '西藏自治区', value: 85000 }
  ]

  const handleProvinceClick = (provinceName: string) => {
    setActiveProvince(provinceName)
  }

  const handleMapTypeChange = (type: 'revenue' | 'stores' | 'users') => {
    setMapType(type)
  }

  return (
    <div className={`map-container glass-card ${className}`}>
      <div className="card-header">
        <h3>
          <i className="fas fa-chart-pie"></i> 全国业绩流水概览（当日）
        </h3>
        <div className="card-controls">
          <button 
            className={`control-btn ${mapType === 'revenue' ? 'active' : ''}`}
            onClick={() => handleMapTypeChange('revenue')}
          >
            <i className="fas fa-dollar-sign"></i> 收入
          </button>
          <button 
            className={`control-btn ${mapType === 'stores' ? 'active' : ''}`}
            onClick={() => handleMapTypeChange('stores')}
          >
            <i className="fas fa-store"></i> 商户
          </button>
          <button 
            className={`control-btn ${mapType === 'users' ? 'active' : ''}`}
            onClick={() => handleMapTypeChange('users')}
          >
            <i className="fas fa-users"></i> 用户
          </button>
        </div>
      </div>
      
      <div className="national-overview-content">
        <div className="provinces-list">
          <ProvincesList
            data={allProvinceData}
            activeProvince={activeProvince}
            onProvinceClick={handleProvinceClick}
          />
        </div>
        
        <div className="overview-chart">
          <div className="map-chart">
            <ChinaMapChart
              data={allProvinceData}
              onProvinceClick={handleProvinceClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapContainer