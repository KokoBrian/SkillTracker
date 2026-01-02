import React, { useState } from 'react';
import { TrendingUp, Award, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const CompetencyTimeline = ({ competencies = [] }) => {
  const [expandedCompetency, setExpandedCompetency] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Depth level configuration
  const depthConfig = {
    1: { label: 'Awareness', color: 'bg-gray-400', textColor: 'text-gray-700' },
    2: { label: 'Basic', color: 'bg-blue-400', textColor: 'text-blue-700' },
    3: { label: 'Intermediate', color: 'bg-green-400', textColor: 'text-green-700' },
    4: { label: 'Advanced', color: 'bg-orange-400', textColor: 'text-orange-700' },
    5: { label: 'Expert', color: 'bg-purple-500', textColor: 'text-purple-700' }
  };

  // Sort competencies by most recent activity
  const sortedCompetencies = [...competencies].sort((a, b) => {
    const aLatest = new Date(Math.max(...a.milestones.map(m => new Date(m.date))));
    const bLatest = new Date(Math.max(...b.milestones.map(m => new Date(m.date))));
    return bLatest - aLatest;
  });

  // Filter competencies
  const filteredCompetencies = selectedFilter === 'all' 
    ? sortedCompetencies 
    : sortedCompetencies.filter(c => c.category === selectedFilter);

  // Get unique categories
  const categories = ['all', ...new Set(competencies.map(c => c.category))];

  const toggleCompetency = (id) => {
    setExpandedCompetency(expandedCompetency === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getGrowthPercentage = (milestones) => {
    if (milestones.length < 2) return 0;
    const first = milestones[0].depth_level;
    const last = milestones[milestones.length - 1].depth_level;
    return ((last - first) / 4) * 100;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Competency Timeline
        </h1>
        <p className="text-gray-600">Track skill development and growth over time</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                selectedFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Competency Cards */}
      <div className="space-y-4">
        {filteredCompetencies.map((competency) => {
          const isExpanded = expandedCompetency === competency.id;
          const currentLevel = competency.milestones[competency.milestones.length - 1];
          const growth = getGrowthPercentage(competency.milestones);
          const sortedMilestones = [...competency.milestones].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
          );

          return (
            <div
              key={competency.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Card Header - Always Visible */}
              <button
                onClick={() => toggleCompetency(competency.id)}
                className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg break-words">
                      {competency.name}
                    </h3>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {competency.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      depthConfig[currentLevel.depth_level].color
                    } text-white`}>
                      {depthConfig[currentLevel.depth_level].label}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {competency.milestones.length} milestone{competency.milestones.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{currentLevel.depth_level}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${depthConfig[currentLevel.depth_level].color}`}
                        style={{ width: `${(currentLevel.depth_level / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {growth > 0 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      +{growth.toFixed(0)}% growth
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Timeline View */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Milestone History
                  </h4>
                  
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300" />
                    
                    {/* Milestones */}
                    <div className="space-y-4">
                      {sortedMilestones.map((milestone, index) => {
                        const config = depthConfig[milestone.depth_level];
                        const isLatest = index === sortedMilestones.length - 1;
                        
                        return (
                          <div key={index} className="relative pl-10">
                            {/* Timeline Dot */}
                            <div className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 border-white ${
                              config.color
                            } ${isLatest ? 'ring-2 ring-blue-300' : ''}`} />
                            
                            {/* Milestone Content */}
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      config.color
                                    } text-white`}>
                                      {config.label}
                                    </span>
                                    {isLatest && (
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700 font-medium break-words">
                                    {milestone.title}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {formatDate(milestone.date)}
                                </span>
                              </div>
                              
                              {milestone.description && (
                                <p className="text-sm text-gray-600 mt-2">
                                  {milestone.description}
                                </p>
                              )}
                              
                              {milestone.context && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Context: {milestone.context}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCompetencies.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-lg font-medium">No competencies found</p>
          <p className="text-sm">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

// Demo Component
const Demo = () => {
  const sampleCompetencies = [
    {
      id: 1,
      name: "Advanced Welding Techniques",
      category: "technical",
      milestones: [
        {
          date: "2024-03-15",
          depth_level: 1,
          title: "Introduction to Welding Safety",
          description: "Completed basic safety training and equipment familiarization",
          context: "Juakali Workshop"
        },
        {
          date: "2024-06-20",
          depth_level: 2,
          title: "Basic MIG Welding",
          description: "Successfully performed straight line welds on flat surfaces",
          context: "Juakali Workshop"
        },
        {
          date: "2024-09-10",
          depth_level: 3,
          title: "Multi-position Welding",
          description: "Demonstrated proficiency in overhead and vertical welding",
          context: "Juakali Workshop"
        },
        {
          date: "2024-12-01",
          depth_level: 4,
          title: "TIG Welding Mastery",
          description: "Completed complex joint projects with minimal defects",
          context: "Juakali Workshop"
        }
      ]
    },
    {
      id: 2,
      name: "Mathematical Problem Solving",
      category: "academic",
      milestones: [
        {
          date: "2024-01-10",
          depth_level: 2,
          title: "Basic Arithmetic Operations",
          description: "Mastered addition, subtraction, multiplication, and division",
          context: "School"
        },
        {
          date: "2024-05-15",
          depth_level: 3,
          title: "Fractions and Decimals",
          description: "Solved complex fraction problems and conversions",
          context: "Home Practice"
        },
        {
          date: "2024-11-20",
          depth_level: 4,
          title: "Algebraic Equations",
          description: "Successfully solved multi-variable equations",
          context: "School"
        }
      ]
    },
    {
      id: 3,
      name: "Digital Content Creation",
      category: "creative",
      milestones: [
        {
          date: "2024-02-01",
          depth_level: 1,
          title: "Introduction to Design Tools",
          description: "Learned basic interface of design software",
          context: "Home"
        },
        {
          date: "2024-04-15",
          depth_level: 2,
          title: "Basic Graphic Design",
          description: "Created first poster design project",
          context: "School"
        },
        {
          date: "2024-08-30",
          depth_level: 3,
          title: "Video Editing Skills",
          description: "Produced a 5-minute documentary video",
          context: "Home"
        },
        {
          date: "2024-12-15",
          depth_level: 4,
          title: "Brand Identity Design",
          description: "Designed complete brand package for local business",
          context: "Juakali"
        }
      ]
    },
    {
      id: 4,
      name: "Public Speaking",
      category: "soft-skills",
      milestones: [
        {
          date: "2024-07-01",
          depth_level: 2,
          title: "Classroom Presentations",
          description: "Delivered 5-minute presentation to classmates",
          context: "School"
        },
        {
          date: "2024-10-05",
          depth_level: 3,
          title: "School Assembly Speech",
          description: "Addressed entire school assembly confidently",
          context: "School"
        },
        {
          date: "2024-12-20",
          depth_level: 4,
          title: "Community Event Speaker",
          description: "Keynote speaker at local youth empowerment event",
          context: "Community"
        }
      ]
    },
    {
      id: 5,
      name: "Carpentry Fundamentals",
      category: "technical",
      milestones: [
        {
          date: "2024-04-01",
          depth_level: 1,
          title: "Tool Identification",
          description: "Learned to identify and safely use basic carpentry tools",
          context: "Juakali"
        },
        {
          date: "2024-07-15",
          depth_level: 2,
          title: "Simple Furniture Assembly",
          description: "Built a basic wooden stool",
          context: "Juakali"
        },
        {
          date: "2024-11-30",
          depth_level: 3,
          title: "Custom Furniture Design",
          description: "Designed and built a custom bookshelf",
          context: "Juakali"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <CompetencyTimeline competencies={sampleCompetencies} />
    </div>
  );
};

export default Demo;