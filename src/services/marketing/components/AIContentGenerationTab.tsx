import React, { useState } from 'react';
import { Brain, Wand2, FileText, Video, Image, MessageSquare, Sparkles, Download, Eye, Edit, Trash2, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

interface ContentGenerationJob {
  id: string;
  type: 'text' | 'video' | 'graphic' | 'social_media';
  prompt: string;
  status: 'generating' | 'completed' | 'failed' | 'pending_approval' | 'approved' | 'rejected';
  generatedContent?: any;
  createdAt: string;
  completedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

const AIContentGenerationTab: React.FC = () => {
  const [activeContentType, setActiveContentType] = useState<'text' | 'video' | 'graphic' | 'social_media'>('text');
  const [prompt, setPrompt] = useState('');
  const [contentJobs, setContentJobs] = useState<ContentGenerationJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ContentGenerationJob | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Content type configurations
  const contentTypes = [
    {
      id: 'text' as const,
      label: 'Text Content',
      icon: FileText,
      description: 'Generate ad copy, social media captions, email content',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'video' as const,
      label: 'Video Content',
      icon: Video,
      description: 'Create marketing videos from scripts and ideas',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      id: 'graphic' as const,
      label: 'Graphics & Flyers',
      icon: Image,
      description: 'Design flyers, banners, and marketing graphics',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'social_media' as const,
      label: 'Social Media Posts',
      icon: MessageSquare,
      description: 'Multi-platform social media content creation',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    }
  ];

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt for content generation.');
      return;
    }

    setIsGenerating(true);
    try {
      // Create new job
      const newJob: ContentGenerationJob = {
        id: `job-${Date.now()}`,
        type: activeContentType,
        prompt: prompt.trim(),
        status: 'generating',
        createdAt: new Date().toISOString()
      };

      setContentJobs(prev => [newJob, ...prev]);

      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock generated content based on type
      let generatedContent;
      switch (activeContentType) {
        case 'text':
          generatedContent = {
            adCopy: `Transform your financial future with Wiremi's innovative savings solutions. Start saving smarter today!`,
            socialCaption: `💰 Ready to level up your savings game? Wiremi makes it easy to reach your financial goals! #SaveSmart #FinTech #WiremiSavings`,
            emailSubject: `Unlock Your Savings Potential - Limited Time Offer!`,
            cta: `Start Saving Now`
          };
          break;
        case 'video':
          generatedContent = {
            script: `Scene 1: Show person struggling with traditional banking. Scene 2: Introduce Wiremi app. Scene 3: Show easy savings features. Scene 4: Call to action.`,
            duration: '30 seconds',
            voiceover: 'Professional female voice',
            style: 'Modern and clean'
          };
          break;
        case 'graphic':
          generatedContent = {
            design: 'Modern gradient background with Wiremi logo',
            dimensions: '1080x1080px (Instagram Square)',
            colorScheme: 'Blue and purple gradient',
            elements: ['Logo', 'Headline', 'CTA Button', 'Background graphics']
          };
          break;
        case 'social_media':
          generatedContent = {
            platforms: {
              facebook: `Discover the power of smart saving with Wiremi! Our AI-powered platform helps you reach your financial goals faster. Join thousands of satisfied customers today! 🚀💰`,
              twitter: `Smart saving made simple with @Wiremi 💡 AI-powered financial goals that actually work! #FinTech #Savings #SmartMoney`,
              linkedin: `Professional financial management starts with smart saving strategies. Wiremi's enterprise-grade platform delivers results for individuals and businesses alike.`,
              instagram: `✨ Your financial dreams, our AI magic ✨ Save smarter with Wiremi! 💰📱 #WiremiSavings #FinTech #MoneyGoals`
            }
          };
          break;
      }

      // Update job with generated content
      setContentJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { 
              ...job, 
              status: 'pending_approval', 
              generatedContent,
              completedAt: new Date().toISOString()
            }
          : job
      ));

      setPrompt('');
    } catch (error) {
      console.error('Content generation failed:', error);
      // Update job status to failed
      setContentJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'failed' }
          : job
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveContent = async (jobId: string) => {
    setContentJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: 'approved',
            approvedBy: 'current-admin'
          }
        : job
    ));
  };

  const handleRejectContent = async (jobId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setContentJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { 
              ...job, 
              status: 'rejected',
              rejectionReason: reason
            }
          : job
      ));
    }
  };

  const handlePreviewContent = (job: ContentGenerationJob) => {
    setSelectedJob(job);
    setShowPreviewModal(true);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      generating: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending_approval':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeType = contentTypes.find(type => type.id === activeContentType)!;

  return (
    <div className="space-y-6">
      {/* AI Content Generation Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">AI-Powered Content Generation</h3>
            <p className="text-purple-100">Transform your marketing ideas into professional content with AI</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-purple-100">Content Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-purple-100">Approval Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-purple-100">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">2.3s</div>
            <div className="text-sm text-purple-100">Avg Generation Time</div>
          </div>
        </div>
      </div>

      {/* Content Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setActiveContentType(type.id)}
              className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                activeContentType === type.id
                  ? `${type.bgColor} ${type.borderColor}`
                  : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600'
              }`}
            >
              <div className="text-center">
                <Icon size={32} className={`mx-auto mb-3 ${activeContentType === type.id ? type.color : 'text-gray-400'}`} />
                <h4 className={`font-semibold mb-2 ${
                  activeContentType === type.id ? 'text-gray-900 dark:text-dark-100' : 'text-gray-700 dark:text-dark-300'
                }`}>
                  {type.label}
                </h4>
                <p className={`text-sm ${
                  activeContentType === type.id ? 'text-gray-700 dark:text-dark-300' : 'text-gray-500 dark:text-dark-400'
                }`}>
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content Generation Form */}
      <div className={`rounded-lg border-2 p-6 ${activeType.bgColor} ${activeType.borderColor}`}>
        <div className="flex items-center space-x-3 mb-4">
          <activeType.icon className={`w-6 h-6 ${activeType.color}`} />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
            Generate {activeType.label}
          </h4>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Marketing Idea / Prompt *
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe your ${activeType.label.toLowerCase()} idea. For example: "Create a campaign promoting our new virtual cards for young professionals, emphasizing convenience and security."`}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Content Type Specific Options */}
          {activeContentType === 'text' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Tone
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="urgent">Urgent</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Target Audience
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="young_professionals">Young Professionals</option>
                  <option value="families">Families</option>
                  <option value="students">Students</option>
                  <option value="business_owners">Business Owners</option>
                  <option value="general">General Audience</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Content Length
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="short">Short (50-100 words)</option>
                  <option value="medium">Medium (100-200 words)</option>
                  <option value="long">Long (200+ words)</option>
                </select>
              </div>
            </div>
          )}

          {activeContentType === 'video' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Video Duration
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="120">2 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Video Style
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="explainer">Explainer</option>
                  <option value="promotional">Promotional</option>
                  <option value="testimonial">Testimonial</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Voiceover
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="female_professional">Female Professional</option>
                  <option value="male_professional">Male Professional</option>
                  <option value="female_casual">Female Casual</option>
                  <option value="male_casual">Male Casual</option>
                </select>
              </div>
            </div>
          )}

          {activeContentType === 'graphic' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Graphic Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="social_post">Social Media Post</option>
                  <option value="banner">Web Banner</option>
                  <option value="flyer">Marketing Flyer</option>
                  <option value="infographic">Infographic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Dimensions
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="1080x1080">Instagram Square (1080x1080)</option>
                  <option value="1080x1920">Instagram Story (1080x1920)</option>
                  <option value="1200x630">Facebook Post (1200x630)</option>
                  <option value="1024x512">Twitter Header (1024x512)</option>
                  <option value="custom">Custom Dimensions</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Color Scheme
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="brand">Brand Colors</option>
                  <option value="blue_purple">Blue & Purple</option>
                  <option value="green_teal">Green & Teal</option>
                  <option value="orange_red">Orange & Red</option>
                  <option value="monochrome">Monochrome</option>
                </select>
              </div>
            </div>
          )}

          {activeContentType === 'social_media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Target Platforms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Facebook', 'Instagram', 'Twitter/X', 'LinkedIn', 'TikTok', 'YouTube'].map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={['Facebook', 'Instagram', 'Twitter/X', 'LinkedIn'].includes(platform)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Campaign Objective
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
                  <option value="awareness">Brand Awareness</option>
                  <option value="engagement">Engagement</option>
                  <option value="traffic">Drive Traffic</option>
                  <option value="leads">Generate Leads</option>
                  <option value="conversions">Drive Conversions</option>
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateContent}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={20} className="mr-3 animate-spin" />
                Generating {activeType.label}...
              </>
            ) : (
              <>
                <Sparkles size={20} className="mr-3" />
                Generate {activeType.label} with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Content Jobs */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
            Content Generation History
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Content Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Prompt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {contentJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-dark-400">No content generated yet</p>
                    <p className="text-sm text-gray-400 dark:text-dark-500">Start by entering a marketing idea above</p>
                  </td>
                </tr>
              ) : (
                contentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {contentTypes.find(t => t.id === job.type)?.icon && (
                          React.createElement(contentTypes.find(t => t.id === job.type)!.icon, {
                            size: 16,
                            className: contentTypes.find(t => t.id === job.type)!.color
                          })
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-dark-100 capitalize">
                          {job.type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-dark-100 max-w-xs truncate">
                        {job.prompt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(job.status)}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {(job.status === 'completed' || job.status === 'pending_approval' || job.status === 'approved') && (
                          <button
                            onClick={() => handlePreviewContent(job)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            title="Preview Content"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {job.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => handleApproveContent(job.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleRejectContent(job.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                              title="Reject"
                            >
                              <AlertTriangle size={16} />
                            </button>
                          </>
                        )}
                        {job.status === 'approved' && (
                          <button
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Preview Modal */}
      {selectedJob && showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                AI Generated Content Preview
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Job Info */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-dark-400">Content Type</p>
                    <p className="font-medium text-gray-900 dark:text-dark-100 capitalize">
                      {selectedJob.type.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-dark-400">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedJob.status)}`}>
                      {selectedJob.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-dark-400">Generated</p>
                    <p className="font-medium text-gray-900 dark:text-dark-100">
                      {formatDate(selectedJob.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-dark-400">Original Prompt</p>
                  <p className="font-medium text-gray-900 dark:text-dark-100">
                    {selectedJob.prompt}
                  </p>
                </div>
              </div>

              {/* Generated Content Display */}
              {selectedJob.generatedContent && (
                <div className="space-y-4">
                  {selectedJob.type === 'text' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Ad Copy</h5>
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          {selectedJob.generatedContent.adCopy}
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">Social Media Caption</h5>
                        <p className="text-green-800 dark:text-green-200 text-sm">
                          {selectedJob.generatedContent.socialCaption}
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Email Subject</h5>
                        <p className="text-purple-800 dark:text-purple-200 text-sm">
                          {selectedJob.generatedContent.emailSubject}
                        </p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                        <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Call to Action</h5>
                        <p className="text-orange-800 dark:text-orange-200 text-sm">
                          {selectedJob.generatedContent.cta}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedJob.type === 'social_media' && (
                    <div className="space-y-4">
                      {Object.entries(selectedJob.generatedContent.platforms).map(([platform, content]) => (
                        <div key={platform} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-2 capitalize">
                            {platform}
                          </h5>
                          <p className="text-gray-800 dark:text-dark-200 text-sm">
                            {content as string}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedJob.type === 'video' && (
                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-4">Video Script & Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400 mb-2">Script</p>
                          <p className="text-gray-800 dark:text-dark-200 text-sm">
                            {selectedJob.generatedContent.script}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-dark-400">Duration</p>
                            <p className="font-medium text-gray-900 dark:text-dark-100">
                              {selectedJob.generatedContent.duration}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-dark-400">Voiceover</p>
                            <p className="font-medium text-gray-900 dark:text-dark-100">
                              {selectedJob.generatedContent.voiceover}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-dark-400">Style</p>
                            <p className="font-medium text-gray-900 dark:text-dark-100">
                              {selectedJob.generatedContent.style}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedJob.type === 'graphic' && (
                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-4">Graphic Design Specifications</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400 mb-2">Design Description</p>
                          <p className="text-gray-800 dark:text-dark-200 text-sm">
                            {selectedJob.generatedContent.design}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-dark-400">Dimensions</p>
                            <p className="font-medium text-gray-900 dark:text-dark-100">
                              {selectedJob.generatedContent.dimensions}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-dark-400">Color Scheme</p>
                            <p className="font-medium text-gray-900 dark:text-dark-100">
                              {selectedJob.generatedContent.colorScheme}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-dark-400">Elements</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedJob.generatedContent.elements.map((element: string, index: number) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  {element}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Approval Actions */}
              {selectedJob.status === 'pending_approval' && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-dark-700">
                  <button
                    onClick={() => handleRejectContent(selectedJob.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Content
                  </button>
                  <button
                    onClick={() => handleApproveContent(selectedJob.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Content
                  </button>
                </div>
              )}

              {selectedJob.status === 'rejected' && selectedJob.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">Rejection Reason</h5>
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {selectedJob.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerationTab;