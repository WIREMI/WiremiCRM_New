import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';
import ProductCatalogTab from './components/ProductCatalogTab';
import InventoryManagementTab from './components/InventoryManagementTab';
import OrderManagementTab from './components/OrderManagementTab';
import SuppliersTab from './components/SuppliersTab';
import AnalyticsTab from './components/AnalyticsTab';

const ProductManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    totalSuppliers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProductStats();
  }, []);

  const loadProductStats = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/v1/products/stats');
      // const data = await response.json();
      
      // Mock data for demonstration
      setStats({
        totalProducts: 156,
        activeProducts: 134,
        totalOrders: 2847,
        totalRevenue: 485920,
        lowStockItems: 23,
        totalSuppliers: 45
      });
    } catch (error) {
      console.error('Failed to load product stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'catalog', label: 'Product Catalog', icon: Package },
    { id: 'inventory', label: 'Inventory Management', icon: BarChart3 },
    { id: 'orders', label: 'Order Management', icon: Users },
    { id: 'suppliers', label: 'Suppliers & Vendors', icon: TrendingUp },
    { id: 'analytics', label: 'Product Analytics', icon: BarChart3 }
  ];

  return (
    <div>
      <PageHeader 
        title="Product Management" 
        subtitle="Comprehensive product catalog, inventory, and order management system"
        actions={
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
              <BarChart3 size={16} className="mr-2" />
              Analytics Dashboard
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          change="+12 this month"
          changeType="positive"
          icon={Package}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Active Products"
          value={stats.activeProducts.toString()}
          change="+8 new today"
          changeType="positive"
          icon={Package}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          change="+23% this week"
          changeType="positive"
          icon={Users}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
          change="+15.2% this month"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockItems.toString()}
          change="Needs attention"
          changeType="negative"
          icon={BarChart3}
          iconColor="text-red-500"
        />
        <StatsCard
          title="Suppliers"
          value={stats.totalSuppliers.toString()}
          change="+3 new partners"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-orange-500"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mb-6">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'catalog' && <ProductCatalogTab />}
          {activeTab === 'inventory' && <InventoryManagementTab />}
          {activeTab === 'orders' && <OrderManagementTab />}
          {activeTab === 'suppliers' && <SuppliersTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;