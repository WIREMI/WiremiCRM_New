import React, { useState } from 'react';
import { Target, Users, DollarSign, Calendar, Image, CheckCircle, ArrowRight } from 'lucide-react';
import { CampaignObjective, CampaignType, BidStrategy } from '../../../../types/campaign';

interface CreateCampaignWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: () => void;
}

const CreateCampaignWorkflow: React.FC<CreateCampaignWorkflowProps> = ({
  isOpen,
  onClose,
  onCampaignCreated
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    // Step 1: Basic Info
    name: '',
    description: '',
    objective: '',
    type: '',
    
    // Step 2: Targeting
    targetAudience: {
      demographics: {
        ageRange: { min: 18, max: 65 },
        gender: [] as string[],
        locations: [] as string[],
        interests: [] as string[]
      },
      behavioral: {
        customerSegments: [] as string[],
        engagementLevel: [] as string[]
      }
    },
    
    // Step 3: Budget & Schedule
    budget: {
      total: 0,
      daily: 0,
      currency: 'USD',
      bidStrategy: ''
    },
    schedule: {
      startDate: '',
      endDate: '',
      timezone: 'America/New_York'
    },
    
    // Step 4: Platforms & Creatives
    platforms: [] as string[],
    creatives: [] as any[]
  });

  const steps = [
    { id: 1, title: 'Campaign Details', icon: Target, description: 'Basic campaign information' },
    { id: 2, title: 'Target Audience', icon: Users, description: 'Define your audience' },
    { id: 3, title: 'Budget & Schedule', icon: DollarSign, description: 'Set budget and timing' },
    { id: 4, title: 'Platforms & Creatives', icon: Image, description: 'Choose platforms and assets' },
    { id: 5, title: 'Review & Launch', icon: CheckCircle, description: 'Final review and launch' }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      // TODO: Call API to create campaign
      console.log('Creating campaign:', campaignData);
      onCampaignCreated();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-100">Create New Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Steps Sidebar */}
          <div className="w-80 bg-gray-50 dark:bg-dark-700 p-6 border-r border-gray-200 dark:border-dark-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-6">Campaign Setup</h3>
            <div className="space-y-4">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                        : isCompleted
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'text-gray-600 dark:text-dark-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                    </div>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm opacity-75">{step.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-100">Campaign Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={campaignData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter campaign name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={campaignData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      placeholder="Describe your campaign goals and strategy..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Campaign Objective *
                      </label>
                      <select
                        value={campaignData.objective}
                        onChange={(e) => handleInputChange('objective', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      >
                        <option value="">Select objective...</option>
                        <option value={CampaignObjective.BRAND_AWARENESS}>Brand Awareness</option>
                        <option value={CampaignObjective.LEAD_GENERATION}>Lead Generation</option>
                        <option value={CampaignObjective.CONVERSIONS}>Conversions</option>
                        <option value={CampaignObjective.TRAFFIC}>Website Traffic</option>
                        <option value={CampaignObjective.ENGAGEMENT}>Engagement</option>
                        <option value={CampaignObjective.APP_INSTALLS}>App Installs</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Campaign Type *
                      </label>
                      <select
                        value={campaignData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      >
                        <option value="">Select type...</option>
                        <option value={CampaignType.SEARCH}>Search Ads</option>
                        <option value={CampaignType.DISPLAY}>Display Ads</option>
                        <option value={CampaignType.VIDEO}>Video Ads</option>
                        <option value={CampaignType.SOCIAL}>Social Media</option>
                        <option value={CampaignType.EMAIL}>Email Marketing</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-100">Target Audience</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Demographics</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Age Range
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="number"
                              value={campaignData.targetAudience.demographics.ageRange.min}
                              onChange={(e) => handleNestedInputChange('targetAudience', 'demographics', {
                                ...campaignData.targetAudience.demographics,
                                ageRange: { ...campaignData.targetAudience.demographics.ageRange, min: parseInt(e.target.value) }
                              })}
                              placeholder="Min age"
                              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                            <input
                              type="number"
                              value={campaignData.targetAudience.demographics.ageRange.max}
                              onChange={(e) => handleNestedInputChange('targetAudience', 'demographics', {
                                ...campaignData.targetAudience.demographics,
                                ageRange: { ...campaignData.targetAudience.demographics.ageRange, max: parseInt(e.target.value) }
                              })}
                              placeholder="Max age"
                              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Gender
                          </label>
                          <div className="flex space-x-4">
                            {['All', 'Male', 'Female', 'Other'].map(gender => (
                              <label key={gender} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={campaignData.targetAudience.demographics.gender.includes(gender)}
                                  onChange={(e) => {
                                    const newGender = e.target.checked
                                      ? [...campaignData.targetAudience.demographics.gender, gender]
                                      : campaignData.targetAudience.demographics.gender.filter(g => g !== gender);
                                    handleNestedInputChange('targetAudience', 'demographics', {
                                      ...campaignData.targetAudience.demographics,
                                      gender: newGender
                                    });
                                  }}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">{gender}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Locations
                          </label>
                          <select
                            multiple
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Behavioral Targeting</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Customer Segments
                          </label>
                          <div className="space-y-2">
                            {['New Customers', 'Existing Customers', 'VIP Customers', 'Inactive Customers'].map(segment => (
                              <label key={segment} className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">{segment}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Interests
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Finance', 'Technology', 'Investment', 'Savings', 'Banking', 'Crypto'].map(interest => (
                              <label key={interest} className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">{interest}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-100">Budget & Schedule</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Budget Settings</h4>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Total Budget *
                            </label>
                            <input
                              type="number"
                              value={campaignData.budget.total}
                              onChange={(e) => handleNestedInputChange('budget', 'total', parseFloat(e.target.value))}
                              placeholder="5000"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Daily Budget
                            </label>
                            <input
                              type="number"
                              value={campaignData.budget.daily}
                              onChange={(e) => handleNestedInputChange('budget', 'daily', parseFloat(e.target.value))}
                              placeholder="100"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Bid Strategy
                          </label>
                          <select
                            value={campaignData.budget.bidStrategy}
                            onChange={(e) => handleNestedInputChange('budget', 'bidStrategy', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          >
                            <option value="">Select bid strategy...</option>
                            <option value={BidStrategy.MANUAL_CPC}>Manual CPC</option>
                            <option value={BidStrategy.ENHANCED_CPC}>Enhanced CPC</option>
                            <option value={BidStrategy.TARGET_CPA}>Target CPA</option>
                            <option value={BidStrategy.TARGET_ROAS}>Target ROAS</option>
                            <option value={BidStrategy.MAXIMIZE_CLICKS}>Maximize Clicks</option>
                            <option value={BidStrategy.MAXIMIZE_CONVERSIONS}>Maximize Conversions</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Schedule</h4>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              value={campaignData.schedule.startDate}
                              onChange={(e) => handleNestedInputChange('schedule', 'startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={campaignData.schedule.endDate}
                              onChange={(e) => handleNestedInputChange('schedule', 'endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Timezone
                          </label>
                          <select
                            value={campaignData.schedule.timezone}
                            onChange={(e) => handleNestedInputChange('schedule', 'timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          >
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-100">Platforms & Creatives</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Select Platforms</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter/X', 'TikTok'].map(platform => (
                        <label key={platform} className="flex items-center p-4 border border-gray-200 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={campaignData.platforms.includes(platform)}
                            onChange={(e) => {
                              const newPlatforms = e.target.checked
                                ? [...campaignData.platforms, platform]
                                : campaignData.platforms.filter(p => p !== platform);
                              handleInputChange('platforms', newPlatforms);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-3 font-medium text-gray-900 dark:text-dark-100">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Creative Assets</h4>
                    <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center">
                      <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-dark-400 mb-4">
                        Upload your creative assets or use AI-generated content
                      </p>
                      <div className="flex justify-center space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Upload Assets
                        </button>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                          Generate with AI
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-100">Review & Launch</h3>
                
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Campaign Summary</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 dark:text-dark-400">Campaign Name:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100 ml-2">{campaignData.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-dark-400">Objective:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100 ml-2">{campaignData.objective}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-dark-400">Type:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100 ml-2">{campaignData.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-dark-400">Platforms:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100 ml-2">{campaignData.platforms.join(', ')}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 dark:text-dark-400">Total Budget:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100 ml-2">${campaignData.budget.total}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-dark-400">Daily Budget:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100 ml-2">${campaignData.budget.daily}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-dark-400">Start Date:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100 ml-2">{campaignData.schedule.startDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-dark-400">Age Range:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100 ml-2">
                          {campaignData.targetAudience.demographics.ageRange.min}-{campaignData.targetAudience.demographics.ageRange.max}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Ready to Launch</h5>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Your campaign is configured and ready to launch. Click "Launch Campaign" to start running your ads.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-dark-400">
              Step {currentStep} of {steps.length}
            </span>
          </div>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Target size={16} className="mr-2" />
              Launch Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignWorkflow;