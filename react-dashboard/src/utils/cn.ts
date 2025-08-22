import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并和优化 Tailwind CSS 类名
 * 
 * @param inputs - 类名输入，支持字符串、对象、数组等多种格式
 * @returns 合并后的类名字符串
 * 
 * @example
 * ```ts
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 * cn('px-2 py-1', { 'bg-red-500': true, 'text-white': false }) // 'px-2 py-1 bg-red-500'
 * cn(['px-2', 'py-1'], 'px-4') // 'py-1 px-4'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}