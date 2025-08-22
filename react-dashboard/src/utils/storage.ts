/**
 * 本地存储工具函数
 */

/**
 * 本地存储键名枚举
 */
export const StorageKeys = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  DASHBOARD_LAYOUT: 'dashboard_layout',
  CHART_SETTINGS: 'chart_settings',
  FILTER_SETTINGS: 'filter_settings',
  USER_SESSION: 'user_session',
  CACHE_DATA: 'cache_data',
} as const

/**
 * 存储类型
 */
type StorageType = 'localStorage' | 'sessionStorage'

/**
 * 获取存储对象
 * @param type - 存储类型
 * @returns Storage对象
 */
function getStorage(type: StorageType): Storage {
  return type === 'localStorage' ? localStorage : sessionStorage
}

/**
 * 检查存储是否可用
 * @param type - 存储类型
 * @returns 是否可用
 */
function isStorageAvailable(type: StorageType): boolean {
  try {
    const storage = getStorage(type)
    const testKey = '__storage_test__'
    storage.setItem(testKey, 'test')
    storage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * 设置存储项
 * @param key - 键名
 * @param value - 值
 * @param type - 存储类型，默认为localStorage
 * @returns 是否设置成功
 */
export function setStorageItem<T>(
  key: string,
  value: T,
  type: StorageType = 'localStorage'
): boolean {
  if (!isStorageAvailable(type)) {
    console.warn(`${type} is not available`)
    return false
  }

  try {
    const storage = getStorage(type)
    const serializedValue = JSON.stringify({
      value,
      timestamp: Date.now(),
      type: typeof value,
    })
    storage.setItem(key, serializedValue)
    return true
  } catch (error) {
    console.error(`Error setting ${type} item:`, error)
    return false
  }
}

/**
 * 获取存储项
 * @param key - 键名
 * @param defaultValue - 默认值
 * @param type - 存储类型，默认为localStorage
 * @returns 存储的值或默认值
 */
export function getStorageItem<T>(
  key: string,
  defaultValue: T,
  type: StorageType = 'localStorage'
): T {
  if (!isStorageAvailable(type)) {
    return defaultValue
  }

  try {
    const storage = getStorage(type)
    const item = storage.getItem(key)
    
    if (!item) {
      return defaultValue
    }

    const parsed = JSON.parse(item)
    return parsed.value as T
  } catch (error) {
    console.error(`Error getting ${type} item:`, error)
    return defaultValue
  }
}

/**
 * 移除存储项
 * @param key - 键名
 * @param type - 存储类型，默认为localStorage
 * @returns 是否移除成功
 */
export function removeStorageItem(
  key: string,
  type: StorageType = 'localStorage'
): boolean {
  if (!isStorageAvailable(type)) {
    return false
  }

  try {
    const storage = getStorage(type)
    storage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing ${type} item:`, error)
    return false
  }
}

/**
 * 清空存储
 * @param type - 存储类型，默认为localStorage
 * @returns 是否清空成功
 */
export function clearStorage(type: StorageType = 'localStorage'): boolean {
  if (!isStorageAvailable(type)) {
    return false
  }

  try {
    const storage = getStorage(type)
    storage.clear()
    return true
  } catch (error) {
    console.error(`Error clearing ${type}:`, error)
    return false
  }
}

/**
 * 获取存储项的元数据
 * @param key - 键名
 * @param type - 存储类型，默认为localStorage
 * @returns 元数据或null
 */
export function getStorageItemMetadata(
  key: string,
  type: StorageType = 'localStorage'
): { timestamp: number; type: string } | null {
  if (!isStorageAvailable(type)) {
    return null
  }

  try {
    const storage = getStorage(type)
    const item = storage.getItem(key)
    
    if (!item) {
      return null
    }

    const parsed = JSON.parse(item)
    return {
      timestamp: parsed.timestamp,
      type: parsed.type,
    }
  } catch (error) {
    console.error(`Error getting ${type} item metadata:`, error)
    return null
  }
}

/**
 * 检查存储项是否存在
 * @param key - 键名
 * @param type - 存储类型，默认为localStorage
 * @returns 是否存在
 */
export function hasStorageItem(
  key: string,
  type: StorageType = 'localStorage'
): boolean {
  if (!isStorageAvailable(type)) {
    return false
  }

  try {
    const storage = getStorage(type)
    return storage.getItem(key) !== null
  } catch {
    return false
  }
}

/**
 * 获取存储大小（近似值）
 * @param type - 存储类型，默认为localStorage
 * @returns 存储大小（字节）
 */
export function getStorageSize(type: StorageType = 'localStorage'): number {
  if (!isStorageAvailable(type)) {
    return 0
  }

  try {
    const storage = getStorage(type)
    let size = 0
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key) {
        const value = storage.getItem(key)
        if (value) {
          size += key.length + value.length
        }
      }
    }
    
    return size
  } catch {
    return 0
  }
}

/**
 * 获取所有存储键名
 * @param type - 存储类型，默认为localStorage
 * @returns 键名数组
 */
export function getStorageKeys(type: StorageType = 'localStorage'): string[] {
  if (!isStorageAvailable(type)) {
    return []
  }

  try {
    const storage = getStorage(type)
    const keys: string[] = []
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key) {
        keys.push(key)
      }
    }
    
    return keys
  } catch {
    return []
  }
}

/**
 * 带过期时间的存储
 */
export class ExpiringStorage {
  private type: StorageType

  constructor(type: StorageType = 'localStorage') {
    this.type = type
  }

  /**
   * 设置带过期时间的存储项
   * @param key - 键名
   * @param value - 值
   * @param expirationMs - 过期时间（毫秒）
   * @returns 是否设置成功
   */
  setItem<T>(key: string, value: T, expirationMs: number): boolean {
    const expirationTime = Date.now() + expirationMs
    const item = {
      value,
      expiration: expirationTime,
      timestamp: Date.now(),
    }
    
    return setStorageItem(key, item, this.type)
  }

  /**
   * 获取存储项（自动检查过期）
   * @param key - 键名
   * @param defaultValue - 默认值
   * @returns 存储的值或默认值
   */
  getItem<T>(key: string, defaultValue: T): T {
    const item = getStorageItem<any>(key, null, this.type)
    
    if (!item || !item.expiration) {
      return defaultValue
    }

    if (Date.now() > item.expiration) {
      this.removeItem(key)
      return defaultValue
    }

    return item.value as T
  }

  /**
   * 移除存储项
   * @param key - 键名
   * @returns 是否移除成功
   */
  removeItem(key: string): boolean {
    return removeStorageItem(key, this.type)
  }

  /**
   * 清理过期项
   * @returns 清理的项目数量
   */
  cleanExpired(): number {
    const keys = getStorageKeys(this.type)
    let cleanedCount = 0

    for (const key of keys) {
      const item = getStorageItem<any>(key, null, this.type)
      if (item && item.expiration && Date.now() > item.expiration) {
        this.removeItem(key)
        cleanedCount++
      }
    }

    return cleanedCount
  }
}

/**
 * 缓存管理器
 */
export class CacheManager {
  private storage: ExpiringStorage
  private defaultTTL: number

  constructor(type: StorageType = 'localStorage', defaultTTL: number = 3600000) { // 默认1小时
    this.storage = new ExpiringStorage(type)
    this.defaultTTL = defaultTTL
  }

  /**
   * 设置缓存
   * @param key - 键名
   * @param value - 值
   * @param ttl - 生存时间（毫秒），默认使用defaultTTL
   * @returns 是否设置成功
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.storage.setItem(key, value, ttl || this.defaultTTL)
  }

  /**
   * 获取缓存
   * @param key - 键名
   * @param defaultValue - 默认值
   * @returns 缓存的值或默认值
   */
  get<T>(key: string, defaultValue: T): T {
    return this.storage.getItem(key, defaultValue)
  }

  /**
   * 移除缓存
   * @param key - 键名
   * @returns 是否移除成功
   */
  remove(key: string): boolean {
    return this.storage.removeItem(key)
  }

  /**
   * 清理过期缓存
   * @returns 清理的项目数量
   */
  cleanup(): number {
    return this.storage.cleanExpired()
  }

  /**
   * 获取或设置缓存（如果不存在则执行获取函数）
   * @param key - 键名
   * @param getter - 获取数据的函数
   * @param ttl - 生存时间（毫秒）
   * @returns 缓存的值或新获取的值
   */
  async getOrSet<T>(
    key: string,
    getter: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T | null>(key, null)
    
    if (cached !== null) {
      return cached
    }

    const value = await getter()
    this.set(key, value, ttl)
    return value
  }
}

/**
 * 默认缓存管理器实例
 */
export const defaultCache = new CacheManager()

/**
 * 用户偏好设置管理
 */
export class UserPreferences {
  private static readonly PREFERENCES_KEY = StorageKeys.USER_PREFERENCES

  /**
   * 获取用户偏好设置
   * @returns 用户偏好设置对象
   */
  static get(): Record<string, any> {
    return getStorageItem(this.PREFERENCES_KEY, {})
  }

  /**
   * 设置用户偏好
   * @param preferences - 偏好设置对象
   * @returns 是否设置成功
   */
  static set(preferences: Record<string, any>): boolean {
    return setStorageItem(this.PREFERENCES_KEY, preferences)
  }

  /**
   * 获取特定偏好设置
   * @param key - 设置键名
   * @param defaultValue - 默认值
   * @returns 设置值或默认值
   */
  static getPreference<T>(key: string, defaultValue: T): T {
    const preferences = this.get()
    return preferences[key] !== undefined ? preferences[key] : defaultValue
  }

  /**
   * 设置特定偏好
   * @param key - 设置键名
   * @param value - 设置值
   * @returns 是否设置成功
   */
  static setPreference<T>(key: string, value: T): boolean {
    const preferences = this.get()
    preferences[key] = value
    return this.set(preferences)
  }

  /**
   * 移除特定偏好设置
   * @param key - 设置键名
   * @returns 是否移除成功
   */
  static removePreference(key: string): boolean {
    const preferences = this.get()
    delete preferences[key]
    return this.set(preferences)
  }

  /**
   * 清空所有偏好设置
   * @returns 是否清空成功
   */
  static clear(): boolean {
    return removeStorageItem(this.PREFERENCES_KEY)
  }
}