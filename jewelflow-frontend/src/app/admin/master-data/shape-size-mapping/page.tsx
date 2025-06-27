'use client';

import { useState } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import MasterDataLayout from '@/components/MasterData/MasterDataLayout';

// Placeholder data
const shapeSizeMappings = [
  { id: '1', name: 'Round', shape: 'Round', sizes: '0.25 ct, 0.50 ct, 1.00 ct, 1.50 ct', createdAt: '2024-06-01' },
  { id: '2', name: 'Princess', shape: 'Princess', sizes: '0.50 ct, 0.75 ct, 1.00 ct, 2.00 ct', createdAt: '2024-06-02' },
  { id: '3', name: 'Emerald', shape: 'Emerald', sizes: '0.75 ct, 1.00 ct, 1.25 ct, 1.50 ct', createdAt: '2024-06-03' },
  { id: '4', name: 'Oval', shape: 'Oval', sizes: '0.25 ct, 0.50 ct, 1.00 ct, 2.50 ct', createdAt: '2024-06-04' },
  { id: '5', name: 'Marquise', shape: 'Marquise', sizes: '0.50 ct, 1.00 ct, 1.50 ct, 2.00 ct', createdAt: '2024-06-05' },
];

const columns = [
  { key: 'name', label: 'Shape' },
  { key: 'sizes', label: 'Available Sizes' },
  { key: 'createdAt', label: 'Created At' },
];

const availableShapes = ['Round', 'Princess', 'Emerald', 'Oval', 'Marquise', 'Pear', 'Cushion', 'Heart'];
const availableSizes = ['0.25 ct', '0.50 ct', '0.75 ct', '1.00 ct', '1.25 ct', '1.50 ct', '2.00 ct', '2.50 ct'];

export default function ShapeSizeMappingPage() {
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handleAdd = () => {
    console.log('Add new shape-size mapping');
  };

  const handleEdit = (item: any) => {
    console.log('Edit shape-size mapping:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete shape-size mapping:', item);
  };

  const handleBulkDelete = (ids: string[]) => {
    console.log('Bulk delete shape-size mappings:', ids);
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  return (
    <AdminLayout>
      <MasterDataLayout
        title="Shape-Size Mapping"
        items={shapeSizeMappings}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        searchPlaceholder="Search mappings..."
      >
        {/* Drawer form content */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stone Shape *
            </label>
            <select 
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200"
              required
            >
              <option value="">Select a shape</option>
              {availableShapes.map((shape) => (
                <option key={shape} value={shape.toLowerCase()}>
                  {shape}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select the stone shape for this mapping
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Available Sizes *
            </label>
            <div className="grid grid-cols-2 gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/30 dark:bg-gray-800/30 max-h-48 overflow-y-auto">
              {availableSizes.map((size) => (
                <label key={size} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {size}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Select all available sizes for this shape ({selectedSizes.length} selected)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add any special notes about this mapping"
              rows={3}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setSelectedShape('');
                setSelectedSizes([]);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={!selectedShape || selectedSizes.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Mapping
            </button>
          </div>
        </div>
      </MasterDataLayout>
    </AdminLayout>
  );
}
