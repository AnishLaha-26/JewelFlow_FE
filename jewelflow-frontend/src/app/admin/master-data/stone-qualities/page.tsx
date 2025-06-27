'use client';

import AdminLayout from '@/components/Layout/AdminLayout';
import MasterDataLayout from '@/components/MasterData/MasterDataLayout';

// Placeholder data
const stoneQualities = [
  { id: '1', name: 'FL (Flawless)', createdAt: '2024-06-01' },
  { id: '2', name: 'IF (Internally Flawless)', createdAt: '2024-06-02' },
  { id: '3', name: 'VVS1 (Very Very Slightly Included)', createdAt: '2024-06-03' },
  { id: '4', name: 'VVS2 (Very Very Slightly Included)', createdAt: '2024-06-04' },
  { id: '5', name: 'VS1 (Very Slightly Included)', createdAt: '2024-06-05' },
  { id: '6', name: 'VS2 (Very Slightly Included)', createdAt: '2024-06-06' },
  { id: '7', name: 'SI1 (Slightly Included)', createdAt: '2024-06-07' },
  { id: '8', name: 'SI2 (Slightly Included)', createdAt: '2024-06-08' },
];

const columns = [
  { key: 'name', label: 'Quality Grade' },
  { key: 'createdAt', label: 'Created At' },
];

export default function StoneQualitiesPage() {
  const handleAdd = () => {
    console.log('Add new stone quality');
  };

  const handleEdit = (item: any) => {
    console.log('Edit stone quality:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete stone quality:', item);
  };

  return (
    <AdminLayout>
      <MasterDataLayout
        title="Stone Qualities"
        items={stoneQualities}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search qualities..."
      >
        {/* Placeholder form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quality Grade
            </label>
            <input
              type="text"
              placeholder="e.g., VVS1 (Very Very Slightly Included)"
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Save Quality
          </button>
        </div>
      </MasterDataLayout>
    </AdminLayout>
  );
}
