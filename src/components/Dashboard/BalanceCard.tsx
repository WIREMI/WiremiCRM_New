import React from 'react';
import { CreditCard, Eye, EyeOff } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  balance: number;
  cardNumber: string;
  type: 'primary' | 'secondary';
}

interface BalanceCardProps {
  totalBalance: number;
  cards: Card[];
  showBalance: boolean;
  onToggleBalance: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  cards,
  showBalance,
  onToggleBalance
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const maskCardNumber = (cardNumber: string) => {
    return `•••• •••• •••• ${cardNumber.slice(-4)}`;
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Total Balance</h3>
        <button
          onClick={onToggleBalance}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
        >
          {showBalance ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
        </button>
      </div>

      <div className="mb-8">
        <div className="text-4xl font-bold text-gray-900 dark:text-dark-100 mb-2">
          {showBalance ? formatCurrency(totalBalance) : '••••••••'}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-600 dark:text-dark-400 mb-3">Your Cards</h4>
        {cards.map((card) => (
          <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-8 rounded-lg flex items-center justify-center ${
                card.type === 'primary' 
                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                  : 'bg-gradient-to-r from-blue-400 to-blue-500'
              }`}>
                <CreditCard size={16} className="text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-dark-100">
                  {showBalance ? formatCurrency(card.balance) : '••••••'}
                </div>
                <div className="text-sm text-gray-500 dark:text-dark-400">
                  {maskCardNumber(card.cardNumber)}
                </div>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BalanceCard;