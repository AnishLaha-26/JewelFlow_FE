'use client';

import AdminLayout from '@/components/Layout/AdminLayout';
import MasterDataLayout from '@/components/MasterData/MasterDataLayout';

// Placeholder data
const productCategories = [
  { id: '1', name: 'Ring', createdAt: '2024-06-01' },
  { id: '2', name: 'Necklace', createdAt: '2024-06-02' },
  { id: '3', name: 'Earrings', createdAt: '2024-06-03' },
  { id: '4', name: 'Bracelet', createdAt: '2024-06-04' },
  { id: '5', name: 'Pendant', createdAt: '2024-06-05' },
];

const columns = [
  { key: 'name', label: 'Category Name' },
  { key: 'createdAt', label: 'Created At' },
];

export default function ProductCategoriesPage() {
  const handleAdd = () => {
    console.log('Add new category');
  };

  const handleEdit = (item: any) => {
    console.log('Edit category:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete category:', item);
  };

  const handleBulkDelete = (ids: string[]) => {
    console.log('Bulk delete categories:', ids);
  };

  return (
    <AdminLayout>
      <MasterDataLayout
        title="Product Categories"
        items={productCategories}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        searchPlaceholder="Search categories..."
      >
        {/* Drawer form content */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Choose a descriptive name for the category
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Enter category description"
              rows={3}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Save Category
            </button>
          </div>
        </div>
      </MasterDataLayout>
    </AdminLayout>
  );
}
