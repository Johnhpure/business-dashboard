/**
 * 数据验证工具函数
 */

/**
 * 验证邮箱格式
 * @param email - 邮箱地址
 * @returns 是否为有效邮箱
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式（中国大陆）
 * @param phone - 手机号
 * @returns 是否为有效手机号
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证身份证号格式（中国大陆）
 * @param idCard - 身份证号
 * @returns 是否为有效身份证号
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return idCardRegex.test(idCard)
}

/**
 * 验证密码强度
 * @param password - 密码
 * @returns 密码强度等级 (weak, medium, strong)
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 6) return 'weak'
  
  let score = 0
  
  // 长度检查
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  
  // 字符类型检查
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  
  if (score < 3) return 'weak'
  if (score < 5) return 'medium'
  return 'strong'
}

/**
 * 验证URL格式
 * @param url - URL地址
 * @returns 是否为有效URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证IP地址格式
 * @param ip - IP地址
 * @returns 是否为有效IP地址
 */
export function isValidIP(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipRegex.test(ip)
}

/**
 * 验证数字范围
 * @param value - 数值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 是否在范围内
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * 验证字符串长度
 * @param str - 字符串
 * @param min - 最小长度
 * @param max - 最大长度
 * @returns 是否在长度范围内
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max
}

/**
 * 验证是否只包含字母
 * @param str - 字符串
 * @returns 是否只包含字母
 */
export function isAlpha(str: string): boolean {
  return /^[A-Za-z]+$/.test(str)
}

/**
 * 验证是否只包含数字
 * @param str - 字符串
 * @returns 是否只包含数字
 */
export function isNumeric(str: string): boolean {
  return /^[0-9]+$/.test(str)
}

/**
 * 验证是否只包含字母和数字
 * @param str - 字符串
 * @returns 是否只包含字母和数字
 */
export function isAlphaNumeric(str: string): boolean {
  return /^[A-Za-z0-9]+$/.test(str)
}

/**
 * 验证日期格式 (YYYY-MM-DD)
 * @param date - 日期字符串
 * @returns 是否为有效日期格式
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false
  
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

/**
 * 验证时间格式 (HH:MM 或 HH:MM:SS)
 * @param time - 时间字符串
 * @returns 是否为有效时间格式
 */
export function isValidTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  return timeRegex.test(time)
}

/**
 * 验证颜色值格式 (hex)
 * @param color - 颜色值
 * @returns 是否为有效颜色值
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(color)
}

/**
 * 验证JSON格式
 * @param str - JSON字符串
 * @returns 是否为有效JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * 验证银行卡号格式
 * @param cardNumber - 银行卡号
 * @returns 是否为有效银行卡号
 */
export function isValidBankCard(cardNumber: string): boolean {
  // 移除空格和连字符
  const cleanNumber = cardNumber.replace(/[\s-]/g, '')
  
  // 检查长度（通常为13-19位）
  if (!/^\d{13,19}$/.test(cleanNumber)) return false
  
  // Luhn算法验证
  let sum = 0
  let isEven = false
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10)
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * 验证中文字符
 * @param str - 字符串
 * @returns 是否只包含中文字符
 */
export function isChinese(str: string): boolean {
  return /^[\u4e00-\u9fa5]+$/.test(str)
}

/**
 * 验证是否包含中文字符
 * @param str - 字符串
 * @returns 是否包含中文字符
 */
export function containsChinese(str: string): boolean {
  return /[\u4e00-\u9fa5]/.test(str)
}

/**
 * 验证文件类型
 * @param filename - 文件名
 * @param allowedTypes - 允许的文件类型数组
 * @returns 是否为允许的文件类型
 */
export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? allowedTypes.includes(extension) : false
}

/**
 * 验证文件大小
 * @param fileSize - 文件大小（字节）
 * @param maxSize - 最大允许大小（字节）
 * @returns 是否在允许的大小范围内
 */
export function isValidFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize <= maxSize
}

/**
 * 综合表单验证器
 */
export class FormValidator {
  private errors: Record<string, string[]> = {}

  /**
   * 添加验证规则
   * @param field - 字段名
   * @param value - 字段值
   * @param rules - 验证规则
   */
  validate(field: string, value: any, rules: ValidationRule[]): this {
    this.errors[field] = []

    for (const rule of rules) {
      if (!rule.validator(value)) {
        this.errors[field].push(rule.message)
      }
    }

    if (this.errors[field].length === 0) {
      delete this.errors[field]
    }

    return this
  }

  /**
   * 获取验证错误
   * @returns 错误对象
   */
  getErrors(): Record<string, string[]> {
    return this.errors
  }

  /**
   * 检查是否有错误
   * @returns 是否有错误
   */
  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0
  }

  /**
   * 清除所有错误
   */
  clearErrors(): this {
    this.errors = {}
    return this
  }

  /**
   * 清除指定字段的错误
   * @param field - 字段名
   */
  clearFieldErrors(field: string): this {
    delete this.errors[field]
    return this
  }
}

/**
 * 验证规则接口
 */
export interface ValidationRule {
  validator: (value: any) => boolean
  message: string
}

/**
 * 常用验证规则
 */
export const ValidationRules = {
  required: (message: string = '此字段为必填项'): ValidationRule => ({
    validator: (value: any) => value !== null && value !== undefined && value !== '',
    message,
  }),

  email: (message: string = '请输入有效的邮箱地址'): ValidationRule => ({
    validator: (value: string) => !value || isValidEmail(value),
    message,
  }),

  phone: (message: string = '请输入有效的手机号'): ValidationRule => ({
    validator: (value: string) => !value || isValidPhone(value),
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value: string) => !value || value.length >= min,
    message: message || `最少需要${min}个字符`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value: string) => !value || value.length <= max,
    message: message || `最多允许${max}个字符`,
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validator: (value: number) => value == null || value >= min,
    message: message || `最小值为${min}`,
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validator: (value: number) => value == null || value <= max,
    message: message || `最大值为${max}`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validator: (value: string) => !value || regex.test(value),
    message,
  }),
}