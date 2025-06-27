'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Dashboard/Sidebar';
import Navbar from '@/components/Dashboard/Navbar';

export default function UserDashboard() {
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
    if (!loading && !authenticated) {
      router.push('/login');
    }
  }, [loading, authenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center liquid-glass">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

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
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Navbar user={user} onLogout={handleLogout} />
          <main className="flex-1 p-6 lg:p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.first_name || 'User'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Discover beautiful jewelry and manage your orders.
              </p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="liquid-glass-subtle rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="liquid-glass-subtle rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Wishlist</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                  </div>
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="liquid-glass-subtle rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cart Items</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="liquid-glass-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div>
                      <p className="font-medium">Diamond Ring</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order #12345</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Delivered</span>
                  </div>
                </div>
              </div>

              <div className="liquid-glass-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured Products</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div>
                      <p className="font-medium">Gold Necklace</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">$1,299</p>
                    </div>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full">View</button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
