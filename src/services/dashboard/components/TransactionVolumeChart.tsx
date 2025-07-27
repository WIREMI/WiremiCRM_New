import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TransactionVolumeChart: React.FC = () => {
  const data = [
    { name: 'Mon', deposits: 4000, withdrawals: 2400 },
    { name: 'Tue', deposits: 3000, withdrawals: 1398 },
    { name: 'Wed', deposits: 2000, withdrawals: 9800 },
    { name: 'Thu', deposits: 2780, withdrawals: 3908 },
    { name: 'Fri', deposits: 1890, withdrawals: 4800 },
    { name: 'Sat', deposits: 2390, withdrawals: 3800 },
    { name: 'Sun', deposits: 3490, withdrawals: 4300 },
  ];

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Transaction Volume</h3>
        <select className="text-sm border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-1 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
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
            <Line 
              type="monotone" 
              dataKey="deposits" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Deposits"
            />
            <Line 
              type="monotone" 
              dataKey="withdrawals" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Withdrawals"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionVolumeChart;