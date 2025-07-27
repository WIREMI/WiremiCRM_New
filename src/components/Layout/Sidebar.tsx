import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Shield,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  AlertTriangle,
  DollarSign,
  Calculator,
  Target,
  Banknote,
  Wallet,
  MessageCircle,
  HeadphonesIcon,
  Package,
  UserCheck,
  TrendingUp,
  Gift,
  PieChart,
  Bell,
  Menu
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard', color: 'text-blue-500' },
    { path: '/auth', icon: Shield, label: 'Authentication', color: 'text-blue-500' },
    { path: '/customers', icon: Users, label: 'Customer Management', color: 'text-purple-500' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions', color: 'text-green-500' },
    { path: '/roles', icon: UserCheck, label: 'Roles & Permissions', color: 'text-indigo-500' },
    { path: '/compliance', icon: AlertTriangle, label: 'Compliance & AML', color: 'text-yellow-500' },
    { path: '/fraud', icon: Shield, label: 'Fraud & Risk', color: 'text-red-500' },
    { path: '/finance', icon: DollarSign, label: 'Finance & Reconciliation', color: 'text-green-600' },
    { path: '/pricing', icon: Calculator, label: 'Pricing & Billing', color: 'text-orange-500' },
    { path: '/savings', icon: Target, label: 'Savings Module', color: 'text-teal-500' },
    { path: '/loans', icon: Banknote, label: 'Loans & Credit', color: 'text-emerald-500' },
    { path: '/cards', icon: Wallet, label: 'Virtual Cards', color: 'text-cyan-500' },
    { path: '/messaging', icon: MessageCircle, label: 'Messaging Center', color: 'text-pink-500' },
    { path: '/support', icon: HeadphonesIcon, label: 'Support & Tickets', color: 'text-violet-500' },
    { path: '/products', icon: Package, label: 'Product Management', color: 'text-slate-500' },
    { path: '/admin', icon: Settings, label: 'Super Admin', color: 'text-gray-600' },
    { path: '/marketing', icon: TrendingUp, label: 'Marketing & Growth', color: 'text-rose-500' },
    { path: '/loyalty', icon: Gift, label: 'Loyalty & Rewards', color: 'text-amber-500' },
    { path: '/reports', icon: PieChart, label: 'BI Reporting', color: 'text-blue-600' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alert Management', color: 'text-red-500' },
    { path: '/advertising', icon: Bell, label: 'Advertising & Notifications', color: 'text-fuchsia-500' },
  ];

  return (
    <div className={`bg-slate-900 dark:bg-dark-950 text-white h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      <div className="p-4 border-b border-slate-700 dark:border-dark-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Wiremi CRM
            </h1>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-700 dark:hover:bg-dark-800 rounded-lg transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-slate-700 dark:bg-dark-800 border-l-4 border-blue-400' 
                  : 'hover:bg-slate-800 dark:hover:bg-dark-800'
              }`}
            >
              <Icon size={20} className={item.color} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700 dark:border-dark-800">
          <div className="text-xs text-slate-400 dark:text-dark-500">
            Wiremi Fintech CRM v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;