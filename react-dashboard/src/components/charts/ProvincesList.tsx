
interface ProvinceData {
  name: string
  value: number
}

interface ProvincesListProps {
  data: ProvinceData[]
  activeProvince?: string
  onProvinceClick?: (provinceName: string) => void
  className?: string
}

/**
 * 省份列表组件
 * 完全匹配HTML版本的省份数据展示
 */
const ProvincesList: React.FC<ProvincesListProps> = ({
  data,
  activeProvince,
  onProvinceClick,
  className = ''
}) => {
  return (
    <div className={`provinces-summary ${className}`}>
      {data.map((province, index) => (
        <div
          key={province.name}
          className={`summary-item ${activeProvince === province.name ? 'active' : ''}`}
          data-province={province.name}
          onClick={() => onProvinceClick?.(province.name)}
        >
          <span className="label">{province.name}</span>
          <span className="value">¥{(province.value / 10000).toFixed(0)}万</span>
        </div>
      ))}
    </div>
  )
}

export default ProvincesList