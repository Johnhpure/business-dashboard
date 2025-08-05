import React from 'react';
import { Header } from './Header';
import { BackgroundAnimation } from '../common/BackgroundAnimation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* 动态背景 */}
      <BackgroundAnimation />
      
      {/* 主容器 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 顶部导航栏 */}
        <Header />
        
        {/* 主内容区域 */}
        <main className="flex-1 p-4 pt-6">
          <div className="flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};