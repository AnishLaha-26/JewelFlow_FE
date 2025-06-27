'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Dashboard/Sidebar';
import Navbar from '@/components/Dashboard/Navbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { user, loading, authenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleLogout = () => {
    // Clear tokens and redirect to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    router.push('/login');
  };
  
  useEffect(() => {
    if (!loading) {
      if (!authenticated) {
        router.push('/login');
        return;
      }
      
      // Check if user has admin role
      if (user?.role !== 'admin') {
        // Redirect non-admin users to user dashboard
        router.push('/user/dashboard');
        return;
      }
    }
  }, [loading, authenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center liquid-glass">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || user?.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/50" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-purple-300/40 dark:from-blue-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 right-10 w-96 h-96 bg-gradient-to-r from-purple-200/40 to-blue-300/40 dark:from-purple-600/20 dark:to-pink-600/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/30 to-purple-100/30 dark:from-blue-700/10 dark:to-purple-700/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={setSidebarCollapsed}
        />
        <div className={`flex-1 flex flex-col transition-all duration-300`}>
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            <Navbar user={user} onLogout={handleLogout} />
          </div>
          <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
