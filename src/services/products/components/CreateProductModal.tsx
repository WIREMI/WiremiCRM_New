import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Package, DollarSign, Tag, Upload } from 'lucide-react';
import { ProductType, ProductStatus } from '../../../types/product';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onProductCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    categoryId: '',
    type: ProductType.SERVICE,
    status: ProductStatus.DRAFT,
    basePrice: '',
    currency: 'USD',
    costPrice: '',
    totalStock: '',
    reorderLevel: '',
    tags: [] as string[],
    specifications: [] as any[]
  });
  const [newTag, setNewTag] = useState('');
  const [newSpec, setNewSpec] = useState({ name: '', value: '', type: 'TEXT', isRequired: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const categories = [
    { id: 'cat-1', name: 'Banking Services' },
    { id: 'cat-2', name: 'Investment Products' },
    { id: 'cat-3', name: 'Digital Tools' },
    { id: 'cat-4', name: 'Security Services' },
    { id: 'cat-5', name: 'Support Services' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleAddSpecification = () => {
    if (newSpec.name.trim() && newSpec.value.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { ...newSpec }]
      }));
      setNewSpec({ name: '', value: '', type: 'TEXT', isRequired: false });
    }
  };

  const handleRemoveSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push('Product name is required');
    if (!formData.sku.trim()) newErrors.push('SKU is required');
    if (!formData.categoryId) newErrors.push('Category is required');
    if (!formData.basePrice || parseFloat(formData.basePrice) < 0) newErrors.push('Valid base price is required');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      console.log('Creating product:', formData);
      onProductCreated();
    } catch (error) {
      console.error('Failed to create product:', error);
      setErrors(['Failed to create product. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Package className="w-6 h-6 text-blue-500" />
                    <span>Create New Product</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {errors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Please fix the following errors:</h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">Basic Information</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Product Name *
                            </label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter product name"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Description
                            </label>
                            <textarea
                              value={formData.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              rows={3}
                              placeholder="Describe the product..."
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                                SKU *
                              </label>
                              <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => handleInputChange('sku', e.target.value)}
                                placeholder="SKU-0001"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                                Category *
                              </label>
                              <select
                                value={formData.categoryId}
                                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                              >
                                <option value="">Select category...</option>
                                {categories.map(category => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                                Product Type *
                              </label>
                              <select
                                value={formData.type}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                              >
                                <option value={ProductType.PHYSICAL}>Physical</option>
                                <option value={ProductType.DIGITAL}>Digital</option>
                                <option value={ProductType.SERVICE}>Service</option>
                                <option value={ProductType.SUBSCRIPTION}>Subscription</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                                Status
                              </label>
                              <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                              >
                                <option value={ProductStatus.DRAFT}>Draft</option>
                                <option value={ProductStatus.ACTIVE}>Active</option>
                                <option value={ProductStatus.INACTIVE}>Inactive</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">Pricing</h4>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Base Price *
                            </label>
                            <input
                              type="number"
                              value={formData.basePrice}
                              onChange={(e) => handleInputChange('basePrice', e.target.value)}
                              min="0"
                              step="0.01"
                              placeholder="29.99"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Currency
                            </label>
                            <select
                              value={formData.currency}
                              onChange={(e) => handleInputChange('currency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            >
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                              <option value="CAD">CAD</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Cost Price
                            </label>
                            <input
                              type="number"
                              value={formData.costPrice}
                              onChange={(e) => handleInputChange('costPrice', e.target.value)}
                              min="0"
                              step="0.01"
                              placeholder="15.00"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Inventory */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">Inventory</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Initial Stock
                            </label>
                            <input
                              type="number"
                              value={formData.totalStock}
                              onChange={(e) => handleInputChange('totalStock', e.target.value)}
                              min="0"
                              placeholder="100"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Reorder Level
                            </label>
                            <input
                              type="number"
                              value={formData.reorderLevel}
                              onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                              min="0"
                              placeholder="10"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Tags */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">Tags</h4>
                        
                        <div className="space-y-3">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add a tag..."
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            />
                            <button
                              type="button"
                              onClick={handleAddTag}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          
                          {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {formData.tags.map((tag, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTag(index)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                  >
                                    <X size={14} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Specifications */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">Specifications</h4>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={newSpec.name}
                              onChange={(e) => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Spec name..."
                              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                            <input
                              type="text"
                              value={newSpec.value}
                              onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                              placeholder="Spec value..."
                              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>
                          <div className="flex items-center space-x-3">
                            <select
                              value={newSpec.type}
                              onChange={(e) => setNewSpec(prev => ({ ...prev, type: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            >
                              <option value="TEXT">Text</option>
                              <option value="NUMBER">Number</option>
                              <option value="BOOLEAN">Boolean</option>
                              <option value="DATE">Date</option>
                            </select>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={newSpec.isRequired}
                                onChange={(e) => setNewSpec(prev => ({ ...prev, isRequired: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">Required</span>
                            </label>
                            <button
                              type="button"
                              onClick={handleAddSpecification}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          
                          {formData.specifications.length > 0 && (
                            <div className="space-y-2">
                              {formData.specifications.map((spec, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-700 rounded">
                                  <div>
                                    <span className="font-medium text-gray-900 dark:text-dark-100">{spec.name}:</span>
                                    <span className="text-gray-600 dark:text-dark-400 ml-2">{spec.value}</span>
                                    {spec.isRequired && (
                                      <span className="text-red-500 ml-1">*</span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSpecification(index)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Creating...' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateProductModal;