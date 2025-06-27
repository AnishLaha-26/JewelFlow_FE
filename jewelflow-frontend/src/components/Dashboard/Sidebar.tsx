'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactElement;
  submenu?: { name: string; href: string }[];
}

const adminNavigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z" />
      </svg>
    ),
  },
  {
    name: 'Inventory',
    href: '/admin/inventory',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    submenu: [
      { name: 'All Items', href: '/admin/inventory' },
      { name: 'Add Item', href: '/admin/inventory/add' },
      { name: 'Categories', href: '/admin/inventory/categories' },
    ],
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    submenu: [
      { name: 'All Orders', href: '/admin/orders' },
      { name: 'Pending', href: '/admin/orders/pending' },
      { name: 'Completed', href: '/admin/orders/completed' },
    ],
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
  {
    name: 'Master Data',
    href: '/admin/master-data',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    submenu: [
      { name: 'Product Categories', href: '/admin/master-data/product-categories' },
      { name: 'Base Metals', href: '/admin/master-data/base-metals' },
      { name: 'Vendors', href: '/admin/master-data/vendors' },
      { name: 'Stone Shapes', href: '/admin/master-data/stone-shapes' },
      { name: 'Stone Sizes', href: '/admin/master-data/stone-sizes' },
      { name: 'Stone Qualities', href: '/admin/master-data/stone-qualities' },
      { name: 'Shape-Size Mapping', href: '/admin/master-data/shape-size-mapping' },
      { name: 'Plating Colors', href: '/admin/master-data/plating-colors' },
    ],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const userNavigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/user/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z" />
      </svg>
    ),
  },
  {
    name: 'Browse Jewelry',
    href: '/user/browse',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    name: 'My Orders',
    href: '/user/orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    name: 'Wishlist',
    href: '/user/wishlist',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    name: 'Cart',
    href: '/user/cart',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
    ),
  },
  {
    name: 'Profile',
    href: '/user/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const Sidebar = ({ className = '', collapsed = false, onToggleCollapse }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { user } = useAuth();

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name?.charAt(0) || '';
    const lastName = user.last_name?.charAt(0) || '';
    return `${firstName}${lastName}`.toUpperCase() || 'U';
  };

  const navigationItems = user?.role === 'admin' ? adminNavigationItems : userNavigationItems;
  const dashboardUrl = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  // Function to check if a submenu should be open
  const shouldSubmenuBeOpen = (item: NavigationItem) => {
    // If manually opened/closed, respect that state
    if (openSubmenu === item.name) return true;
    if (openSubmenu === null) {
      // Auto-open if current path matches any submenu item
      return item.submenu?.some(subItem => pathname.startsWith(subItem.href)) || false;
    }
    return false;
  };

  return (
    <div className={`${className} ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 liquid-glass-subtle flex flex-col h-screen fixed left-0 top-0 z-40`}>
      <div className="px-4 py-4 h-[73px] flex items-center justify-between">
        <Link href={dashboardUrl} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Image 
            src="/logo.png" 
            alt="JewelFlow Logo" 
            width={32} 
            height={32} 
            className="rounded-2xl shadow-lg" 
          />
          {!isCollapsed && <span className="text-xl font-bold gradient-text">JewelFlow</span>}
        </Link>
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            onToggleCollapse?.(!isCollapsed);
          }}
          className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400 transition-colors"
        >
          {isCollapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto border-t border-white/10 dark:border-gray-700/30">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isSubmenuOpen = shouldSubmenuBeOpen(item);
            const hasActiveSubItem = item.submenu?.some(subItem => pathname === subItem.href) || false;
            
            return (
              <li key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                        pathname.startsWith(item.href) || hasActiveSubItem
                          ? 'bg-white/20 dark:bg-gray-800/40 text-blue-600 dark:text-blue-400 shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                        {!isCollapsed && <span>{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isSubmenuOpen ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    {!isCollapsed && isSubmenuOpen && (
                      <ul className="mt-1 ml-10 space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                pathname === subItem.href
                                  ? 'bg-white/20 dark:bg-gray-800/40 text-blue-600 dark:text-blue-400 shadow-lg'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-800/30'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-white/20 dark:bg-gray-800/40 text-blue-600 dark:text-blue-400 shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30'
                    }`}
                  >
                    <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className={`p-4 border-t border-white/20 dark:border-gray-700/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {getUserInitials()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role || 'user'}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => {
                // Handle logout
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  localStorage.removeItem('userData');
                  window.location.href = '/login';
                }
              }}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
