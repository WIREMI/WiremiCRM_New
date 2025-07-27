import React, { useState } from 'react';
import { Send, Plus } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
}

interface QuickTransferProps {
  contacts: Contact[];
  onTransfer: (contactId: string, amount: number) => void;
}

const QuickTransferCard: React.FC<QuickTransferProps> = ({
  contacts,
  onTransfer
}) => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');

  const handleSend = () => {
    if (selectedContact && amount) {
      onTransfer(selectedContact, parseFloat(amount));
      setAmount('');
      setSelectedContact(null);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Quick Transfer</h3>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="12" cy="5" r="3" fill="currentColor"/>
            <circle cx="12" cy="19" r="3" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`flex flex-col items-center space-y-2 p-2 rounded-xl transition-colors ${
                selectedContact === contact.id
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-dark-600">
                <img 
                  src={contact.avatar} 
                  alt={contact.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-500 to-purple-600">${contact.name[0]}</div>`;
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-dark-300">
                {contact.name}
              </span>
            </button>
          ))}
          <button className="flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 dark:border-dark-600 flex items-center justify-center">
              <Plus size={20} className="text-gray-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-dark-400">Add</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Input Amount"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-400"
          />
          <div className="absolute left-4 top-3 text-gray-500 dark:text-dark-400">$</div>
        </div>

        <button
          onClick={handleSend}
          disabled={!selectedContact || !amount}
          className="w-full bg-gray-900 dark:bg-dark-200 text-white dark:text-dark-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-dark-300 focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <Send size={16} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default QuickTransferCard;