import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image, Video, Plus, Trash2 } from 'lucide-react';

const SPUForm = ({ 
  onSubmit,
  competencyOptions = [],
  learnerOptions = [],
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    learner_id: initialData?.learner_id || '',
    skill_title: initialData?.skill_title || '',
    context_type: initialData?.context_type || '',
    primary_competency: initialData?.primary_competency || '',
    secondary_competencies: initialData?.secondary_competencies || [],
    depth_level: initialData?.depth_level || '',
    description: initialData?.description || '',
    evidence_files: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [previews, setPreviews] = useState([]);

  const contextTypes = ['School', 'Home', 'Juakali'];
  
  const depthLevels = [
    { value: 1, label: 'Level 1 - Awareness', description: 'Basic familiarity with the concept' },
    { value: 2, label: 'Level 2 - Basic', description: 'Can perform with guidance' },
    { value: 3, label: 'Level 3 - Intermediate', description: 'Can perform independently' },
    { value: 4, label: 'Level 4 - Advanced', description: 'Can teach others' },
    { value: 5, label: 'Level 5 - Expert', description: 'Mastery and innovation' }
  ];

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    if (!formData.learner_id) {
      newErrors.learner_id = 'Please select a learner';
    }

    if (!formData.skill_title.trim()) {
      newErrors.skill_title = 'Skill title is required';
    } else if (formData.skill_title.length < 3) {
      newErrors.skill_title = 'Skill title must be at least 3 characters';
    }

    if (!formData.context_type) {
      newErrors.context_type = 'Please select a context type';
    }

    if (!formData.primary_competency) {
      newErrors.primary_competency = 'Please select a primary competency';
    }

    if (!formData.depth_level) {
      newErrors.depth_level = 'Please select a depth level';
    }

    if (formData.evidence_files.length === 0) {
      newErrors.evidence_files = 'At least one evidence file is required';
    }

    if (formData.evidence_files.length > 10) {
      newErrors.evidence_files = 'Maximum 10 evidence files allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle secondary competencies
  const handleSecondaryCompetencyToggle = (competencyId) => {
    setFormData(prev => {
      const isSelected = prev.secondary_competencies.includes(competencyId);
      return {
        ...prev,
        secondary_competencies: isSelected
          ? prev.secondary_competencies.filter(id => id !== competencyId)
          : [...prev.secondary_competencies, competencyId]
      };
    });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max
      return (isImage || isVideo) && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Only images and videos under 50MB are allowed.');
    }

    // Create previews
    const newPreviews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'photo' : 'video',
      name: file.name
    }));

    setFormData(prev => ({
      ...prev,
      evidence_files: [...prev.evidence_files, ...validFiles]
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
    
    if (errors.evidence_files) {
      setErrors(prev => ({ ...prev, evidence_files: '' }));
    }
  };

  // Remove file
  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index].url);
    
    setFormData(prev => ({
      ...prev,
      evidence_files: prev.evidence_files.filter((_, i) => i !== index)
    }));
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare FormData for file upload
      const submitData = new FormData();
      submitData.append('learner_id', formData.learner_id);
      submitData.append('skill_title', formData.skill_title);
      submitData.append('context_type', formData.context_type);
      submitData.append('primary_competency', formData.primary_competency);
      submitData.append('secondary_competencies', JSON.stringify(formData.secondary_competencies));
      submitData.append('depth_level', formData.depth_level);
      submitData.append('description', formData.description);
      
      formData.evidence_files.forEach((file, index) => {
        submitData.append(`evidence_${index}`, file);
      });

      // Call parent submit handler
      await onSubmit(submitData);
      
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        resetForm();
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to submit SPU. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      learner_id: '',
      skill_title: '',
      context_type: '',
      primary_competency: '',
      secondary_competencies: [],
      depth_level: '',
      description: '',
      evidence_files: []
    });
    setPreviews([]);
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            Create New SPU
          </h2>
          <p className="text-blue-100 text-sm">
            Document learner skill achievement with evidence
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">SPU Created Successfully!</p>
              <p className="text-sm text-green-700">The skill progress unit has been submitted for verification.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Learner Selection */}
          <div>
            <label htmlFor="learner_id" className="block text-sm font-semibold text-gray-700 mb-2">
              Select Learner <span className="text-red-500">*</span>
            </label>
            <select
              id="learner_id"
              name="learner_id"
              value={formData.learner_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.learner_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Choose a learner...</option>
              {learnerOptions.map(learner => (
                <option key={learner.id} value={learner.id}>
                  {learner.name} ({learner.student_id})
                </option>
              ))}
            </select>
            {errors.learner_id && (
              <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.learner_id}
              </p>
            )}
          </div>

          {/* Skill Title */}
          <div>
            <label htmlFor="skill_title" className="block text-sm font-semibold text-gray-700 mb-2">
              Skill Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="skill_title"
              name="skill_title"
              value={formData.skill_title}
              onChange={handleChange}
              placeholder="e.g., Advanced Welding Techniques"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.skill_title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.skill_title && (
              <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.skill_title}
              </p>
            )}
          </div>

          {/* Context Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Context Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {contextTypes.map(context => (
                <button
                  key={context}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, context_type: context }));
                    if (errors.context_type) setErrors(prev => ({ ...prev, context_type: '' }));
                  }}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    formData.context_type === context
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {context}
                </button>
              ))}
            </div>
            {errors.context_type && (
              <p className="error-message mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.context_type}
              </p>
            )}
          </div>

          {/* Primary Competency */}
          <div>
            <label htmlFor="primary_competency" className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Competency <span className="text-red-500">*</span>
            </label>
            <select
              id="primary_competency"
              name="primary_competency"
              value={formData.primary_competency}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.primary_competency ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select primary competency...</option>
              {competencyOptions.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} ({comp.category})
                </option>
              ))}
            </select>
            {errors.primary_competency && (
              <p className="error-message mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.primary_competency}
              </p>
            )}
          </div>

          {/* Secondary Competencies */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Secondary Competencies (Optional)
            </label>
            <div className="border-2 border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              {competencyOptions
                .filter(comp => comp.id !== parseInt(formData.primary_competency))
                .map(comp => (
                  <label key={comp.id} className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded px-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.secondary_competencies.includes(comp.id)}
                      onChange={() => handleSecondaryCompetencyToggle(comp.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {comp.name} <span className="text-gray-500">({comp.category})</span>
                    </span>
                  </label>
                ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Select additional competencies this skill demonstrates
            </p>
          </div>

          {/* Depth Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Depth Level <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {depthLevels.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, depth_level: level.value }));
                    if (errors.depth_level) setErrors(prev => ({ ...prev, depth_level: '' }));
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    formData.depth_level === level.value
                      ? 'bg-blue-50 border-blue-600'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                    </div>
                    {formData.depth_level === level.value && (
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.depth_level && (
              <p className="error-message mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.depth_level}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description / Notes (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Additional context about this skill demonstration..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Evidence Files <span className="text-red-500">*</span>
            </label>
            
            {/* Upload Button */}
            <div className="mb-4">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Photos or videos (max 50MB each, up to 10 files)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview Grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                      {preview.type === 'photo' ? (
                        <img
                          src={preview.url}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                      {preview.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.evidence_files && (
              <p className="error-message mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.evidence_files}
              </p>
            )}
          </div>

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
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create SPU
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
  const sampleCompetencies = [
    { id: 1, name: 'Welding', category: 'Technical' },
    { id: 2, name: 'Mathematics', category: 'Academic' },
    { id: 3, name: 'Digital Design', category: 'Creative' },
    { id: 4, name: 'Public Speaking', category: 'Soft Skills' },
    { id: 5, name: 'Carpentry', category: 'Technical' },
    { id: 6, name: 'Programming', category: 'Technical' },
    { id: 7, name: 'Writing', category: 'Academic' }
  ];

  const sampleLearners = [
    { id: 1, name: 'Jane Doe', student_id: 'JD2024-001' },
    { id: 2, name: 'John Kamau', student_id: 'JK2024-002' },
    { id: 3, name: 'Sarah Wanjiku', student_id: 'SW2024-003' },
    { id: 4, name: 'Michael Omondi', student_id: 'MO2024-004' }
  ];

  const handleSubmit = async (formData) => {
    // Simulate API call
    console.log('Submitting SPU:', formData);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real app, make API call here:
    // const response = await fetch('/api/spu/', {
    //   method: 'POST',
    //   body: formData
    // });
    
    return { success: true };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <SPUForm
        onSubmit={handleSubmit}
        competencyOptions={sampleCompetencies}
        learnerOptions={sampleLearners}
      />
    </div>
  );
};

export default Demo;