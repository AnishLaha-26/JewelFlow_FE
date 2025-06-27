'use client';

import AdminLayout from '@/components/Layout/AdminLayout';
import MasterDataLayout from '@/components/MasterData/MasterDataLayout';

// Placeholder data
const platingColors = [
  { id: '1', name: 'Yellow Gold', createdAt: '2024-06-01' },
  { id: '2', name: 'White Gold', createdAt: '2024-06-02' },
  { id: '3', name: 'Rose Gold', createdAt: '2024-06-03' },
  { id: '4', name: 'Black Rhodium', createdAt: '2024-06-04' },
  { id: '5', name: 'Platinum', createdAt: '2024-06-05' },
  { id: '6', name: 'Silver', createdAt: '2024-06-06' },
  { id: '7', name: 'Antique Gold', createdAt: '2024-06-07' },
  { id: '8', name: 'Gun Metal', createdAt: '2024-06-08' },
];

const columns = [
  { key: 'name', label: 'Color Name' },
  { key: 'createdAt', label: 'Created At' },
];

export default function PlatingColorsPage() {
  const handleAdd = () => {
    console.log('Add new plating color');
  };

  const handleEdit = (item: any) => {
    console.log('Edit plating color:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete plating color:', item);
  };

  return (
    <AdminLayout>
      <MasterDataLayout
        title="Plating Colors"
        items={platingColors}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search colors..."
      >
        {/* Placeholder form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Name
            </label>
            <input
              type="text"
              placeholder="Enter color name"
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Save Color
          </button>
        </div>
      </MasterDataLayout>
    </AdminLayout>
  );
}
