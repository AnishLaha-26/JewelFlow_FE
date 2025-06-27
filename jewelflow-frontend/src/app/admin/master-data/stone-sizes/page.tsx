'use client';

import AdminLayout from '@/components/Layout/AdminLayout';
import MasterDataLayout from '@/components/MasterData/MasterDataLayout';

// Placeholder data
const stoneSizes = [
  { id: '1', name: '0.25 ct', createdAt: '2024-06-01' },
  { id: '2', name: '0.50 ct', createdAt: '2024-06-02' },
  { id: '3', name: '0.75 ct', createdAt: '2024-06-03' },
  { id: '4', name: '1.00 ct', createdAt: '2024-06-04' },
  { id: '5', name: '1.25 ct', createdAt: '2024-06-05' },
  { id: '6', name: '1.50 ct', createdAt: '2024-06-06' },
  { id: '7', name: '2.00 ct', createdAt: '2024-06-07' },
  { id: '8', name: '2.50 ct', createdAt: '2024-06-08' },
];

const columns = [
  { key: 'name', label: 'Size' },
  { key: 'createdAt', label: 'Created At' },
];

export default function StoneSizesPage() {
  const handleAdd = () => {
    console.log('Add new stone size');
  };

  const handleEdit = (item: any) => {
    console.log('Edit stone size:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete stone size:', item);
  };

  return (
    <AdminLayout>
      <MasterDataLayout
        title="Stone Sizes"
        items={stoneSizes}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search sizes..."
      >
        {/* Placeholder form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Size Value
            </label>
            <input
              type="text"
              placeholder="e.g., 1.25 ct"
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Save Size
          </button>
        </div>
      </MasterDataLayout>
    </AdminLayout>
  );
}
