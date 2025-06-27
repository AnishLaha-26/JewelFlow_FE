'use client';

import AdminLayout from '@/components/Layout/AdminLayout';
import MasterDataLayout from '@/components/MasterData/MasterDataLayout';

// Placeholder data
const vendors = [
  { id: '1', name: 'Premium Gems Co.', contact: '+1-555-0123', bankDetails: 'Wells Fargo ***4567', createdAt: '2024-06-01' },
  { id: '2', name: 'Golden Suppliers Inc.', contact: '+1-555-0124', bankDetails: 'Chase Bank ***8901', createdAt: '2024-06-02' },
  { id: '3', name: 'Diamond Direct Ltd.', contact: '+1-555-0125', bankDetails: 'Bank of America ***2345', createdAt: '2024-06-03' },
  { id: '4', name: 'Silver Stream Co.', contact: '+1-555-0126', bankDetails: 'CitiBank ***6789', createdAt: '2024-06-04' },
  { id: '5', name: 'Platinum Partners', contact: '+1-555-0127', bankDetails: 'TD Bank ***0123', createdAt: '2024-06-05' },
];

const columns = [
  { key: 'name', label: 'Vendor Name' },
  { key: 'contact', label: 'Contact No' },
  { key: 'bankDetails', label: 'Bank Details' },
  { key: 'createdAt', label: 'Created At' },
];

export default function VendorsPage() {
  const handleAdd = () => {
    console.log('Add new vendor');
  };

  const handleEdit = (item: any) => {
    console.log('Edit vendor:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete vendor:', item);
  };

  return (
    <AdminLayout>
      <MasterDataLayout
        title="Vendors"
        items={vendors}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search vendors..."
      >
        {/* Placeholder form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vendor Name
            </label>
            <input
              type="text"
              placeholder="Enter vendor name"
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact No
            </label>
            <input
              type="tel"
              placeholder="Enter contact number"
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bank Details
            </label>
            <textarea
              placeholder="Enter bank details"
              rows={3}
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
            />
          </div>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Save Vendor
          </button>
        </div>
      </MasterDataLayout>
    </AdminLayout>
  );
}
