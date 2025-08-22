/**
 * 格式化工具函数集合
 */

/**
 * 格式化数字为货币格式
 * @param value - 数值
 * @param currency - 货币符号，默认为 '¥'
 * @param locale - 地区设置，默认为 'zh-CN'
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(
  value: number,
  currency: string = '¥',
  locale: string = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === '¥' ? 'CNY' : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * 格式化数字，添加千分位分隔符
 * @param value - 数值
 * @param locale - 地区设置，默认为 'zh-CN'
 * @returns 格式化后的数字字符串
 */
export function formatNumber(value: number, locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * 格式化百分比
 * @param value - 数值（0-1 之间）
 * @param decimals - 小数位数，默认为 1
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 格式化大数字，使用 K、M、B 等单位
 * @param value - 数值
 * @param decimals - 小数位数，默认为 1
 * @returns 格式化后的字符串
 */
export function formatCompactNumber(value: number, decimals: number = 1): string {
  const units = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ]

  for (const unit of units) {
    if (Math.abs(value) >= unit.value) {
      return `${(value / unit.value).toFixed(decimals)}${unit.symbol}`
    }
  }

  return value.toString()
}

/**
 * 格式化日期
 * @param date - 日期对象或字符串
 * @param format - 格式类型
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    },
  }

  return new Intl.DateTimeFormat('zh-CN', optionsMap[format]).format(dateObj)
}

/**
 * 格式化时间
 * @param date - 日期对象或字符串
 * @param includeSeconds - 是否包含秒，默认为 false
 * @returns 格式化后的时间字符串
 */
export function formatTime(
  date: Date | string,
  includeSeconds: boolean = false
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' }),
  }

  return new Intl.DateTimeFormat('zh-CN', options).format(dateObj)
}

/**
 * 格式化相对时间（如：2小时前）
 * @param date - 日期对象或字符串
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
  ]

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds)
    if (interval >= 1) {
      return new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' })
        .format(-interval, unit.name as Intl.RelativeTimeFormatUnit)
    }
  }

  return '刚刚'
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @param decimals - 小数位数，默认为 2
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * 截断文本并添加省略号
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @param suffix - 后缀，默认为 '...'
 * @returns 截断后的文本
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * 首字母大写
 * @param text - 原始文本
 * @returns 首字母大写的文本
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * 驼峰命名转换为短横线命名
 * @param text - 驼峰命名文本
 * @returns 短横线命名文本
 */
export function camelToKebab(text: string): string {
  return text.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 短横线命名转换为驼峰命名
 * @param text - 短横线命名文本
 * @returns 驼峰命名文本
 */
export function kebabToCamel(text: string): string {
  return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}