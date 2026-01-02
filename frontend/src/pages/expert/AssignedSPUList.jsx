import React, { useState } from 'react';
import { Clock, CheckCircle, User, Calendar, Award, ChevronRight, Filter, Search, RefreshCw } from 'lucide-react';

const AssignedSPUList = ({ 
  spus = [],
  onSelectSPU,
  onRefresh,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterContext, setFilterContext] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // Context type colors
  const contextColors = {
    School: 'bg-blue-100 text-blue-800 border-blue-300',
    Juakali: 'bg-purple-100 text-purple-800 border-purple-300',
    Home: 'bg-orange-100 text-orange-800 border-orange-300'
  };

  // Depth level configuration
  const depthLevels = {
    1: { label: 'Awareness', color: 'text-gray-600' },
    2: { label: 'Basic', color: 'text-blue-600' },
    3: { label: 'Intermediate', color: 'text-green-600' },
    4: { label: 'Advanced', color: 'text-orange-600' },
    5: { label: 'Expert', color: 'text-purple-600' }
  };

  // Filter and sort SPUs
  const filteredSPUs = spus
    .filter(spu => {
      // Search filter
      const matchesSearch = 
        spu.learner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spu.skill_title.toLowerCase().includes(searchQuery.toLowerCase());

      // Context filter
      const matchesContext = filterContext === 'all' || spu.context_type === filterContext;

      return matchesSearch && matchesContext;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date_submitted) - new Date(a.date_submitted);
        case 'date_asc':
          return new Date(a.date_submitted) - new Date(b.date_submitted);
        case 'learner_asc':
          return a.learner_name.localeCompare(b.learner_name);
        case 'learner_desc':
          return b.learner_name.localeCompare(a.learner_name);
        default:
          return 0;
      }
    });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Get time waiting for review
  const getWaitingTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pending Verifications
            </h1>
            <p className="text-gray-600">
              Review and verify learner skill submissions
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-medium text-gray-700">Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm mb-1">Total Pending</p>
                <p className="text-3xl font-bold">{filteredSPUs.length}</p>
              </div>
              <Clock className="w-10 h-10 text-white opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Avg. Wait Time</p>
                <p className="text-3xl font-bold">
                  {spus.length > 0 
                    ? `${Math.floor(spus.reduce((acc, spu) => {
                        const hours = (new Date() - new Date(spu.date_submitted)) / (1000 * 60 * 60);
                        return acc + hours;
                      }, 0) / spus.length)}h`
                    : '0h'
                  }
                </p>
              </div>
              <Calendar className="w-10 h-10 text-white opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm mb-1">Learners</p>
                <p className="text-3xl font-bold">
                  {new Set(spus.map(s => s.learner_id)).size}
                </p>
              </div>
              <User className="w-10 h-10 text-white opacity-80" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by learner name or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Context Filter */}
            <div>
              <select
                value={filterContext}
                onChange={(e) => setFilterContext(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Contexts</option>
                <option value="School">School</option>
                <option value="Juakali">Juakali</option>
                <option value="Home">Home</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'date_desc', label: 'Newest First' },
                { value: 'date_asc', label: 'Oldest First' },
                { value: 'learner_asc', label: 'Learner A-Z' },
                { value: 'learner_desc', label: 'Learner Z-A' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    sortBy === option.value
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SPU List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading SPUs...</p>
          </div>
        </div>
      ) : filteredSPUs.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || filterContext !== 'all' ? 'No matching SPUs found' : 'All caught up!'}
          </h3>
          <p className="text-gray-600">
            {searchQuery || filterContext !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No pending verifications at the moment'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSPUs.map((spu) => (
            <button
              key={spu.id}
              onClick={() => onSelectSPU(spu)}
              className="w-full bg-white rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all p-4 text-left group"
            >
              <div className="flex items-start gap-4">
                {/* Left: Avatar and Priority Indicator */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {spu.learner_name.charAt(0)}
                    </div>
                    {/* Waiting time badge */}
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {getWaitingTime(spu.date_submitted)}
                    </div>
                  </div>
                </div>

                {/* Center: Content */}
                <div className="flex-1 min-w-0">
                  {/* Learner Name and Context */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {spu.learner_name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${contextColors[spu.context_type]}`}>
                      {spu.context_type}
                    </span>
                    <span className={`text-xs font-medium ${depthLevels[spu.depth_level].color}`}>
                      Level {spu.depth_level} - {depthLevels[spu.depth_level].label}
                    </span>
                  </div>

                  {/* Skill Title */}
                  <p className="text-gray-900 font-medium mb-2">
                    {spu.skill_title}
                  </p>

                  {/* Competency and Submission Date */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{spu.competency_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(spu.date_submitted)}</span>
                    </div>
                    {spu.evidence_count > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-orange-600">
                          {spu.evidence_count} evidence file{spu.evidence_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Action Arrow */}
                <div className="flex-shrink-0 self-center">
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination or Load More (Optional) */}
      {filteredSPUs.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredSPUs.length} of {spus.length} pending verification{spus.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

// Demo Component
const Demo = () => {
  const [selectedSPU, setSelectedSPU] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleSPUs = [
    {
      id: 1,
      learner_id: 1,
      learner_name: 'Jane Doe',
      skill_title: 'Advanced TIG Welding Techniques',
      context_type: 'Juakali',
      depth_level: 4,
      competency_name: 'Welding',
      competency_category: 'technical',
      date_submitted: '2024-12-26T10:30:00Z',
      evidence_count: 4,
      status: 'pending'
    },
    {
      id: 2,
      learner_id: 2,
      learner_name: 'John Kamau',
      skill_title: 'Custom Furniture Design and Assembly',
      context_type: 'Juakali',
      depth_level: 3,
      competency_name: 'Carpentry',
      competency_category: 'technical',
      date_submitted: '2024-12-25T14:20:00Z',
      evidence_count: 3,
      status: 'pending'
    },
    {
      id: 3,
      learner_id: 3,
      learner_name: 'Sarah Wanjiku',
      skill_title: 'Electrical Wiring Installation',
      context_type: 'School',
      depth_level: 2,
      competency_name: 'Electrical Work',
      competency_category: 'technical',
      date_submitted: '2024-12-27T08:15:00Z',
      evidence_count: 2,
      status: 'pending'
    },
    {
      id: 4,
      learner_id: 4,
      learner_name: 'Michael Omondi',
      skill_title: 'Motorcycle Engine Diagnostics',
      context_type: 'Juakali',
      depth_level: 4,
      competency_name: 'Mechanics',
      competency_category: 'technical',
      date_submitted: '2024-12-24T16:45:00Z',
      evidence_count: 5,
      status: 'pending'
    },
    {
      id: 5,
      learner_id: 5,
      learner_name: 'Grace Akinyi',
      skill_title: 'Tailoring and Garment Construction',
      context_type: 'Home',
      depth_level: 3,
      competency_name: 'Fashion Design',
      competency_category: 'creative',
      date_submitted: '2024-12-27T11:00:00Z',
      evidence_count: 6,
      status: 'pending'
    },
    {
      id: 6,
      learner_id: 6,
      learner_name: 'David Mwangi',
      skill_title: 'Plumbing System Installation',
      context_type: 'Juakali',
      depth_level: 2,
      competency_name: 'Plumbing',
      competency_category: 'technical',
      date_submitted: '2024-12-23T09:30:00Z',
      evidence_count: 3,
      status: 'pending'
    },
    {
      id: 7,
      learner_id: 7,
      learner_name: 'Lucy Njeri',
      skill_title: 'Mobile Phone Repair and Troubleshooting',
      context_type: 'Juakali',
      depth_level: 3,
      competency_name: 'Electronics Repair',
      competency_category: 'technical',
      date_submitted: '2024-12-27T07:20:00Z',
      evidence_count: 4,
      status: 'pending'
    }
  ];

  const handleSelectSPU = (spu) => {
    setSelectedSPU(spu);
    console.log('Opening verification form for:', spu);
    // In real app: navigate to verification form or open modal
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Refreshed SPU list');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 py-8">
      <AssignedSPUList
        spus={sampleSPUs}
        onSelectSPU={handleSelectSPU}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Selected SPU Display (Demo) */}
      {selectedSPU && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Opening Verification Form
            </h3>
            <p className="text-gray-600 mb-4">
              You selected: <span className="font-semibold">{selectedSPU.skill_title}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Learner: {selectedSPU.learner_name}
            </p>
            <button
              onClick={() => setSelectedSPU(null)}
              className="w-full py-2 px-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Demo;