import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Package, DollarSign, BarChart3, Tag } from 'lucide-react';
import { Product } from '../../../types/product';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onProductUpdated: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onProductUpdated
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                    <span>Product Details: {product.name}</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <div className="mt-6 space-y-6">
                  {/* Product Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <p className="text-sm opacity-90">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">
                          {formatCurrency(product.pricing.basePrice, product.pricing.currency)}
                        </div>
                        <div className="text-sm opacity-90">Base Price</div>
                      </div>
                    </div>
                  </div>

                  {/* Product Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Category</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100">
                            {product.category.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Available Stock</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100">
                            {product.inventory.availableStock}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Revenue</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100">
                            {formatCurrency(product.analytics.revenue, product.pricing.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-3">Description</h4>
                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <p className="text-gray-900 dark:text-dark-100">{product.description}</p>
                    </div>
                  </div>

                  {/* Specifications */}
                  {product.specifications.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-3">Specifications</h4>
                      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {product.specifications.map((spec, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-gray-600 dark:text-dark-400">{spec.name}:</span>
                              <span className="font-medium text-gray-900 dark:text-dark-100">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {product.tags.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductDetailModal;