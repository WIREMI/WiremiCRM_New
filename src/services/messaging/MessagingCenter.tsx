import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, Plus, Users, Clock, Star, Paperclip, Phone, Video, MoreVertical } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  messages: Message[];
}

interface MessagingStats {
  totalConversations: number;
  unreadMessages: number;
  activeUsers: number;
  averageResponseTime: string;
}

const MessagingCenter: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messagingStats, setMessagingStats] = useState<MessagingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  useEffect(() => {
    loadMessagingData();
  }, []);

  const loadMessagingData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [conversationsResponse, statsResponse] = await Promise.all([
      //   fetch('/api/v1/messaging/conversations'),
      //   fetch('/api/v1/messaging/stats')
      // ]);
      
      // Mock data for demonstration
      const mockStats: MessagingStats = {
        totalConversations: 156,
        unreadMessages: 23,
        activeUsers: 45,
        averageResponseTime: '2.3 hours'
      };

      const mockConversations: Conversation[] = Array.from({ length: 15 }, (_, i) => ({
        id: `conv-${i + 1}`,
        participantId: `user-${i + 1}`,
        participantName: [
          'John Smith', 'Sarah Wilson', 'Mike Johnson', 'Lisa Martinez', 'Tom Anderson',
          'Emma Davis', 'Alex Chen', 'Maria Garcia', 'David Brown', 'Jennifer Lee',
          'Robert Taylor', 'Amanda White', 'Chris Martin', 'Nicole Thompson', 'Kevin Clark'
        ][i],
        participantAvatar: `https://images.pexels.com/photos/${2379004 + i}/pexels-photo-${2379004 + i}.jpeg?auto=compress&cs=tinysrgb&w=150`,
        participantRole: ['Customer', 'Admin', 'Support Agent', 'Finance Manager', 'Compliance Officer'][i % 5],
        lastMessage: [
          'Thank you for your help with the transaction issue.',
          'Can you please review the KYC documents?',
          'The customer is asking about withdrawal limits.',
          'Monthly reconciliation report is ready.',
          'New compliance alert requires attention.',
          'Payment gateway integration is complete.',
          'Customer feedback on mobile app features.',
          'Security audit findings need review.',
          'New user registration spike detected.',
          'API rate limits need adjustment.',
          'Database backup completed successfully.',
          'Marketing campaign performance update.',
          'System maintenance scheduled for tonight.',
          'Customer support ticket escalated.',
          'Financial report discrepancy found.'
        ][i],
        lastMessageTime: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        unreadCount: Math.floor(Math.random() * 5),
        isOnline: Math.random() > 0.5,
        isPinned: i < 3,
        messages: Array.from({ length: Math.floor(Math.random() * 10) + 3 }, (_, j) => ({
          id: `msg-${i}-${j}`,
          senderId: j % 2 === 0 ? `user-${i + 1}` : 'current-user',
          senderName: j % 2 === 0 ? [
            'John Smith', 'Sarah Wilson', 'Mike Johnson', 'Lisa Martinez', 'Tom Anderson',
            'Emma Davis', 'Alex Chen', 'Maria Garcia', 'David Brown', 'Jennifer Lee',
            'Robert Taylor', 'Amanda White', 'Chris Martin', 'Nicole Thompson', 'Kevin Clark'
          ][i] : 'You',
          content: [
            'Hello, I need help with my account.',
            'Sure, I can help you with that.',
            'What specific issue are you experiencing?',
            'I cannot access my virtual card.',
            'Let me check your account status.',
            'Your card is active. Try refreshing the app.',
            'That worked! Thank you so much.',
            'You\'re welcome! Is there anything else?',
            'No, that\'s all for now.',
            'Great! Have a wonderful day.'
          ][j % 10],
          timestamp: new Date(Date.now() - (10 - j) * 3600000).toISOString(),
          isRead: true
        }))
      }));

      setMessagingStats(mockStats);
      setConversations(mockConversations);
      
      // Auto-select first conversation
      if (mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error('Failed to load messaging data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true
    };

    // Update conversation with new message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { 
            ...conv, 
            messages: [...conv.messages, message],
            lastMessage: newMessage,
            lastMessageTime: new Date().toISOString()
          }
        : conv
    ));

    // Update selected conversation
    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date().toISOString()
    } : null);

    setNewMessage('');

    try {
      // TODO: Call API to send message
      console.log('Sending message:', message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewConversation = () => {
    setShowNewMessageModal(true);
  };

  const handleMarkAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-400">Loading messaging center...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Messaging & Communication Center" 
        subtitle="Manage internal communications, customer support, and team collaboration"
        actions={
          <div className="flex space-x-3">
            <button
              onClick={handleNewConversation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              New Message
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      {messagingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Conversations"
            value={messagingStats.totalConversations.toString()}
            change="+12 new today"
            changeType="positive"
            icon={MessageCircle}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Unread Messages"
            value={messagingStats.unreadMessages.toString()}
            change="+5 in last hour"
            changeType="neutral"
            icon={MessageCircle}
            iconColor="text-orange-500"
          />
          <StatsCard
            title="Active Users"
            value={messagingStats.activeUsers.toString()}
            change="+8% this week"
            changeType="positive"
            icon={Users}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Avg Response Time"
            value={messagingStats.averageResponseTime}
            change="-15min improvement"
            changeType="positive"
            icon={Clock}
            iconColor="text-purple-500"
          />
        </div>
      )}

      {/* Messaging Interface */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 h-[600px] flex">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r border-gray-200 dark:border-dark-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation);
                  handleMarkAsRead(conversation.id);
                }}
                className={`p-4 border-b border-gray-200 dark:border-dark-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {conversation.participantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-dark-100 truncate">
                          {conversation.participantName}
                        </p>
                        {conversation.isPinned && (
                          <Star size={12} className="text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-dark-500">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-dark-500 mb-1">
                      {conversation.participantRole}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-dark-400 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    {selectedConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-100">
                      {selectedConversation.participantName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-dark-500">
                      {selectedConversation.participantRole} • {selectedConversation.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700">
                    <Phone size={16} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700">
                    <Video size={16} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'current-user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-dark-100'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'current-user' ? 'text-blue-100' : 'text-gray-500 dark:text-dark-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-dark-700">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700">
                    <Paperclip size={16} />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-dark-400">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              New Message
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              New message composition form will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingCenter;