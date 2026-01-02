import React, { useState } from 'react';
import { Award, CheckCircle, AlertCircle, Star, User, MessageSquare, ThumbsUp } from 'lucide-react';

const EndorsementForm = ({ 
  onSubmit,
  onLookupStudent,
  learnerOptions = [],
  initialLearnerId = null
}) => {
  const [formData, setFormData] = useState({
    learner_id: initialLearnerId || '',
    soft_skills: [], // Changed to array for multiple skills
    notes: '',
    is_public: true
  });

  const [searchMode, setSearchMode] = useState('dropdown'); // 'dropdown' or 'id_search'
  const [studentIdSearch, setStudentIdSearch] = useState('');
  const [searchedLearner, setSearchedLearner] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Predefined soft skills with descriptions and strength levels
  const softSkills = [
    { 
      id: 'communication', 
      name: 'Communication', 
      icon: '💬',
      description: 'Clear and effective verbal and written communication',
      strength_level: 3
    },
    { 
      id: 'teamwork', 
      name: 'Teamwork', 
      icon: '🤝',
      description: 'Collaborates well with others and contributes to group success',
      strength_level: 3
    },
    { 
      id: 'leadership', 
      name: 'Leadership', 
      icon: '🎯',
      description: 'Takes initiative and guides others positively',
      strength_level: 3
    },
    { 
      id: 'problem_solving', 
      name: 'Problem Solving', 
      icon: '🧩',
      description: 'Approaches challenges creatively and finds solutions',
      strength_level: 3
    },
    { 
      id: 'critical_thinking', 
      name: 'Critical Thinking', 
      icon: '🧠',
      description: 'Analyzes information and makes reasoned judgments',
      strength_level: 3
    },
    { 
      id: 'creativity', 
      name: 'Creativity', 
      icon: '🎨',
      description: 'Generates innovative ideas and unique approaches',
      strength_level: 3
    },
    { 
      id: 'time_management', 
      name: 'Time Management', 
      icon: '⏰',
      description: 'Organizes tasks efficiently and meets deadlines',
      strength_level: 3
    },
    { 
      id: 'adaptability', 
      name: 'Adaptability', 
      icon: '🔄',
      description: 'Flexible and adjusts well to changing situations',
      strength_level: 3
    },
    { 
      id: 'perseverance', 
      name: 'Perseverance', 
      icon: '💪',
      description: 'Shows determination and doesn\'t give up easily',
      strength_level: 3
    },
    { 
      id: 'empathy', 
      name: 'Empathy', 
      icon: '❤️',
      description: 'Understands and shares the feelings of others',
      strength_level: 3
    },
    { 
      id: 'initiative', 
      name: 'Initiative', 
      icon: '🚀',
      description: 'Self-motivated and takes action without being asked',
      strength_level: 3
    },
    { 
      id: 'attention_to_detail', 
      name: 'Attention to Detail', 
      icon: '🔍',
      description: 'Careful and thorough in completing tasks',
      strength_level: 3
    }
  ];

  const strengthLevels = [
    { value: 1, label: 'Emerging', description: 'Beginning to show this skill' },
    { value: 2, label: 'Developing', description: 'Consistently demonstrating this skill' },
    { value: 3, label: 'Strong', description: 'Excels in this area' },
    { value: 4, label: 'Exceptional', description: 'Outstanding and inspirational' }
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.learner_id) {
      newErrors.learner_id = 'Please select or search for a learner';
    }

    if (formData.soft_skills.length === 0) {
      newErrors.soft_skills = 'Please select at least one soft skill to endorse';
    }

    if (formData.notes.length > 500) {
      newErrors.notes = 'Notes must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle student ID search
  const handleStudentIdSearch = async () => {
    if (!studentIdSearch.trim()) {
      setSearchError('Please enter a student ID');
      return;
    }

    setSearchError('');
    
    try {
      // If onLookupStudent is provided, use it to search
      if (onLookupStudent) {
        const result = await onLookupStudent(studentIdSearch);
        if (result) {
          setSearchedLearner(result);
          setFormData(prev => ({ ...prev, learner_id: result.id }));
          if (errors.learner_id) {
            setErrors(prev => ({ ...prev, learner_id: '' }));
          }
        } else {
          setSearchError('Student ID not found');
          setSearchedLearner(null);
        }
      } else {
        // Fallback: search in learnerOptions
        const found = learnerOptions.find(
          l => l.student_id.toLowerCase() === studentIdSearch.toLowerCase()
        );
        if (found) {
          setSearchedLearner(found);
          setFormData(prev => ({ ...prev, learner_id: found.id }));
          if (errors.learner_id) {
            setErrors(prev => ({ ...prev, learner_id: '' }));
          }
        } else {
          setSearchError('Student ID not found');
          setSearchedLearner(null);
        }
      }
    } catch (error) {
      setSearchError('Error looking up student ID');
      setSearchedLearner(null);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle soft skill toggle (multiple selection)
  const handleSkillToggle = (skillId) => {
    setFormData(prev => {
      const isSelected = prev.soft_skills.some(s => s.skill_id === skillId);
      
      if (isSelected) {
        // Remove skill
        return {
          ...prev,
          soft_skills: prev.soft_skills.filter(s => s.skill_id !== skillId)
        };
      } else {
        // Add skill with default strength level
        return {
          ...prev,
          soft_skills: [...prev.soft_skills, { skill_id: skillId, strength_level: 3 }]
        };
      }
    });
    
    if (errors.soft_skills) {
      setErrors(prev => ({ ...prev, soft_skills: '' }));
    }
  };

  // Handle strength level change for specific skill
  const handleStrengthChange = (skillId, level) => {
    setFormData(prev => ({
      ...prev,
      soft_skills: prev.soft_skills.map(s =>
        s.skill_id === skillId ? { ...s, strength_level: level } : s
      )
    }));
  };

  // Get strength level for a skill
  const getSkillStrength = (skillId) => {
    const skill = formData.soft_skills.find(s => s.skill_id === skillId);
    return skill ? skill.strength_level : 3;
  };

  // Check if skill is selected
  const isSkillSelected = (skillId) => {
    return formData.soft_skills.some(s => s.skill_id === skillId);
  };

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setSubmitSuccess(true);

      setTimeout(() => {
        resetForm();
      }, 2500);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to submit endorsement. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      learner_id: initialLearnerId || '',
      soft_skills: [],
      notes: '',
      is_public: true
    });
    setStudentIdSearch('');
    setSearchedLearner(null);
    setSearchError('');
    setErrors({});
    setSubmitSuccess(false);
  };

  const selectedLearner = searchedLearner || learnerOptions.find(l => l.id === parseInt(formData.learner_id));
  const selectedSkills = formData.soft_skills.map(s => ({
    ...softSkills.find(sk => sk.id === s.skill_id),
    strength_level: s.strength_level
  }));

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-t-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Endorse Soft Skill
              </h2>
              <p className="text-emerald-100 text-sm">
                Recognize a learner's personal strengths
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mx-6 mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">Endorsement Submitted!</p>
              <p className="text-sm text-emerald-700">
                {selectedLearner?.name} has been endorsed for {formData.soft_skills.length} skill{formData.soft_skills.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Learner Selection Mode Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Find Learner <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setSearchMode('dropdown');
                  setSearchedLearner(null);
                  setSearchError('');
                }}
                className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                  searchMode === 'dropdown'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                }`}
              >
                Dropdown List
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchMode('id_search');
                  setFormData(prev => ({ ...prev, learner_id: '' }));
                }}
                className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                  searchMode === 'id_search'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                }`}
              >
                Search by ID
              </button>
            </div>

            {/* Dropdown Mode */}
            {searchMode === 'dropdown' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="learner_id"
                  name="learner_id"
                  value={formData.learner_id}
                  onChange={handleChange}
                  disabled={!!initialLearnerId}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.learner_id ? 'border-red-500' : 'border-gray-300'
                  } ${initialLearnerId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Choose a learner...</option>
                  {learnerOptions.map(learner => (
                    <option key={learner.id} value={learner.id}>
                      {learner.name} ({learner.student_id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ID Search Mode */}
            {searchMode === 'id_search' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studentIdSearch}
                    onChange={(e) => {
                      setStudentIdSearch(e.target.value);
                      setSearchError('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleStudentIdSearch();
                      }
                    }}
                    placeholder="Enter Student ID (e.g., JD2024-001)"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleStudentIdSearch}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
                
                {searchError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {searchError}
                  </p>
                )}
                
                {searchedLearner && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{searchedLearner.name}</p>
                      <p className="text-sm text-gray-600">{searchedLearner.student_id}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {errors.learner_id && (
              <p className="error-message mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.learner_id}
              </p>
            )}
          </div>

          {/* Soft Skills Grid */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Soft Skills <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Select one or more skills to endorse. Click a selected skill to adjust its strength level.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {softSkills.map(skill => {
                const selected = isSkillSelected(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleSkillToggle(skill.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                      selected
                        ? 'bg-emerald-50 border-emerald-500 shadow-md'
                        : 'bg-white border-gray-300 hover:border-emerald-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="text-2xl mb-2">{skill.icon}</div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">
                      {skill.name}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {skill.description}
                    </div>
                    {selected && (
                      <div className="flex items-center gap-1">
                        {[...Array(getSkillStrength(skill.id))].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    )}
                    {selected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.soft_skills && (
              <p className="error-message mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.soft_skills}
              </p>
            )}
            
            {formData.soft_skills.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  {formData.soft_skills.length} skill{formData.soft_skills.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-blue-700">
                  Adjust strength levels below
                </p>
              </div>
            )}
          </div>

          {/* Strength Level for each selected skill */}
          {formData.soft_skills.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Set Strength Levels
              </label>
              
              {formData.soft_skills.map(selectedSkill => {
                const skill = softSkills.find(s => s.id === selectedSkill.skill_id);
                return (
                  <div key={selectedSkill.skill_id} className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="font-medium text-gray-900 text-sm">{skill.name}</span>
                    </div>
                    
                    <div className="space-y-1.5">
                      {strengthLevels.map(level => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => handleStrengthChange(selectedSkill.skill_id, level.value)}
                          className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
                            selectedSkill.strength_level === level.value
                              ? 'bg-white border-emerald-500 shadow-sm'
                              : 'bg-white border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <div className="flex gap-0.5">
                                  {[...Array(level.value)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                                    />
                                  ))}
                                  {[...Array(4 - level.value)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3.5 h-3.5 text-gray-300"
                                    />
                                  ))}
                                </div>
                                <span className="font-semibold text-gray-900 text-xs">
                                  {level.label}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {level.description}
                              </div>
                            </div>
                            {selectedSkill.strength_level === level.value && (
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Share specific examples or observations that demonstrate this skill..."
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none ${
                errors.notes ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.notes ? (
                <p className="error-message text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.notes}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Example: "Consistently helps classmates understand difficult concepts"
                </p>
              )}
              <span className={`text-xs ${formData.notes.length > 450 ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
                {formData.notes.length}/500
              </span>
            </div>
          </div>

          {/* Public/Private Toggle */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="w-5 h-5 mt-0.5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm mb-1">
                  Make this endorsement public
                </div>
                <div className="text-xs text-gray-600">
                  Public endorsements will be visible on the learner's portfolio. 
                  Private endorsements are only visible to administrators.
                </div>
              </div>
            </label>
          </div>

          {/* Preview Card */}
          {formData.soft_skills.length > 0 && selectedLearner && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg">
              <p className="text-xs font-semibold text-emerald-700 uppercase mb-3">
                Preview
              </p>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {selectedLearner.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">
                    {selectedLearner.name}
                  </div>
                  <div className="space-y-2">
                    {selectedSkills.map(skill => (
                      <div key={skill.id} className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg">{skill.icon}</span>
                        <span className="font-medium text-gray-700 text-sm">{skill.name}</span>
                        <span className="text-gray-400">•</span>
                        <div className="flex gap-0.5">
                          {[...Array(skill.strength_level)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {formData.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic border-l-2 border-emerald-400 pl-2">
                      "{formData.notes}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Submission Failed</p>
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ThumbsUp className="w-5 h-5" />
                  Submit Endorsement
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component
const Demo = () => {
  const sampleLearners = [
    { id: 1, name: 'Jane Doe', student_id: 'JD2024-001' },
    { id: 2, name: 'John Kamau', student_id: 'JK2024-002' },
    { id: 3, name: 'Sarah Wanjiku', student_id: 'SW2024-003' },
    { id: 4, name: 'Michael Omondi', student_id: 'MO2024-004' }
  ];

  // Simulate student lookup function
  const handleLookupStudent = async (studentId) => {
    console.log('Looking up student:', studentId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Search in sample learners
    const found = sampleLearners.find(
      l => l.student_id.toLowerCase() === studentId.toLowerCase()
    );
    
    return found || null;
  };

  const handleSubmit = async (formData) => {
    console.log('Submitting endorsement:', formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app:
    // const response = await fetch('/api/endorsements/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
    
    return { success: true };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Recognize and endorse learner soft skills</p>
      </div>
      
      <EndorsementForm
        onSubmit={handleSubmit}
        onLookupStudent={handleLookupStudent}
        learnerOptions={sampleLearners}
        initialLearnerId={null}  // Set to specific ID to pre-select a learner
      />
    </div>
  );
};

export default Demo;