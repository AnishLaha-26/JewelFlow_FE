'use client';

import { useState } from 'react';
import Drawer from '@/components/UI/Drawer';

export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'boolean';
  renderCell?: (value: any, row: any) => React.ReactNode;
}

interface MasterDataLayoutProps {
  title: string;
  items: any[];
  columns: Column[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onBulkDelete?: (ids: (string | number)[]) => void;
  searchPlaceholder?: string;
  selectedIds?: (string | number)[];
  onRowSelect?: (id: string | number, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  isLoading?: boolean;
  isDrawerOpen?: boolean;
  onDrawerClose?: () => void;
  drawerTitle?: string;
  drawerContent?: React.ReactNode;
  children?: React.ReactNode;
}

export default function MasterDataLayout({
  title,
  items,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onBulkDelete,
  searchPlaceholder = "Search...",
  selectedIds = [],
  onRowSelect,
  onSelectAll,
  isLoading = false,
  isDrawerOpen = false,
  onDrawerClose,
  drawerTitle,
  drawerContent,
  children
}: MasterDataLayoutProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);

  // Helper function to convert plural titles to singular
  const getSingularTitle = (plural: string): string => {
    const singularMap: { [key: string]: string } = {
      'Product Categories': 'Product Category',
      'Base Metals': 'Base Metal',
      'Vendors': 'Vendor',
      'Stone Shapes': 'Stone Shape',
      'Stone Sizes': 'Stone Size',
      'Stone Qualities': 'Stone Quality',
      'Shape-Size Mapping': 'Shape-Size Mapping',
      'Plating Colors': 'Plating Color'
    };
    
    return singularMap[plural] || plural.replace(/s$/, '');
  };

  // Helper function to format cell values based on column type
  const formatCellValue = (value: any, column: Column): React.ReactNode => {
    if (value === null || value === undefined || value === '') return '-';
    
    // Use custom renderer if provided
    if (column.renderCell) {
      return column.renderCell(value, items.find(item => item[column.key] === value));
    }
    
    switch (column.type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
        
      case 'date':
        try {
          // Handle different date formats from database
          let dateObj: Date;
          
          if (typeof value === 'string') {
            // Handle database datetime format: "2025-06-28 15:12:57.018 +0700"
            // Replace space with T for proper ISO format if needed
            const isoString = value.includes('T') ? value : value.replace(' ', 'T');
            dateObj = new Date(isoString);
          } else {
            dateObj = new Date(value);
          }
          
          // Check if date is valid
          if (isNaN(dateObj.getTime())) {
            return value.toString();
          }
          
          // Compact date format
          return dateObj.toLocaleDateString('en-US', {
            year: '2-digit',
            month: 'numeric',
            day: 'numeric'
          }) + ' ' + dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
          });
        } catch (error) {
          console.error('Date parsing error:', error, 'Value:', value);
          return value.toString();
        }
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value.toString();
      default:
        return value.toString();
    }
  };

  const filteredItems = items.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn]?.toString() || '';
    const bValue = b[sortColumn]?.toString() || '';
    
    const comparison = aValue.localeCompare(bValue);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleAdd = () => {
    onAdd?.();
  };

  const handleSelectAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    if (onBulkDelete) {
      // Convert all IDs to strings to ensure type compatibility
      onBulkDelete(selectedItems.map(id => id.toString()));
    }
    setSelectedItems([]);
  };

  return (
    <div className="space-y-8 p-6 pt-8 pb-8">
      {/* Page Header - No Panel Background */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your {title.toLowerCase()} settings
          </p>
        </div>
        
        {/* Add New Button in Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            title={`Add New ${getSingularTitle(title)}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </button>
        </div>
      </div>

      {/* Combined Table Area with Controls */}
      <div className="liquid-glass-subtle rounded-2xl overflow-hidden mx-4">
        {/* Controls Section - Top of Table */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30">
          <div className="flex items-center justify-between gap-6">
            {/* Left side - Sort Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Sort by:</span>
              <select
                value={sortColumn}
                onChange={(e) => setSortColumn(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm min-w-[120px]"
              >
                <option value="">None</option>
                {columns.map((column) => (
                  <option key={column.key} value={column.key}>
                    {column.label}
                  </option>
                ))}
              </select>
              
              {sortColumn && (
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortDirection === 'asc' ? (
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              )}
              
              {/* Bulk Delete Button - shown when items are selected */}
              {selectedItems.length > 0 && onBulkDelete && (
                <button
                  onClick={handleBulkDelete}
                  className="ml-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected ({selectedItems.length})
                </button>
              )}
            </div>

            {/* Right side - Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-8">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {/* Always show selection checkbox header */}
                    <th className="text-left p-4 w-12">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={handleSelectAll}
                          className="w-6 h-6 bg-black dark:bg-gray-900 rounded-lg flex items-center justify-center border-2 border-blue-500 hover:bg-gray-800 dark:hover:bg-black transition-all duration-200"
                        >
                          {selectedItems.length === sortedItems.length && sortedItems.length > 0 ? (
                            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : selectedItems.length > 0 ? (
                            <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                          ) : null}
                        </button>
                      </div>
                    </th>
                    {columns.map((column) => (
                      <th key={column.key} className={`p-4 font-semibold text-gray-900 dark:text-white ${
                        column.key === 'is_active' ? 'text-center' : 'text-left'
                      }`}>
                        <button
                          onClick={() => handleSort(column.key)}
                          className={`flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                            column.key === 'is_active' ? 'justify-center w-full' : ''
                          }`}
                        >
                          {column.label}
                          {sortColumn === column.key && (
                            <span className="text-blue-600 dark:text-blue-400">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>
                    ))}
                    <th className="text-left p-4 font-semibold text-gray-900 dark:text-white w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                        selectedItems.includes(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      {/* Always show selection checkbox */}
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleSelectItem(item.id)}
                            className="w-5 h-5 bg-black dark:bg-gray-900 rounded-md flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-800 dark:hover:bg-black transition-all duration-200"
                          >
                            {selectedItems.includes(item.id) && (
                              <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      {columns.map((column) => (
                        <td key={column.key} className={`p-4 text-gray-700 dark:text-gray-300 ${
                          column.key === 'is_active' ? 'text-center' : ''
                        }`}>
                          {column.renderCell ? column.renderCell(item[column.key], item) : formatCellValue(item[column.key], column)}
                        </td>
                      ))}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all duration-200"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sortedItems.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No items found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'Try adjusting your search criteria.' : `No ${title.toLowerCase()} have been added yet.`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Drawer for Forms */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => onDrawerClose?.()}
        title={drawerTitle || `Add New ${getSingularTitle(title)}`}
        size="md"
      >
        <div className="space-y-6">
          {drawerContent || children || (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Form fields will be implemented with backend integration
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
