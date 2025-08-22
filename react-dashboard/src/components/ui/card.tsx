import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

/**
 * Card组件的样式变体配置
 */
const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-border bg-white',
        glass: 'glass-card border-white/20',
        gradient: 'bg-gradient-to-br from-white to-gray-50 border-gray-200',
        elevated: 'shadow-lg border-gray-200 bg-white',
        outline: 'border-2 border-primary-200 bg-primary-50/50',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

/**
 * Card组件属性接口
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** 是否可悬停 */
  hoverable?: boolean
  /** 是否可点击 */
  clickable?: boolean
}

/**
 * Card组件
 * 
 * 用于展示内容的卡片容器组件
 * 
 * @example
 * ```tsx
 * <Card variant="default" size="default">
 *   <CardHeader>
 *     <CardTitle>标题</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     内容
 *   </CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hoverable, clickable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size }),
        hoverable && 'transition-all duration-200 hover:shadow-md hover:-translate-y-1',
        clickable && 'cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

/**
 * CardHeader组件属性接口
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardHeader组件
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

/**
 * CardTitle组件属性接口
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 标题级别 */
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * CardTitle组件
 */
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = 3, children, ...props }, ref) => {
    const headingProps = {
      ref: ref as any,
      className: cn(
        'font-semibold leading-none tracking-tight',
        level === 1 && 'text-4xl',
        level === 2 && 'text-3xl',
        level === 3 && 'text-2xl',
        level === 4 && 'text-xl',
        level === 5 && 'text-lg',
        level === 6 && 'text-base',
        className
      ),
      ...props,
    }

    switch (level) {
      case 1:
        return <h1 {...headingProps}>{children}</h1>
      case 2:
        return <h2 {...headingProps}>{children}</h2>
      case 3:
        return <h3 {...headingProps}>{children}</h3>
      case 4:
        return <h4 {...headingProps}>{children}</h4>
      case 5:
        return <h5 {...headingProps}>{children}</h5>
      case 6:
        return <h6 {...headingProps}>{children}</h6>
      default:
        return <h3 {...headingProps}>{children}</h3>
    }
  }
)
CardTitle.displayName = 'CardTitle'

/**
 * CardDescription组件属性接口
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * CardDescription组件
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

/**
 * CardContent组件属性接口
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardContent组件
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

/**
 * CardFooter组件属性接口
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardFooter组件
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

/**
 * 统计卡片组件
 */
export interface StatCardProps extends Omit<CardProps, 'children'> {
  /** 标题 */
  title: string
  /** 数值 */
  value: string | number
  /** 描述 */
  description?: string
  /** 图标 */
  icon?: React.ReactNode
  /** 趋势 */
  trend?: {
    value: number
    isPositive: boolean
  }
  /** 颜色主题 */
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'
}

/**
 * StatCard组件 - 统计数据展示卡片
 */
const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ 
    title, 
    value, 
    description, 
    icon, 
    trend, 
    color = 'blue',
    className,
    ...props 
  }, ref) => {
    const colorClasses = {
      blue: 'border-blue-200 bg-blue-50/50',
      green: 'border-green-200 bg-green-50/50',
      red: 'border-red-200 bg-red-50/50',
      yellow: 'border-yellow-200 bg-yellow-50/50',
      purple: 'border-purple-200 bg-purple-50/50',
      gray: 'border-gray-200 bg-gray-50/50',
    }

    const iconColorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      gray: 'text-gray-600',
    }

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-200 hover:shadow-md',
          colorClasses[color],
          className
        )}
        {...props}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {trend && (
                  <span
                    className={cn(
                      'text-sm font-medium',
                      trend.isPositive ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                )}
              </div>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
            {icon && (
              <div className={cn('flex-shrink-0 ml-4', iconColorClasses[color])}>
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
StatCard.displayName = 'StatCard'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  cardVariants,
}