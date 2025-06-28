'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/components/Layout/AdminLayout';
import MasterDataLayout, { Column } from '@/components/MasterData/MasterDataLayout';
import { productCategoryApi } from '@/app/services/api';

interface ProductCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface FormData {
  name: string;
  description: string;
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

export default function ProductCategoriesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});
  
  // Define columns with proper types
  const columns: Column[] = [
    { 
      key: 'name', 
      label: 'Category Name', 
      type: 'text' as const 
    },
    { 
      key: 'description', 
      label: 'Description', 
      type: 'text' as const 
    },
    { 
      key: 'created_at', 
      label: 'Created At', 
      type: 'date' as const 
    },
    { 
      key: 'updated_at', 
      label: 'Updated At', 
      type: 'date' as const 
    },
    { 
      key: 'is_active', 
      label: 'Is Active?', 
      type: 'boolean' as const,
      renderCell: (value: boolean, row: ProductCategory) => (
        <div className="flex items-center justify-center w-full">
          <button
            onClick={() => handleStatusToggle(row.id, value)}
            disabled={isUpdating[row.id]}
            className="w-5 h-5 bg-black dark:bg-gray-900 rounded-md flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-800 dark:hover:bg-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {value && (
              <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      ),
    },
  ];

  // Handle status toggle with loading state
  const handleStatusToggle = async (id: number, currentStatus: boolean) => {
    try {
      setIsUpdating(prev => ({ ...prev, [id]: true }));
      await productCategoryApi.toggleStatus(id, !currentStatus);
      
      // Update local state immediately for better UX
      setProductCategories(prev => 
        prev.map(cat => 
          cat.id === id ? { ...cat, is_active: !currentStatus } : cat
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert the UI on error
      setProductCategories(prev => 
        prev.map(cat => 
          cat.id === id ? { ...cat, is_active: currentStatus } : cat
        )
      );
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  // Fetch product categories
  const fetchProductCategories = async () => {
    try {
      setIsLoading(true);
      const data = await productCategoryApi.getAll();
      console.log('Raw API Response:', data);
      console.log('First item structure:', data[0]);
      setProductCategories(data);
    } catch (error) {
      console.error('Failed to fetch product categories:', error);
      toast.error('Failed to load product categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductCategories();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setErrors({});
    setSelectedCategory(null);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }
    
    const loadingToast = toast.loading(selectedCategory ? 'Updating category...' : 'Creating category...');
    
    try {
      setIsSubmitting(true);
      
      if (selectedCategory) {
        // Update existing category
        await productCategoryApi.update(selectedCategory.id.toString(), formData);
        toast.success('Category updated successfully', { id: loadingToast });
      } else {
        // Create new category
        await productCategoryApi.create(formData);
        toast.success('Category created successfully', { id: loadingToast });
      }
      
      // Refresh the list and close the drawer
      await fetchProductCategories();
      setIsDrawerOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('Error saving category:', error);
      
      // Type-safe error handling with more specific messages
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number;
            data?: { 
              message?: string;
              name?: string[];
              description?: string[];
              [key: string]: any;
            } 
          } 
        };
        
        // Handle validation errors (400)
        if (axiosError.response?.status === 400) {
          const { data } = axiosError.response;
          const fieldErrors: Partial<FormData> = {};
          
          // Map backend validation errors to form fields
          if (data?.name) fieldErrors.name = data.name[0];
          if (data?.description) fieldErrors.description = data.description[0];
          
          setErrors(fieldErrors);
          toast.error('Please fix the form errors', { id: loadingToast });
          return;
        }
        
        // Handle unauthorized (401)
        if (axiosError.response?.status === 401) {
          toast.error('Session expired. Please login again.', { id: loadingToast });
          router.push('/login');
          return;
        }
        
        // Handle not found (404) - only for updates
        if (axiosError.response?.status === 404 && selectedCategory) {
          toast.error('Category not found. It may have been deleted.', { id: loadingToast });
          setIsDrawerOpen(false);
          await fetchProductCategories();
          return;
        }
        
        // Handle other API errors
        const errorMessage = axiosError.response?.data?.message || 'Failed to save category';
        toast.error(errorMessage, { id: loadingToast });
      } else if (error instanceof Error) {
        // For standard Error objects (network errors, etc.)
        toast.error(`Error: ${error.message}`, { id: loadingToast });
      } else {
        // For any other type of error
        toast.error('An unexpected error occurred', { id: loadingToast });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add new
  const handleAdd = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  // Handle edit
  const handleEdit = (item: ProductCategory) => {
    setSelectedCategory(item);
    setFormData({
      name: item.name,
      description: item.description || ''
    });
    setIsDrawerOpen(true);
  };

  // Handle delete
  const handleDelete = async (item: ProductCategory) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    
    try {
      await productCategoryApi.delete(item.id.toString());
      toast.success('Category deleted successfully');
      // Refresh the list
      fetchProductCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (ids: (string | number)[]) => {
    if (ids.length === 0) return;
    
    try {
      // Convert all IDs to strings before sending to API
      const stringIds = ids.map(id => id.toString());
      await productCategoryApi.bulkDelete(stringIds);
      toast.success('Selected categories deleted successfully');
      setSelectedIds([]);
      fetchProductCategories();
    } catch (error) {
      console.error('Failed to delete categories:', error);
      toast.error('Failed to delete selected categories');
    }
  };

  // Handle row selection
  const handleRowSelect = (id: string | number, isSelected: boolean) => {
    setSelectedIds(prev => 
      isSelected 
        ? [...prev, id as number] 
        : prev.filter(selectedId => selectedId !== id)
    );
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedIds(productCategories.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
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
        selectedIds={selectedIds}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        isLoading={isLoading}
        isDrawerOpen={isDrawerOpen}
        onDrawerClose={() => {
          setIsDrawerOpen(false);
          resetForm();
        }}
        drawerTitle={selectedCategory ? 'Edit Category' : 'Add New Category'}
        drawerContent={
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Choose a descriptive name for the category
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {selectedCategory ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{selectedCategory ? 'Update Category' : 'Create Category'}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        }
      />
    </AdminLayout>
  );
}