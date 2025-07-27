import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Users, DollarSign, Activity, XCircle } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';
import VirtualCardList from './components/VirtualCardList';
import IssueCardModal from './components/IssueCardModal';
import { VirtualCardDetailed } from '../../types';

const VirtualCards: React.FC = () => {
  const [cards, setCards] = useState<VirtualCardDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [stats, setStats] = useState({
    totalIssued: 0,
    activeCards: 0,
    terminatedCards: 0,
    transactionVolume: 0
  });

  useEffect(() => {
    loadCardsData();
  }, []);

  const loadCardsData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [cardsResponse, statsResponse] = await Promise.all([
      //   fetch('/api/v1/cards'),
      //   fetch('/api/v1/cards/stats')
      // ]);
      
      // Mock data for demonstration
      const mockCards: VirtualCardDetailed[] = Array.from({ length: 15 }, (_, i) => ({
        id: `card-${i + 1}`,
        userId: `WRM${String(i + 1).padStart(6, '0')}`,
        cardNumber: `****-****-****-${String(1234 + i).slice(-4)}`,
        cardBrand: ['VISA', 'MASTERCARD', 'AMEX'][i % 3] as any,
        cardType: ['VIRTUAL', 'DEBIT'][i % 2] as any,
        expiryDate: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/2${7 + Math.floor(i / 3)}`,
        cvv: '***',
        status: ['ACTIVE', 'TERMINATED', 'BLOCKED'][i % 3] as any,
        issueDate: new Date(Date.now() - i * 86400000 * 30).toISOString(),
        terminationDate: i % 3 === 1 ? new Date(Date.now() - i * 86400000 * 10).toISOString() : undefined,
        spendLimit: 5000 + (i * 1000),
        transactionVolume: Math.random() * 10000 + 1000,
        isActive: i % 3 !== 1,
        createdAt: new Date(Date.now() - i * 86400000 * 30).toISOString(),
        updatedAt: new Date().toISOString(),
        transactions: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, j) => ({
          id: `tx-${i}-${j}`,
          virtualCardId: `card-${i + 1}`,
          transactionId: `txn-${i}-${j}`,
          description: ['Netflix Subscription', 'Card Funding', 'Amazon Purchase', 'Spotify Premium', 'Uber Ride'][j % 5],
          amount: Math.random() * 500 + 10,
          currency: 'USD',
          timestamp: new Date(Date.now() - j * 86400000 * 7).toISOString(),
          status: ['SUCCESS', 'PROCESSING', 'FAILED'][j % 3] as any
        }))
      }));

      const mockStats = {
        totalIssued: mockCards.length,
        activeCards: mockCards.filter(card => card.status === 'ACTIVE').length,
        terminatedCards: mockCards.filter(card => card.status === 'TERMINATED').length,
        transactionVolume: mockCards.reduce((sum, card) => sum + card.transactionVolume, 0)
      };

      setCards(mockCards);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load cards data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueCard = async (cardData: any) => {
    try {
      // TODO: Call API to issue new card
      console.log('Issuing new card:', cardData);
      setShowIssueModal(false);
      loadCardsData(); // Refresh data
    } catch (error) {
      console.error('Failed to issue card:', error);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Virtual Cards & Wallets" 
        subtitle="Manage virtual cards, monitor transactions, and track card performance"
        actions={
          <button
            onClick={() => setShowIssueModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Issue New Card
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Cards Issued"
          value={stats.totalIssued.toLocaleString()}
          change="+12 this month"
          changeType="positive"
          icon={CreditCard}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Transaction Volume"
          value={`$${(stats.transactionVolume / 1000).toFixed(1)}K`}
          change="+23% this week"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Active Cards"
          value={stats.activeCards.toLocaleString()}
          change="+8 new today"
          changeType="positive"
          icon={Activity}
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Terminated Cards"
          value={stats.terminatedCards.toLocaleString()}
          change="-2 this week"
          changeType="positive"
          icon={XCircle}
          iconColor="text-red-500"
        />
      </div>

      {/* Cards List */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Virtual Cards</h3>
          <p className="text-sm text-gray-600 dark:text-dark-400 mt-1">
            {cards.length} cards total • {stats.activeCards} active • {stats.terminatedCards} terminated
          </p>
        </div>
        
        <VirtualCardList 
          cards={cards} 
          loading={isLoading}
          onCardUpdated={loadCardsData}
        />
      </div>

      {/* Issue Card Modal */}
      {showIssueModal && (
        <IssueCardModal
          isOpen={showIssueModal}
          onClose={() => setShowIssueModal(false)}
          onIssue={handleIssueCard}
        />
      )}
    </div>
  );
};

export default VirtualCards;