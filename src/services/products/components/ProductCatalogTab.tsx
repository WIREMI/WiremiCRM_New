import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, Tag, DollarSign } from 'lucide-react';
import { Product, ProductStatus, ProductType } from '../../../types/product';
import CreateProductModal from './CreateProductModal';
import ProductDetailModal from './ProductDetailModal';

const ProductCatalogTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    type: ''
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/products?' + new URLSearchParams(filters));
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
        id: `product-${i + 1}`,
        name: [
          'Premium Virtual Card',
          'Business Banking Package',
          'Investment Portfolio Service',
          'Crypto Trading Platform',
          'Mobile Banking App',
          'Savings Goal Tracker',
          'International Transfer Service',
          'Fraud Protection Suite',
          'Financial Analytics Dashboard',
          'Customer Support Package'
        ][i % 10],
        description: 'Comprehensive financial service offering advanced features and premium support.',
        sku: `SKU-${String(i + 1).padStart(4, '0')}`,
        category: {
          id: `cat-${(i % 5) + 1}`,
          name: ['Banking Services', 'Investment Products', 'Digital Tools', 'Security Services', 'Support Services'][i % 5],
          description: 'Product category description',
          isActive: true
        },
        type: [ProductType.SERVICE, ProductType.DIGITAL, ProductType.SUBSCRIPTION][i % 3],
        status: [ProductStatus.ACTIVE, ProductStatus.INACTIVE, ProductStatus.DRAFT][i % 3],
        pricing: {
          basePrice: Math.random() * 100 + 10,
          currency: 'USD',
          discounts: [],
          tierPricing: [],
          costPrice: Math.random() * 50 + 5,
          margin: Math.random() * 50 + 20
        },
        inventory: {
          totalStock: Math.floor(Math.random() * 1000) + 100,
          availableStock: Math.floor(Math.random() * 800) + 50,
          reservedStock: Math.floor(Math.random() * 50),
          reorderLevel: 50,
          locations: []
        },
        specifications: [
          { name: 'Service Level', value: 'Premium', type: 'TEXT', isRequired: true },
          { name: 'Support Hours', value: '24/7', type: 'TEXT', isRequired: false }
        ],
        images: [`/images/product-${i + 1}.jpg`],
        tags: ['premium', 'featured', 'new'].slice(0, Math.floor(Math.random() * 3) + 1),
        lifecycle: {
          stage: 'GROWTH' as any,
          version: '1.0.0',
          changeLog: []
        },
        analytics: {
          views: Math.floor(Math.random() * 10000) + 1000,
          orders: Math.floor(Math.random() * 500) + 50,
          revenue: Math.random() * 50000 + 5000,
          conversionRate: Math.random() * 10 + 2
        },
        createdBy: 'admin-user',
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }));

      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    const colors = {
      [ProductStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [ProductStatus.INACTIVE]: 'bg-red-100 text-red-800',
      [ProductStatus.DRAFT]: 'bg-yellow-100 text-yellow-800',
      [ProductStatus.DISCONTINUED]: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: ProductType) => {
    const colors = {
      [ProductType.PHYSICAL]: 'bg-blue-100 text-blue-800',
      [ProductType.DIGITAL]: 'bg-purple-100 text-purple-800',
      [ProductType.SERVICE]: 'bg-green-100 text-green-800',
      [ProductType.SUBSCRIPTION]: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCreateProduct = () => {
    setShowCreateModal(true);
  };

  const handleProductCreated = () => {
    setShowCreateModal(false);
    loadProducts();
  };

  const handleProductUpdated = () => {
    setShowDetailModal(false);
    loadProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          Product Catalog
        </h3>
        <button
          onClick={handleCreateProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Categories</option>
              <option value="Banking Services">Banking Services</option>
              <option value="Investment Products">Investment Products</option>
              <option value="Digital Tools">Digital Tools</option>
              <option value="Security Services">Security Services</option>
              <option value="Support Services">Support Services</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Types</option>
              <option value="PHYSICAL">Physical</option>
              <option value="DIGITAL">Digital</option>
              <option value="SERVICE">Service</option>
              <option value="SUBSCRIPTION">Subscription</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-dark-600 rounded-lg h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Package className="w-8 h-8 text-blue-500" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-dark-100">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-dark-400">
                      SKU: {product.sku}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewProduct(product)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                  >
                    <Eye size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 p-1">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-dark-400 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-dark-400">Category:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-100">
                    {product.category.name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-dark-400">Price:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(product.pricing.basePrice, product.pricing.currency)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-dark-400">Stock:</span>
                  <span className={`font-medium ${
                    product.inventory.availableStock > product.inventory.reorderLevel 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {product.inventory.availableStock}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
                <div className="flex space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(product.status)}`}>
                    {product.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(product.type)}`}>
                    {product.type}
                  </span>
                </div>
                
                {product.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {product.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 2 && (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        +{product.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateModal && (
        <CreateProductModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onProductCreated={handleProductCreated}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          product={selectedProduct}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default ProductCatalogTab;