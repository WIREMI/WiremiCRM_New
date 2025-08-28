import React, { useState, useEffect } from 'react';
import { Building, Plus, Phone, Mail, MapPin, Clock } from 'lucide-react';

const SuppliersTab: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      // Mock suppliers data
      const mockSuppliers = Array.from({ length: 8 }, (_, i) => ({
        id: `supplier-${i + 1}`,
        name: [
          'TechCorp Solutions',
          'Global Supply Chain Ltd',
          'Innovation Partners',
          'Digital Services Inc',
          'Premium Products Co',
          'Reliable Vendors LLC',
          'Quality Suppliers Group',
          'Enterprise Solutions'
        ][i],
        contactEmail: `contact@supplier${i + 1}.com`,
        contactPhone: `+1-555-${String(i + 1).padStart(4, '0')}`,
        address: `${123 + i} Business Ave, City ${i + 1}, State ${i + 1}`,
        leadTime: Math.floor(Math.random() * 30) + 5,
        minimumOrder: Math.floor(Math.random() * 1000) + 100,
        productsSupplied: Math.floor(Math.random() * 20) + 5,
        totalOrders: Math.floor(Math.random() * 100) + 10,
        rating: (Math.random() * 2 + 3).toFixed(1),
        status: Math.random() > 0.2 ? 'ACTIVE' : 'INACTIVE'
      }));

      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          Suppliers & Vendors
        </h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus size={16} className="mr-2" />
          Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-dark-600 rounded-lg h-48"></div>
          ))
        ) : (
          suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Building className="w-8 h-8 text-blue-500" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-dark-100">
                      {supplier.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-dark-400">Rating:</span>
                      <span className="font-medium text-yellow-600">{supplier.rating}/5.0</span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(supplier.status)}`}>
                  {supplier.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-dark-400">{supplier.contactEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-dark-400">{supplier.contactPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-dark-400">{supplier.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-dark-400">Lead time: {supplier.leadTime} days</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-dark-100">{supplier.productsSupplied}</div>
                    <div className="text-xs text-gray-500 dark:text-dark-400">Products</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-dark-100">{supplier.totalOrders}</div>
                    <div className="text-xs text-gray-500 dark:text-dark-400">Orders</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuppliersTab;