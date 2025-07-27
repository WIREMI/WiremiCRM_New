import React, { useState } from 'react';
import { Eye, MoreVertical, CreditCard } from 'lucide-react';
import { VirtualCardDetailed } from '../../../types';
import VirtualCardDetail from './VirtualCardDetail';

interface VirtualCardListProps {
  cards: VirtualCardDetailed[];
  loading: boolean;
  onCardUpdated: () => void;
}

const VirtualCardList: React.FC<VirtualCardListProps> = ({ cards, loading, onCardUpdated }) => {
  const [selectedCard, setSelectedCard] = useState<VirtualCardDetailed | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      TERMINATED: 'bg-red-100 text-red-800',
      BLOCKED: 'bg-yellow-100 text-yellow-800',
      PENDING: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getBrandIcon = (brand: string) => {
    // In a real app, you'd use actual brand logos
    const colors = {
      VISA: 'text-blue-600',
      MASTERCARD: 'text-red-600',
      AMEX: 'text-green-600',
      VERVE: 'text-purple-600'
    };
    return colors[brand as keyof typeof colors] || 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewCard = (card: VirtualCardDetailed) => {
    setSelectedCard(card);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Card Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Wiremi ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Transaction Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            {cards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-12 h-8 rounded-lg flex items-center justify-center ${
                      card.cardBrand === 'VISA' ? 'bg-blue-100' :
                      card.cardBrand === 'MASTERCARD' ? 'bg-red-100' :
                      card.cardBrand === 'AMEX' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <CreditCard size={16} className={getBrandIcon(card.cardBrand)} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {card.cardNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-dark-400">
                        {card.cardBrand} • {card.cardType} • Exp: {card.expiryDate}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                    {card.userId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-dark-100">
                    {formatDate(card.issueDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                    {formatCurrency(card.transactionVolume)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-dark-400">
                    {card.transactions.length} transactions
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(card.status)}`}>
                    {card.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewCard(card)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                      title="More Actions"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <VirtualCardDetail
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          card={selectedCard}
          onCardUpdated={onCardUpdated}
        />
      )}
    </>
  );
};

export default VirtualCardList;