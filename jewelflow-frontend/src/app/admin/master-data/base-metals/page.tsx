'use client';

import { useState } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import MasterDataLayout from '@/components/MasterData/MasterDataLayout';

// Placeholder data
const baseMetals = [
  { id: '1', name: 'Gold 18K', metal: 'Gold', purity: '75%', createdAt: '2024-06-01' },
  { id: '2', name: 'Gold 14K', metal: 'Gold', purity: '58.3%', createdAt: '2024-06-02' },
  { id: '3', name: 'Silver 925', metal: 'Silver', purity: '92.5%', createdAt: '2024-06-03' },
  { id: '4', name: 'Platinum 950', metal: 'Platinum', purity: '95%', createdAt: '2024-06-04' },
  { id: '5', name: 'White Gold 18K', metal: 'White Gold', purity: '75%', createdAt: '2024-06-05' },
];

const columns = [
  { key: 'name', label: 'Metal Name' },
  { key: 'purity', label: 'Purity' },
  { key: 'createdAt', label: 'Created At' },
];

export default function BaseMetalsPage() {
  const [metalName, setMetalName] = useState('');
  const [purityPercentage, setPurityPercentage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAdd = () => {
    console.log('Add new base metal');
  };

  const handleEdit = (item: any) => {
    console.log('Edit base metal:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete base metal:', item);
  };

  const handleBulkDelete = (ids: string[]) => {
    console.log('Bulk delete base metals:', ids);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!metalName.trim()) {
      newErrors.metalName = 'Metal name is required';
    }
    
    if (!purityPercentage.trim()) {
      newErrors.purityPercentage = 'Purity percentage is required';
    } else {
      const purity = parseFloat(purityPercentage);
      if (isNaN(purity) || purity <= 0 || purity > 100) {
        newErrors.purityPercentage = 'Purity must be a valid percentage between 0 and 100';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form is valid, submitting...');
      // Reset form
      setMetalName('');
      setPurityPercentage('');
      setErrors({});
    }
  };

  return (
    <AdminLayout>
      <MasterDataLayout
        title="Base Metals"
        items={baseMetals}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        searchPlaceholder="Search metals..."
      >
        {/* Drawer form content */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Metal Name *
            </label>
            <input
              type="text"
              value={metalName}
              onChange={(e) => {
                setMetalName(e.target.value);
                if (errors.metalName) {
                  setErrors(prev => ({ ...prev, metalName: '' }));
                }
              }}
              placeholder="e.g., Gold 18K, Silver 925"
              className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 dark:text-white transition-all duration-200 ${
                errors.metalName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              required
            />
            {errors.metalName && (
              <p className="text-xs text-red-500 mt-1">{errors.metalName}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter a descriptive name for the metal type
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Purity Percentage *
            </label>
            <div className="relative">
              <input
                type="number"
                value={purityPercentage}
                onChange={(e) => {
                  setPurityPercentage(e.target.value);
                  if (errors.purityPercentage) {
                    setErrors(prev => ({ ...prev, purityPercentage: '' }));
                  }
                }}
                placeholder="75"
                min="0"
                max="100"
                step="0.1"
                className={`w-full px-4 py-3 pr-12 bg-white/50 dark:bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 dark:text-white transition-all duration-200 ${
                  errors.purityPercentage 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
                required
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                %
              </span>
            </div>
            {errors.purityPercentage && (
              <p className="text-xs text-red-500 mt-1">{errors.purityPercentage}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter the purity percentage (e.g., 75 for 18K gold)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Add any additional information about this metal"
              rows={3}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setMetalName('');
                setPurityPercentage('');
                setErrors({});
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Save Metal
            </button>
          </div>
        </div>
      </MasterDataLayout>
    </AdminLayout>
  );
}
