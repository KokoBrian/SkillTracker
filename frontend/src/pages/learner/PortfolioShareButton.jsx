import React, { useState } from 'react';
import { Share2, Copy, Check, X, Facebook, Twitter, Mail, MessageCircle, Link2 } from 'lucide-react';

const PortfolioShareButton = ({ 
  learnerName = "Jane Doe",
  portfolioId = "JD2024-ABC123",
  baseUrl = "https://portfolio.learner.edu"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate portfolio URL
  const portfolioUrl = `${baseUrl}/view/${portfolioId}`;

  // Copy to clipboard function
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share handlers
  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(`Check out ${learnerName}'s learning portfolio: ${portfolioUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioUrl)}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Check out ${learnerName}'s learning portfolio!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(portfolioUrl)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${learnerName}'s Learning Portfolio`);
    const body = encodeURIComponent(`Hi,\n\nI'd like to share ${learnerName}'s learning portfolio with you.\n\nYou can view it here: ${portfolioUrl}\n\nBest regards`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-50 hover:text-green-600',
      action: shareViaWhatsApp
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-50 hover:text-blue-600',
      action: shareViaFacebook
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-sky-50 hover:text-sky-600',
      action: shareViaTwitter
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-orange-50 hover:text-orange-600',
      action: shareViaEmail
    }
  ];

  return (
    <div className="relative inline-block">
      {/* Main Share Button - Unique Design */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        aria-label="Share portfolio"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
        <span>Share Portfolio</span>
        
        {/* Animated ring effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 animate-ping" />
      </button>

      {/* Share Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div 
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 w-auto md:w-[480px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 id="share-title" className="text-lg font-bold text-white">
                    Share Portfolio
                  </h2>
                  <p className="text-sm text-blue-100">
                    {learnerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-colors"
                aria-label="Close share dialog"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Copy Link Section */}
              <div className="mb-6">
                <label htmlFor="portfolio-link" className="block text-sm font-semibold text-gray-700 mb-2">
                  Portfolio Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      id="portfolio-link"
                      type="text"
                      value={portfolioUrl}
                      readOnly
                      className="w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                      aria-label="Portfolio URL"
                    />
                    <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    aria-label={copied ? "Link copied" : "Copy link to clipboard"}
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Success message */}
                {copied && (
                  <div 
                    className="mt-2 flex items-center gap-2 text-sm text-green-600 animate-fade-in"
                    role="status"
                    aria-live="polite"
                  >
                    <Check className="w-4 h-4" />
                    <span>Link copied to clipboard!</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-sm text-gray-500 font-medium">
                    Share via
                  </span>
                </div>
              </div>

              {/* Social Share Options */}
              <div className="grid grid-cols-2 gap-3">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.name}
                      onClick={option.action}
                      className={`flex items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg transition-all duration-200 ${option.color}`}
                      aria-label={`Share via ${option.name}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-gray-700">
                        {option.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Info Note */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Note:</span> This portfolio link is read-only. 
                  Viewers can see achievements and skills but cannot make any changes.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Demo Component
const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
      {/* Demo Header */}
      <div className="max-w-4xl mx-auto pt-12 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Learner Portfolio Dashboard
        </h1>
        <p className="text-gray-600">
          Share your achievements and skills with the world
        </p>
      </div>

      {/* Demo Portfolio Preview Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                JD
              </div>
              <div>
                <h2 className="text-2xl font-bold">Jane Doe</h2>
                <p className="text-blue-100">Advanced Learner</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white border-opacity-20">
              <div>
                <div className="text-3xl font-bold">24</div>
                <div className="text-sm text-blue-100">Competencies</div>
              </div>
              <div>
                <div className="text-3xl font-bold">87</div>
                <div className="text-sm text-blue-100">Skills</div>
              </div>
              <div>
                <div className="text-3xl font-bold">156</div>
                <div className="text-sm text-blue-100">Evidences</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Advanced Welding</div>
                  <div className="text-sm text-gray-600">Completed December 2024</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Digital Content Creation</div>
                  <div className="text-sm text-gray-600">Completed December 2024</div>
                </div>
              </div>
            </div>

            {/* Share Button Placement */}
            <div className="flex justify-center pt-4 border-t border-gray-200">
              <PortfolioShareButton 
                learnerName="Jane Doe"
                portfolioId="JD2024-ABC123"
                baseUrl="https://portfolio.learner.edu"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-600 max-w-xl mx-auto">
          <p className="mb-2">
            💡 <span className="font-semibold">Pro Tip:</span> Share your portfolio with potential employers, 
            educators, or family members to showcase your learning journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demo;