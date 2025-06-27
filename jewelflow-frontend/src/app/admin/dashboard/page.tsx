'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Dashboard/Sidebar';
import Navbar from '@/components/Dashboard/Navbar';

export default function AdminDashboard() {
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
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
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
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Navbar user={user} onLogout={handleLogout} />
          <main className="flex-1 p-6 lg:p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Welcome back, {user?.first_name || 'Admin'}! Manage your jewelry business from here.
              </p>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Revenue */}
              <div className="liquid-glass-subtle rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$24,567</p>
                    <p className="text-sm text-green-600 dark:text-green-400">+12% from last month</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Inventory */}
              <div className="liquid-glass-subtle rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Inventory</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">1,847</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">156 items low stock</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Orders */}
              <div className="liquid-glass-subtle rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">342</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">23 pending review</p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Users */}
              <div className="liquid-glass-subtle rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">1,259</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">+8% new this month</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Orders Management */}
              <div className="liquid-glass-subtle rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">#12345 - Diamond Ring</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">John Smith - $2,500</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">#12344 - Gold Necklace</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Jane Doe - $1,800</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="liquid-glass-subtle rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h3>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    Manage Inventory
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Diamond Earrings</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Only 2 units left</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      Critical
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Silver Bracelets</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">5 units remaining</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                      Low
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Controls Section */}
            <div className="liquid-glass-subtle rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Admin Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </button>
                <button className="p-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Add User
                </button>
                <button className="p-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </button>
                <button className="p-4 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
