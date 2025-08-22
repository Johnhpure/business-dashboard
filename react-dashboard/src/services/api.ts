/**
 * API客户端服务
 */

import type { ApiResponse, PaginatedResponse, FilterOptions, PaginationOptions } from '@/types'

/**
 * API配置
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  retries: 3,
}

/**
 * HTTP错误类
 */
export class HttpError extends Error {
  status: number
  statusText: string
  
  constructor(
    status: number,
    statusText: string,
    message?: string
  ) {
    super(message || `HTTP ${status}: ${statusText}`)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
  }
}

/**
 * API错误类
 */
export class ApiError extends Error {
  code: string
  details?: any
  
  constructor(
    code: string,
    message: string,
    details?: any
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }
}

/**
 * 请求配置接口
 */
interface RequestConfig extends RequestInit {
  timeout?: number
  retries?: number
  params?: Record<string, any>
}

/**
 * API客户端类
 */
class ApiClient {
  private baseURL: string
  private defaultTimeout: number
  private defaultRetries: number

  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL
    this.defaultTimeout = config.timeout
    this.defaultRetries = config.retries
  }

  /**
   * 构建URL
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)))
          } else {
            url.searchParams.set(key, String(value))
          }
        }
      })
    }
    
    return url.toString()
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new HttpError(response.status, response.statusText)
    }

    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      
      // 检查API响应格式
      if (data && typeof data === 'object' && 'success' in data) {
        const apiResponse = data as ApiResponse<T>
        
        if (!apiResponse.success) {
          throw new ApiError(
            'API_ERROR',
            apiResponse.error || 'Unknown API error',
            apiResponse
          )
        }
        
        return apiResponse.data
      }
      
      return data
    }
    
    return response.text() as T
  }

  /**
   * 带重试的请求
   */
  private async requestWithRetry<T>(
    url: string,
    config: RequestConfig,
    retries: number = this.defaultRetries
  ): Promise<T> {
    try {
      const controller = new AbortController()
      const timeout = config.timeout || this.defaultTimeout
      
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      return await this.handleResponse<T>(response)
    } catch (error) {
      if (retries > 0 && !(error instanceof ApiError)) {
        console.warn(`Request failed, retrying... (${retries} attempts left)`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return this.requestWithRetry<T>(url, config, retries - 1)
      }
      
      throw error
    }
  }

  /**
   * GET请求
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config
    const url = this.buildURL(endpoint, params)
    
    return this.requestWithRetry<T>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
      ...requestConfig,
    })
  }

  /**
   * POST请求
   */
  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config
    const url = this.buildURL(endpoint, params)
    
    return this.requestWithRetry<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
      body: data ? JSON.stringify(data) : null,
      ...requestConfig,
    })
  }

  /**
   * PUT请求
   */
  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config
    const url = this.buildURL(endpoint, params)
    
    return this.requestWithRetry<T>(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
      body: data ? JSON.stringify(data) : null,
      ...requestConfig,
    })
  }

  /**
   * DELETE请求
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config
    const url = this.buildURL(endpoint, params)
    
    return this.requestWithRetry<T>(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
      ...requestConfig,
    })
  }

  /**
   * 分页请求
   */
  async getPaginated<T>(
    endpoint: string,
    pagination: PaginationOptions,
    filters?: FilterOptions,
    config: RequestConfig = {}
  ): Promise<PaginatedResponse<T>> {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }
    
    return this.get<PaginatedResponse<T>>(endpoint, { ...config, params })
  }

  /**
   * 上传文件
   */
  async upload<T>(
    endpoint: string,
    file: File,
    config: RequestConfig = {}
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    const { params, ...requestConfig } = config
    const url = this.buildURL(endpoint, params)
    
    return this.requestWithRetry<T>(url, {
      method: 'POST',
      body: formData,
      ...requestConfig,
    })
  }

  /**
   * 下载文件
   */
  async download(
    endpoint: string,
    filename?: string,
    config: RequestConfig = {}
  ): Promise<void> {
    const { params, ...requestConfig } = config
    const url = this.buildURL(endpoint, params)
    
    const response = await fetch(url, {
      method: 'GET',
      ...requestConfig,
    })
    
    if (!response.ok) {
      throw new HttpError(response.status, response.statusText)
    }
    
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(downloadUrl)
  }
}

/**
 * 默认API客户端实例
 */
export const apiClient = new ApiClient(API_CONFIG)

/**
 * 请求拦截器
 */
export const requestInterceptors = {
  /**
   * 添加认证头
   */
  addAuthHeader: (token: string) => {
    const originalGet = apiClient.get.bind(apiClient)
    const originalPost = apiClient.post.bind(apiClient)
    const originalPut = apiClient.put.bind(apiClient)
    const originalDelete = apiClient.delete.bind(apiClient)
    
    apiClient.get = (endpoint, config = {}) => {
      return originalGet(endpoint, {
        ...config,
        headers: {
          Authorization: `Bearer ${token}`,
          ...config.headers,
        },
      })
    }
    
    apiClient.post = (endpoint, data, config = {}) => {
      return originalPost(endpoint, data, {
        ...config,
        headers: {
          Authorization: `Bearer ${token}`,
          ...config.headers,
        },
      })
    }
    
    apiClient.put = (endpoint, data, config = {}) => {
      return originalPut(endpoint, data, {
        ...config,
        headers: {
          Authorization: `Bearer ${token}`,
          ...config.headers,
        },
      })
    }
    
    apiClient.delete = (endpoint, config = {}) => {
      return originalDelete(endpoint, {
        ...config,
        headers: {
          Authorization: `Bearer ${token}`,
          ...config.headers,
        },
      })
    }
  },
}

/**
 * 响应拦截器
 */
export const responseInterceptors = {
  /**
   * 日志记录
   */
  logger: (response: any, request: { method: string; url: string }) => {
    console.log(`[API] ${request.method} ${request.url}`, response)
  },
  
  /**
   * 错误处理
   */
  errorHandler: (error: Error) => {
    console.error('[API Error]', error)
    
    if (error instanceof HttpError) {
      switch (error.status) {
        case 401:
          // 处理未授权
          console.warn('Unauthorized access, redirecting to login...')
          break
        case 403:
          // 处理禁止访问
          console.warn('Access forbidden')
          break
        case 404:
          // 处理资源未找到
          console.warn('Resource not found')
          break
        case 500:
          // 处理服务器错误
          console.error('Internal server error')
          break
      }
    }
    
    throw error
  },
}

export { ApiClient }