import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Upload, User, Award, Calendar, Filter, RefreshCw, Activity } from 'lucide-react';

const SPUActivityFeed = ({
  activities = [],
  onRefresh,
  isLoading = false,
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [filterAction, setFilterAction] = useState('all');
  const [showCount, setShowCount] = useState(10);

  // Action type configuration
  const actionTypes = {
    all: { label: 'All Activities', icon: Activity, color: 'text-gray-600' },
    submitted: { label: 'Submitted', icon: Upload, color: 'text-blue-600', bg: 'bg-blue-100' },
    verified: { label: 'Verified', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    assigned: { label: 'Assigned', icon: User, color: 'text-purple-600', bg: 'bg-purple-100' }
  };

  // Auto-refresh effect
  React.useEffect(() => {
    if (autoRefresh && onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, onRefresh, refreshInterval]);

  // Filter activities
  const filteredActivities = activities.filter(activity => 
    filterAction === 'all' || activity.action === filterAction
  );

  // Get visible activities
  const visibleActivities = filteredActivities.slice(0, showCount);
  const hasMore = filteredActivities.length > showCount;

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Get action details
  const getActionDetails = (activity) => {
    const config = actionTypes[activity.action] || actionTypes.submitted;
    return config;
  };

  // Get activity description
  const getActivityDescription = (activity) => {
    switch (activity.action) {
      case 'submitted':
        return `submitted SPU for verification`;
      case 'verified':
        return `verified by ${activity.verifier_name}`;
      case 'rejected':
        return `rejected by ${activity.verifier_name}`;
      case 'assigned':
        return `assigned to ${activity.verifier_name}`;
      default:
        return 'unknown action';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Activity className="w-7 h-7 text-indigo-600" />
              SPU Activity Feed
            </h2>
            <p className="text-gray-600 text-sm">
              Real-time updates on SPU submissions and verifications
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-medium text-gray-700 hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium mb-1">Submitted</p>
            <p className="text-2xl font-bold text-blue-900">
              {activities.filter(a => a.action === 'submitted').length}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-600 font-medium mb-1">Verified</p>
            <p className="text-2xl font-bold text-green-900">
              {activities.filter(a => a.action === 'verified').length}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-600 font-medium mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-900">
              {activities.filter(a => a.action === 'rejected').length}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs text-purple-600 font-medium mb-1">Assigned</p>
            <p className="text-2xl font-bold text-purple-900">
              {activities.filter(a => a.action === 'assigned').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {Object.entries(actionTypes).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilterAction(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  filterAction === key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <config.icon className="w-4 h-4" />
                {config.label}
                {key !== 'all' && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    filterAction === key ? 'bg-white bg-opacity-30' : 'bg-gray-200'
                  }`}>
                    {activities.filter(a => a.action === key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {isLoading && activities.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading activities...</p>
          </div>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No activities yet
          </h3>
          <p className="text-gray-600">
            {filterAction === 'all' 
              ? 'SPU activities will appear here as they happen'
              : `No ${actionTypes[filterAction].label.toLowerCase()} activities found`
            }
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleActivities.map((activity, index) => {
              const actionDetails = getActionDetails(activity);
              const ActionIcon = actionDetails.icon;
              const isNew = index < 3 && filterAction === 'all'; // Highlight first 3 in all view

              return (
                <div
                  key={activity.id}
                  className={`bg-white rounded-lg border-2 transition-all ${
                    isNew 
                      ? 'border-indigo-400 shadow-md' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        actionDetails.bg || 'bg-gray-100'
                      }`}>
                        <ActionIcon className={`w-5 h-5 ${actionDetails.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-medium">
                              <span className="font-bold">{activity.learner_name}</span>
                              {' '}{getActivityDescription(activity)}
                            </p>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              <Award className="w-3.5 h-3.5 inline mr-1" />
                              {activity.skill_title}
                            </p>
                          </div>
                          {isNew && (
                            <span className="flex-shrink-0 px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">
                              NEW
                            </span>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTimestamp(activity.timestamp)}
                          </div>
                          {activity.context_type && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">
                              {activity.context_type}
                            </span>
                          )}
                          {activity.depth_level && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">
                              Level {activity.depth_level}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowCount(prev => prev + 10)}
                className="px-6 py-2 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Load More ({filteredActivities.length - showCount} remaining)
              </button>
            </div>
          )}

          {/* Auto-refresh indicator */}
          {autoRefresh && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Auto-refreshing every {refreshInterval / 1000}s
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Demo Component
const Demo = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      learner_name: 'Jane Doe',
      skill_title: 'Advanced TIG Welding Techniques',
      action: 'verified',
      verifier_name: 'Artisan Workshop',
      context_type: 'Juakali',
      depth_level: 4,
      timestamp: new Date(Date.now() - 5 * 60000).toISOString() // 5 mins ago
    },
    {
      id: 2,
      learner_name: 'John Kamau',
      skill_title: 'Custom Furniture Design',
      action: 'submitted',
      context_type: 'Juakali',
      depth_level: 3,
      timestamp: new Date(Date.now() - 15 * 60000).toISOString() // 15 mins ago
    },
    {
      id: 3,
      learner_name: 'Sarah Wanjiku',
      skill_title: 'Electrical Wiring Installation',
      action: 'assigned',
      verifier_name: 'Elite Technical Workshop',
      context_type: 'School',
      depth_level: 2,
      timestamp: new Date(Date.now() - 30 * 60000).toISOString() // 30 mins ago
    },
    {
      id: 4,
      learner_name: 'Michael Omondi',
      skill_title: 'Motorcycle Engine Diagnostics',
      action: 'verified',
      verifier_name: 'City Mechanics Hub',
      context_type: 'Juakali',
      depth_level: 4,
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString() // 2 hours ago
    },
    {
      id: 5,
      learner_name: 'Grace Akinyi',
      skill_title: 'Tailoring and Garment Construction',
      action: 'rejected',
      verifier_name: 'Fashion Institute Nairobi',
      context_type: 'Home',
      depth_level: 3,
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString() // 3 hours ago
    },
    {
      id: 6,
      learner_name: 'David Mwangi',
      skill_title: 'Plumbing System Installation',
      action: 'submitted',
      context_type: 'Juakali',
      depth_level: 2,
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString() // 5 hours ago
    },
    {
      id: 7,
      learner_name: 'Lucy Njeri',
      skill_title: 'Mobile Phone Repair',
      action: 'verified',
      verifier_name: 'Tech Solutions Ltd',
      context_type: 'Juakali',
      depth_level: 3,
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString() // 1 day ago
    },
    {
      id: 8,
      learner_name: 'Peter Otieno',
      skill_title: 'Masonry and Bricklaying',
      action: 'assigned',
      verifier_name: 'Construction Training Center',
      context_type: 'Juakali',
      depth_level: 2,
      timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString() // 2 days ago
    },
    {
      id: 9,
      learner_name: 'Faith Mutua',
      skill_title: 'Hairdressing and Styling',
      action: 'verified',
      verifier_name: 'Beauty Academy Mombasa',
      context_type: 'Home',
      depth_level: 4,
      timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString() // 3 days ago
    },
    {
      id: 10,
      learner_name: 'James Kipchoge',
      skill_title: 'Auto Body Repair',
      action: 'submitted',
      context_type: 'Juakali',
      depth_level: 3,
      timestamp: new Date(Date.now() - 4 * 24 * 3600000).toISOString() // 4 days ago
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate new activity
      const newActivity = {
        id: Date.now(),
        learner_name: 'New Learner',
        skill_title: 'Sample Skill',
        action: ['submitted', 'verified', 'rejected', 'assigned'][Math.floor(Math.random() * 4)],
        verifier_name: 'Sample Verifier',
        context_type: 'Juakali',
        depth_level: 3,
        timestamp: new Date().toISOString()
      };
      setActivities([newActivity, ...activities]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-blue-50 py-8">
      <SPUActivityFeed
        activities={activities}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        autoRefresh={false}
        refreshInterval={30000}
      />
    </div>
  );
};

export default Demo;