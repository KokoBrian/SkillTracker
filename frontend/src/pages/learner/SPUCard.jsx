import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Play, Image, ExternalLink } from 'lucide-react';

const SPUCard = ({ 
  skill_title = "Problem Solving with Fractions",
  context_type = "School",
  verification_status = "verified",
  depth_level = 3,
  evidence = [],
  verifier_notes = "",
  date_submitted = "2024-12-15",
  learner_name = "Jane Doe"
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  
  // Status configuration
  const statusConfig = {
    verified: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'Verified'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      label: 'Pending Review'
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'Needs Revision'
    }
  };

  // Context type styling
  const contextStyles = {
    School: 'bg-blue-100 text-blue-800',
    Juakali: 'bg-purple-100 text-purple-800',
    Home: 'bg-orange-100 text-orange-800'
  };

  const status = statusConfig[verification_status] || statusConfig.pending;
  const StatusIcon = status.icon;

  // Depth level display
  const getDepthBadge = (level) => {
    const labels = ['Awareness', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level - 1] || 'Level ' + level;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Card */}
      <div className={`bg-white rounded-lg shadow-md border-2 ${status.border} overflow-hidden`}>
        {/* Header Section */}
        <div className={`${status.bg} p-4 border-b ${status.border}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 mb-2 break-words">
                {skill_title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded-full font-medium ${contextStyles[context_type] || contextStyles.School}`}>
                  {context_type}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                  {getDepthBadge(depth_level)}
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${status.color}`}>
              <StatusIcon className="w-6 h-6 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Status Info */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className={`font-semibold ${status.color}`}>{status.label}</span>
              <span className="text-gray-500">{new Date(date_submitted).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Evidence Thumbnails */}
          {evidence.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Evidence ({evidence.length})
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {evidence.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEvidence(item)}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all group"
                  >
                    {item.type === 'photo' ? (
                      <>
                        <img 
                          src={item.thumbnail || item.url} 
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <Image className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                          {item.duration || '0:00'}
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verifier Notes */}
          {verifier_notes && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Verifier Notes</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{verifier_notes}</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button className="w-full mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            View Full Details
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Evidence Modal */}
      {selectedEvidence && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvidence(null)}
        >
          <div className="relative max-w-4xl w-full max-h-full">
            <button
              onClick={() => setSelectedEvidence(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 z-10"
            >
              <XCircle className="w-6 h-6" />
            </button>
            {selectedEvidence.type === 'photo' ? (
              <img 
                src={selectedEvidence.url} 
                alt="Evidence"
                className="w-full h-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video 
                controls 
                className="w-full h-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <source src={selectedEvidence.url} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Demo with sample data
const Demo = () => {
  const sampleEvidence = [
    { type: 'photo', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200' },
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: '', duration: '0:45' },
    { type: 'photo', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400', thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200' },
    { type: 'photo', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400', thumbnail: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill Progress Unit (SPU)</h1>
        <p className="text-gray-600">Learner achievement portfolio</p>
      </div>

      <div className="space-y-6">
        {/* Verified Card */}
        <SPUCard
          skill_title="Advanced Welding Techniques"
          context_type="Juakali"
          verification_status="verified"
          depth_level={4}
          evidence={sampleEvidence}
          verifier_notes="Excellent demonstration of joint preparation and welding execution. Shows mastery of TIG welding fundamentals."
          date_submitted="2024-12-20"
          learner_name="John Kamau"
        />

        {/* Pending Card */}
        <SPUCard
          skill_title="Multiplication Tables (1-12)"
          context_type="Home"
          verification_status="pending"
          depth_level={2}
          evidence={sampleEvidence.slice(0, 2)}
          date_submitted="2024-12-26"
          learner_name="Sarah Wanjiku"
        />

        {/* Needs Revision Card */}
        <SPUCard
          skill_title="Essay Writing: Persuasive Arguments"
          context_type="School"
          verification_status="rejected"
          depth_level={3}
          evidence={sampleEvidence.slice(0, 3)}
          verifier_notes="Good effort! Please revise to include more supporting evidence for your main arguments. Also check paragraph structure."
          date_submitted="2024-12-18"
          learner_name="Michael Omondi"
        />
      </div>
    </div>
  );
};

export default Demo;