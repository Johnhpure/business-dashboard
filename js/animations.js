// 动画管理模块
export class AnimationManager {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.observers = new Map();
    }

    init() {
        this.setupIntersectionObserver();
        console.log('AnimationManager initialized');
    }

    setupIntersectionObserver() {
        // 创建交叉观察器，用于元素进入视口时触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animation;
                    
                    if (animationType) {
                        this.triggerAnimation(element, animationType);
                        observer.unobserve(element); // 只触发一次
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // 观察所有带有动画属性的元素
        document.querySelectorAll('[data-animation]').forEach(element => {
            observer.observe(element);
        });

        this.observers.set('intersection', observer);
    }

    startPageAnimations() {
        // 页面加载时的入场动画
        this.animatePageEntry();
        
        // 启动数字动画
        this.startNumberAnimations();
        
        // 启动卡片动画
        this.startCardAnimations();
    }

    animatePageEntry() {
        // 头部导航动画
        const header = document.querySelector('.dashboard-header');
        if (header) {
            header.classList.add('slide-in-up');
        }

        // 筛选面板动画
        const filterPanel = document.querySelector('.filter-panel');
        if (filterPanel) {
            filterPanel.classList.add('slide-in-left', 'delay-200');
        }

        // 主内容区域动画
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.classList.add('fade-in', 'delay-300');
        }
    }

    startNumberAnimations() {
        // 为所有数字元素添加动画
        const numberElements = document.querySelectorAll('.number[data-target]');
        
        numberElements.forEach((element, index) => {
            setTimeout(() => {
                const target = parseInt(element.dataset.target);
                this.animateNumber(element, 0, target, 2000);
            }, index * 200);
        });
    }

    startCardAnimations() {
        // KPI卡片动画
        const kpiCards = document.querySelectorAll('.kpi-card');
        kpiCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('slide-in-up');
        });

        // 图表容器动画
        const chartContainers = document.querySelectorAll('.chart-container, .map-container');
        chartContainers.forEach((container, index) => {
            container.style.animationDelay = `${0.5 + index * 0.2}s`;
            container.classList.add('scale-in');
        });

        // 排行榜动画
        const rankingCards = document.querySelectorAll('.ranking-card');
        rankingCards.forEach((card, index) => {
            card.style.animationDelay = `${1 + index * 0.3}s`;
            card.classList.add('slide-in-right');
        });
    }

    animateNumber(element, start, end, duration = 2000, easing = 'easeOutCubic') {
        if (!element) return;

        const startTime = performance.now();
        const difference = end - start;

        const easingFunctions = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };

        const easingFunction = easingFunctions[easing] || easingFunctions.easeOutCubic;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFunction(progress);
            
            const currentValue = Math.floor(start + difference * easedProgress);
            element.textContent = this.formatNumber(currentValue);
            
            // 添加数字更新效果
            element.classList.add('number-animate');
            setTimeout(() => element.classList.remove('number-animate'), 100);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = this.formatNumber(end);
                element.classList.add('bounce');
                setTimeout(() => element.classList.remove('bounce'), 1000);
            }
        };

        requestAnimationFrame(animate);
    }

    formatNumber(num) {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + 'w';
        }
        return num.toLocaleString();
    }

    triggerAnimation(element, animationType) {
        switch (animationType) {
            case 'fadeIn':
                element.classList.add('fade-in');
                break;
            case 'slideInUp':
                element.classList.add('slide-in-up');
                break;
            case 'slideInLeft':
                element.classList.add('slide-in-left');
                break;
            case 'slideInRight':
                element.classList.add('slide-in-right');
                break;
            case 'scaleIn':
                element.classList.add('scale-in');
                break;
            case 'bounce':
                element.classList.add('bounce');
                break;
            default:
                element.classList.add('fade-in');
        }
    }

    // 进度条动画
    animateProgress(element, targetPercent, duration = 1500) {
        if (!element) return;

        const progressFill = element.querySelector('.progress-fill');
        if (!progressFill) return;

        progressFill.style.transition = `width ${duration}ms ease-out`;
        progressFill.style.width = `${targetPercent}%`;

        // 添加光晕效果
        progressFill.classList.add('glow');
        setTimeout(() => progressFill.classList.remove('glow'), duration);
    }

    // 圆形进度动画
    animateCircularProgress(element, targetPercent, duration = 2000) {
        if (!element) return;

        const circle = element.querySelector('.progress-ring-progress');
        const text = element.querySelector('.progress-text');
        
        if (!circle || !text) return;

        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeOutCubic(progress);
            
            const currentPercent = targetPercent * easedProgress;
            const offset = circumference - (currentPercent / 100) * circumference;
            
            circle.style.strokeDashoffset = offset;
            text.textContent = `${Math.floor(currentPercent)}%`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return (--t) * t * t + 1;
    }

    // 排行榜项目动画
    animateRankingItems(container, items, delay = 100) {
        if (!container || !items) return;

        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('slide-in-left');
                
                // 添加排名数字的特殊动画
                const rankNumber = item.querySelector('.ranking-number');
                if (rankNumber && index < 3) {
                    setTimeout(() => {
                        rankNumber.classList.add('bounce');
                    }, 300);
                }
            }, index * delay);
        });
    }

    // 卡片悬停效果
    addCardHoverEffects() {
        const cards = document.querySelectorAll('.glass-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover-float');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover-float');
            });
        });
    }

    // 按钮点击波纹效果
    addRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // 数据更新闪烁效果
    highlightDataUpdate(element) {
        if (!element) return;
        
        element.classList.add('data-updated');
        setTimeout(() => {
            element.classList.remove('data-updated');
        }, 600);
    }

    // 通知动画
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // 设置样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-out',
            background: this.getNotificationColor(type),
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        });
        
        document.body.appendChild(notification);
        
        // 入场动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
        };
        return colors[type] || colors.info;
    }

    // 加载动画
    showLoading(container, text = '加载中...') {
        if (!container) return;
        
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${text}</div>
            </div>
        `;
        
        Object.assign(loading.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000',
            backdropFilter: 'blur(2px)'
        });
        
        container.style.position = 'relative';
        container.appendChild(loading);
        
        return loading;
    }

    hideLoading(loading) {
        if (loading && loading.parentNode) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.remove();
            }, 300);
        }
    }

    // 粒子效果
    createParticleEffect(container, count = 20) {
        if (!container) return;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-effect';
            
            Object.assign(particle.style, {
                position: 'absolute',
                width: '2px',
                height: '2px',
                background: '#00d4ff',
                borderRadius: '50%',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `particle-float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: Math.random() * 2 + 's',
                opacity: '0.6'
            });
            
            container.appendChild(particle);
            
            // 自动清理
            setTimeout(() => {
                particle.remove();
            }, 8000);
        }
    }

    // 销毁动画管理器
    destroy() {
        // 清理观察器
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // 清理动画队列
        this.animationQueue = [];
        
        console.log('AnimationManager destroyed');
    }
}

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        color: #ffffff;
    }
    
    .loading-text {
        font-size: 14px;
        color: #b8c5d6;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;
document.head.appendChild(style);