import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Settings, Trash2, CheckCircle, Circle } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';

interface RoleOverview {
  id: string;
  name: string;
  description: string;
  userCount: number;
  color: string;
  bgColor: string;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  permissions: string[];
}

interface PermissionMatrix {
  module: string;
  superAdmin: boolean;
  financialAnalyst: boolean;
  supportOfficer: boolean;
  auditor: boolean;
  productManager: boolean;
}

const RoleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for role overview cards
  const roleOverviewCards: RoleOverview[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access and user management',
      userCount: 1,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    },
    {
      id: '2',
      name: 'Financial Analyst',
      description: 'Access to financial data and analytics',
      userCount: 1,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      id: '3',
      name: 'Support Officer',
      description: 'Customer support and communication tools',
      userCount: 1,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    },
    {
      id: '4',
      name: 'Auditor',
      description: 'Read-only access for compliance and auditing',
      userCount: 1,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: '5',
      name: 'Product Manager',
      description: 'Product development and feature management',
      userCount: 1,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200'
    }
  ];

  // Mock data for admin list
  const mockAdmins: Admin[] = [
    {
      id: '1',
      name: 'Alex Chen',
      email: 'alex.chen@wiremi.com',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2024-02-15 14:30',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@wiremi.com',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Financial Analyst',
      status: 'active',
      lastLogin: '2024-02-15 13:15',
      permissions: ['finance:read', 'finance:write', '+2 more']
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@wiremi.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Support Officer',
      status: 'active',
      lastLogin: '2024-02-15 12:45',
      permissions: ['support:read', 'support:write', '+2 more']
    },
    {
      id: '4',
      name: 'Lisa Martinez',
      email: 'lisa.martinez@wiremi.com',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Auditor',
      status: 'active',
      lastLogin: '2024-02-15 11:20',
      permissions: ['audit:read', 'transactions:read', '+2 more']
    },
    {
      id: '5',
      name: 'Tom Anderson',
      email: 'tom.anderson@wiremi.com',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'Product Manager',
      status: 'inactive',
      lastLogin: '2024-02-10 16:20',
      permissions: ['product:read', 'product:write', '+2 more']
    }
  ];

  // Mock data for permission matrix
  const permissionMatrix: PermissionMatrix[] = [
    {
      module: 'Finance',
      superAdmin: true,
      financialAnalyst: true,
      supportOfficer: false,
      auditor: true,
      productManager: false
    },
    {
      module: 'Transactions',
      superAdmin: true,
      financialAnalyst: true,
      supportOfficer: false,
      auditor: true,
      productManager: false
    },
    {
      module: 'Users',
      superAdmin: true,
      financialAnalyst: true,
      supportOfficer: true,
      auditor: true,
      productManager: false
    },
    {
      module: 'Support',
      superAdmin: true,
      financialAnalyst: false,
      supportOfficer: true,
      auditor: false,
      productManager: false
    },
    {
      module: 'Product',
      superAdmin: true,
      financialAnalyst: false,
      supportOfficer: false,
      auditor: false,
      productManager: true
    },
    {
      module: 'Audit',
      superAdmin: true,
      financialAnalyst: false,
      supportOfficer: false,
      auditor: true,
      productManager: false
    }
  ];

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setAdmins(mockAdmins);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      'Super Admin': 'bg-red-100 text-red-800',
      'Financial Analyst': 'bg-blue-100 text-blue-800',
      'Support Officer': 'bg-green-100 text-green-800',
      'Auditor': 'bg-yellow-100 text-yellow-800',
      'Product Manager': 'bg-purple-100 text-purple-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All Roles' || admin.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStats = () => {
    const total = admins.length;
    const active = admins.filter(admin => admin.status === 'active').length;
    const inactive = admins.filter(admin => admin.status === 'inactive').length;
    const superAdmins = admins.filter(admin => admin.role === 'Super Admin').length;
    
    return { total, active, inactive, superAdmins };
  };

  const stats = getStats();

  return (
    <div>
      <PageHeader 
        title="Admin Role Management" 
        subtitle="Manage administrator accounts and permissions"
        actions={
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus size={16} className="mr-2" />
            Add Admin
          </button>
        }
      />

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {roleOverviewCards.map((role) => (
          <div key={role.id} className={`${role.bgColor} border rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-full border-2 ${role.color.replace('text-', 'border-')} flex items-center justify-center`}>
                <Circle size={12} className={role.color} />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-dark-100 mb-1">
              {role.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-dark-400 mb-3">
              {role.description}
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-dark-100">
              {role.userCount} users
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-400" size={20} />
              <input
                type="text"
                placeholder="Search administrators by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-400"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="All Roles">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Financial Analyst">Financial Analyst</option>
              <option value="Support Officer">Support Officer</option>
              <option value="Auditor">Auditor</option>
              <option value="Product Manager">Product Manager</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
              <Filter size={16} />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-dark-100">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-dark-400">Total Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-dark-400">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
            <div className="text-sm text-gray-600 dark:text-dark-400">Inactive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.superAdmins}</div>
            <div className="text-sm text-gray-600 dark:text-dark-400">Super Admins</div>
          </div>
        </div>
      </div>

      {/* Admin List Table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Administrator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-dark-600 rounded-full"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-40"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                  </tr>
                ))
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-dark-600">
                          <img 
                            src={admin.avatar} 
                            alt={admin.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-500 to-purple-600">${admin.name.split(' ').map(n => n[0]).join('')}</div>`;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                            {admin.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-dark-400">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(admin.role)}`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(admin.status)}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">
                      {admin.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.map((permission, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1">
                          <Settings size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Permission Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Super Admin
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Financial Analyst
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Support Officer
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Auditor
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Product Manager
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {permissionMatrix.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-100">
                    {row.module}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {row.superAdmin ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {row.financialAnalyst ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {row.supportOfficer ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {row.auditor ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {row.productManager ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;