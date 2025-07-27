import React, { useState, useEffect } from 'react';
import { MessageSquare, Flag, Star, AlertTriangle, Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface CustomerNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isInternal: boolean;
}

interface CustomerFlag {
  id: string;
  type: 'VIP' | 'ABUSE' | 'RISK' | 'PRIORITY';
  reason: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

interface NotesFlagsTabProps {
  customerId: string;
}

const NotesFlagsTab: React.FC<NotesFlagsTabProps> = ({ customerId }) => {
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [flags, setFlags] = useState<CustomerFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddFlag, setShowAddFlag] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newFlag, setNewFlag] = useState({
    type: 'VIP' as const,
    reason: ''
  });

  useEffect(() => {
    loadNotesAndFlags();
  }, [customerId]);

  const loadNotesAndFlags = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [notesResponse, flagsResponse] = await Promise.all([
      //   fetch(`/api/customers/${customerId}/notes`),
      //   fetch(`/api/customers/${customerId}/flags`)
      // ]);
      
      // Mock data for demonstration
      const mockNotes: CustomerNote[] = [
        {
          id: 'note-1',
          content: 'Customer called regarding transaction issue. Resolved by updating payment method.',
          createdBy: 'agent-john',
          createdAt: '2024-01-20T14:30:00Z',
          isInternal: false
        },
        {
          id: 'note-2',
          content: 'Internal note: Customer has been flagged for high-value transactions. Monitor closely.',
          createdBy: 'admin-sarah',
          createdAt: '2024-01-18T09:15:00Z',
          isInternal: true
        },
        {
          id: 'note-3',
          content: 'Customer provided excellent feedback about our mobile app. Consider for testimonial.',
          createdBy: 'support-mike',
          createdAt: '2024-01-15T16:45:00Z',
          isInternal: false
        }
      ];

      const mockFlags: CustomerFlag[] = [
        {
          id: 'flag-1',
          type: 'VIP',
          reason: 'High-value customer with premium account',
          createdBy: 'admin-sarah',
          createdAt: '2024-01-10T10:00:00Z',
          isActive: true
        },
        {
          id: 'flag-2',
          type: 'PRIORITY',
          reason: 'Customer escalated to priority support due to business account',
          createdBy: 'manager-alex',
          createdAt: '2024-01-12T11:30:00Z',
          isActive: true
        }
      ];

      setNotes(mockNotes);
      setFlags(mockFlags);
    } catch (error) {
      console.error('Failed to load notes and flags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/customers/${customerId}/notes`, {
      //   method: 'POST',
      //   body: JSON.stringify({ content: newNote, isInternal: false })
      // });

      const note: CustomerNote = {
        id: `note-${Date.now()}`,
        content: newNote,
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        isInternal: false
      };

      setNotes(prev => [note, ...prev]);
      setNewNote('');
      setShowAddNote(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleAddFlag = async () => {
    if (!newFlag.reason.trim()) return;

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/customers/${customerId}/flags`, {
      //   method: 'POST',
      //   body: JSON.stringify(newFlag)
      // });

      const flag: CustomerFlag = {
        id: `flag-${Date.now()}`,
        type: newFlag.type,
        reason: newFlag.reason,
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        isActive: true
      };

      setFlags(prev => [flag, ...prev]);
      setNewFlag({ type: 'VIP', reason: '' });
      setShowAddFlag(false);
    } catch (error) {
      console.error('Failed to add flag:', error);
    }
  };

  const handleRemoveFlag = async (flagId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/customers/${customerId}/flags/${flagId}`, { method: 'DELETE' });

      setFlags(prev => prev.filter(flag => flag.id !== flagId));
    } catch (error) {
      console.error('Failed to remove flag:', error);
    }
  };

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'VIP':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'ABUSE':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'RISK':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'PRIORITY':
        return <Flag className="w-4 h-4 text-blue-500" />;
      default:
        return <Flag className="w-4 h-4 text-gray-500" />;
    }
  };

  const getFlagBadge = (type: string) => {
    const colors = {
      VIP: 'bg-yellow-100 text-yellow-800',
      ABUSE: 'bg-red-100 text-red-800',
      RISK: 'bg-orange-100 text-orange-800',
      PRIORITY: 'bg-blue-100 text-blue-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Flags */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 flex items-center">
            <Flag className="mr-2 text-red-500" size={20} />
            Customer Flags
          </h4>
          <button
            onClick={() => setShowAddFlag(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm"
          >
            <Plus size={16} className="mr-2" />
            Add Flag
          </button>
        </div>

        {showAddFlag && (
          <div className="bg-white dark:bg-dark-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-dark-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Flag Type
                </label>
                <select
                  value={newFlag.type}
                  onChange={(e) => setNewFlag(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                >
                  <option value="VIP">VIP</option>
                  <option value="ABUSE">Abuse</option>
                  <option value="RISK">Risk</option>
                  <option value="PRIORITY">Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={newFlag.reason}
                  onChange={(e) => setNewFlag(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for flag..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddFlag}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Flag
              </button>
              <button
                onClick={() => setShowAddFlag(false)}
                className="border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {flags.length > 0 ? (
          <div className="space-y-3">
            {flags.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
                <div className="flex items-center space-x-3">
                  {getFlagIcon(flag.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFlagBadge(flag.type)}`}>
                        {flag.type}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {flag.reason}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-dark-400">
                      Added by {flag.createdBy} on {formatDate(flag.createdAt)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFlag(flag.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Flag className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-dark-400">No flags set for this customer</p>
          </div>
        )}
      </div>

      {/* Customer Notes */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 flex items-center">
            <MessageSquare className="mr-2 text-blue-500" size={20} />
            Customer Notes
          </h4>
          <button
            onClick={() => setShowAddNote(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
          >
            <Plus size={16} className="mr-2" />
            Add Note
          </button>
        </div>

        {showAddNote && (
          <div className="bg-white dark:bg-dark-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-dark-600">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note about this customer..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100 resize-none"
            />
            <div className="flex space-x-3 mt-3">
              <button
                onClick={handleAddNote}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Note
              </button>
              <button
                onClick={() => setShowAddNote(false)}
                className="border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare size={16} className="text-blue-500" />
                      {note.isInternal && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          Internal
                        </span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-dark-400">
                        by {note.createdBy}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-dark-400">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-dark-100">
                      {note.content}
                    </p>
                  </div>
                  <div className="flex space-x-1 ml-4">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300 p-1">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-dark-400">No notes added for this customer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesFlagsTab;