import React, { useState } from 'react';
import { CheckCircle, X, Upload, AlertCircle, FileText, Camera, Video, Trash2, Save } from 'lucide-react';

const VerificationForm = ({
  spu,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    participation: '',
    tool_handling: '',
    safety: '',
    output_quality: '',
    overall_notes: '',
    verifier_evidence: []
  });

  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState([]);

  // Rubric dimensions configuration
  const rubricDimensions = [
    {
      id: 'participation',
      title: 'Participation',
      icon: '👥',
      description: 'Level of engagement and involvement in the task'
    },
    {
      id: 'tool_handling',
      title: 'Tool Handling',
      icon: '🔧',
      description: 'Competence and confidence in using relevant tools'
    },
    {
      id: 'safety',
      title: 'Safety',
      icon: '🛡️',
      description: 'Adherence to safety protocols and procedures'
    },
    {
      id: 'output_quality',
      title: 'Output Quality',
      icon: '⭐',
      description: 'Quality and completeness of the final work'
    }
  ];

  // Proficiency levels
  const proficiencyLevels = [
    {
      value: 'observed_assisted',
      label: 'Observed/Assisted',
      description: 'Required significant guidance and support',
      color: 'border-amber-500 bg-amber-50'
    },
    {
      value: 'partially_independent',
      label: 'Partially Independent',
      description: 'Completed with minimal guidance',
      color: 'border-blue-500 bg-blue-50'
    },
    {
      value: 'independent',
      label: 'Independent',
      description: 'Completed confidently without assistance',
      color: 'border-green-500 bg-green-50'
    }
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Check all rubric dimensions are filled
    rubricDimensions.forEach(dimension => {
      if (!formData[dimension.id]) {
        newErrors[dimension.id] = 'Please select a proficiency level';
      }
    });

    // Notes are optional, so no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle dimension selection
  const handleDimensionChange = (dimensionId, value) => {
    setFormData(prev => ({
      ...prev,
      [dimensionId]: value
    }));
    
    // Clear error for this dimension
    if (errors[dimensionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[dimensionId];
        return newErrors;
      });
    }
  };

  // Handle notes change
  const handleNotesChange = (e) => {
    setFormData(prev => ({
      ...prev,
      overall_notes: e.target.value
    }));
  };

  // Handle evidence file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
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
      verifier_evidence: [...prev.verifier_evidence, ...validFiles]
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove evidence file
  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index].url);
    
    setFormData(prev => ({
      ...prev,
      verifier_evidence: prev.verifier_evidence.filter((_, i) => i !== index)
    }));
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle submission
  const handleSubmit = async (status) => {
    if (!validateForm()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Prepare submission data
    const submissionData = new FormData();
    submissionData.append('spu_id', spu.id);
    submissionData.append('status', status); // 'verified' or 'rejected'
    submissionData.append('participation', formData.participation);
    submissionData.append('tool_handling', formData.tool_handling);
    submissionData.append('safety', formData.safety);
    submissionData.append('output_quality', formData.output_quality);
    submissionData.append('overall_notes', formData.overall_notes);
    
    // Add evidence files
    formData.verifier_evidence.forEach((file, index) => {
      submissionData.append(`verifier_evidence_${index}`, file);
    });

    await onSubmit(submissionData, status);
  };

  // Calculate completion percentage
  const completionPercentage = () => {
    const filledDimensions = rubricDimensions.filter(d => formData[d.id]).length;
    return Math.round((filledDimensions / rubricDimensions.length) * 100);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 rounded-t-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                Verification Assessment
              </h2>
              <p className="text-orange-100 text-sm mb-3">
                Evaluate learner performance across key dimensions
              </p>
              
              {/* SPU Info */}
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-white">
                  <p className="text-sm opacity-90 mb-1">Learner</p>
                  <p className="font-bold text-lg">{spu.learner_name}</p>
                </div>
                <div className="text-white mt-2">
                  <p className="text-sm opacity-90 mb-1">Skill</p>
                  <p className="font-semibold">{spu.skill_title}</p>
                </div>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-orange-100">
                    Context: <span className="font-semibold text-white">{spu.context_type}</span>
                  </span>
                  <span className="text-orange-100">
                    Level: <span className="font-semibold text-white">{spu.depth_level}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="ml-4 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              aria-label="Close form"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage()}%` }}
            />
          </div>
          <p className="text-orange-100 text-sm mt-2 text-right">
            {completionPercentage()}% Complete
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Rubric Dimensions */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Performance Assessment Rubric
            </h3>

            <div className="space-y-6">
              {rubricDimensions.map((dimension) => (
                <div key={dimension.id} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  {/* Dimension Header */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{dimension.icon}</span>
                      <h4 className="text-lg font-bold text-gray-900">
                        {dimension.title}
                      </h4>
                      <span className="text-red-500 text-lg">*</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-9">
                      {dimension.description}
                    </p>
                  </div>

                  {/* Proficiency Level Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                    {proficiencyLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => handleDimensionChange(dimension.id, level.value)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData[dimension.id] === level.value
                            ? `${level.color} shadow-md`
                            : 'bg-white border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-bold text-gray-900 text-sm">
                            {level.label}
                          </span>
                          {formData[dimension.id] === level.value && (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {level.description}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Error Message */}
                  {errors[dimension.id] && (
                    <p className="error-message mt-2 text-sm text-red-600 flex items-center gap-1 ml-9">
                      <AlertCircle className="w-4 h-4" />
                      {errors[dimension.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Overall Notes */}
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <label htmlFor="overall_notes" className="block text-sm font-bold text-gray-900 mb-2">
              Overall Assessment Notes (Optional)
            </label>
            <textarea
              id="overall_notes"
              value={formData.overall_notes}
              onChange={handleNotesChange}
              rows="5"
              placeholder="Provide detailed feedback, specific observations, areas for improvement, or commendations..."
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-blue-700">
                Share constructive feedback to help the learner grow
              </p>
              <span className={`text-xs ${formData.overall_notes.length > 900 ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
                {formData.overall_notes.length}/1000
              </span>
            </div>
          </div>

          {/* Verifier Evidence Upload */}
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Verification Evidence (Optional)
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Upload photos or videos of the verification session, workspace, or final output
            </p>

            {/* Upload Button */}
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 hover:border-purple-500 hover:bg-purple-100 transition-all text-center">
                <Upload className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Click to upload evidence
                </p>
                <p className="text-xs text-gray-500">
                  Images or videos (max 50MB each)
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

            {/* Preview Grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-purple-300">
                      {preview.type === 'photo' ? (
                        <>
                          <img
                            src={preview.url}
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            Photo
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-500">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Video
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      aria-label="Remove file"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={() => handleSubmit('rejected')}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <X className="w-5 h-5" />
                  Request Revision
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('verified')}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Verify & Approve
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
  const [showForm, setShowForm] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const sampleSPU = {
    id: 1,
    learner_name: 'Jane Doe',
    skill_title: 'Advanced TIG Welding Techniques',
    context_type: 'Juakali',
    depth_level: 4,
    competency_name: 'Welding',
    date_submitted: '2024-12-26T10:30:00Z'
  };

  const handleSubmit = async (formData, status) => {
    console.log('Submitting verification:', { formData, status });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real app:
    // const response = await fetch('/api/verify-spu/', {
    //   method: 'POST',
    //   body: formData
    // });
    
    setSubmitSuccess(true);
    setTimeout(() => {
      setShowForm(false);
    }, 2000);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Your progress will be lost.')) {
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50 py-8">
      {showForm ? (
        <VerificationForm
          spu={sampleSPU}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={false}
        />
      ) : (
        <div className="max-w-md mx-auto mt-20 bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {submitSuccess ? 'Verification Submitted!' : 'Form Closed'}
          </h3>
          <p className="text-gray-600 mb-6">
            {submitSuccess 
              ? 'The learner has been notified of your assessment.'
              : 'You can reopen the form anytime.'
            }
          </p>
          <button
            onClick={() => {
              setShowForm(true);
              setSubmitSuccess(false);
            }}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Open Form Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Demo;