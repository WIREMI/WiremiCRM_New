import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SavingsAnalyticsCharts: React.FC = () => {
  const volumeByTypeData = [
    { type: 'Regular', volume: 1200000, count: 85 },
    { type: 'Blocked', volume: 800000, count: 32 },
    { type: 'Recurrent', volume: 650000, count: 28 },
    { type: 'Group', volume: 197392, count: 11 }
  ];

  const frequencyData = [
    { name: 'Monthly', value: 45, color: '#3b82f6' },
    { name: 'Weekly', value: 30, color: '#10b981' },
    { name: 'Daily', value: 15, color: '#f59e0b' },
    { name: 'Quarterly', value: 10, color: '#8b5cf6' }
  ];

  const monthlyTrendData = [
    { month: 'Jan', created: 12, completed: 3, volume: 245000 },
    { month: 'Feb', created: 15, completed: 5, volume: 320000 },
    { month: 'Mar', created: 18, completed: 4, volume: 410000 },
    { month: 'Apr', created: 22, completed: 7, volume: 380000 },
    { month: 'May', created: 19, completed: 6, volume: 450000 },
    { month: 'Jun', created: 25, completed: 8, volume: 520000 }
  ];

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Savings Volume by Type */}
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Savings Volume by Type
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeByTypeData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="type" 
                axisLine={false}
                tickLine={false}
                className="text-gray-600 dark:text-dark-400"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-gray-600 dark:text-dark-400"
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Volume']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="volume" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings Frequency Distribution */}
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Savings Frequency Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={frequencyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {frequencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Percentage']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          {frequencyData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-dark-400">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Monthly Savings Trends
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-gray-600 dark:text-dark-400"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-gray-600 dark:text-dark-400"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="created" 
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
                name="Created"
              />
              <Bar 
                dataKey="completed" 
                fill="#10b981"
                radius={[2, 2, 0, 0]}
                name="Completed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SavingsAnalyticsCharts;