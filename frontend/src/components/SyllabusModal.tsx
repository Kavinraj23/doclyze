import React, { useState } from 'react';
import type { Syllabus } from '../features/syllabi/syllabiApi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  syllabus: Syllabus;
}

interface EditableSyllabusFields {
  important_dates: {
    first_class: string;
    last_class: string;
    midterms: string[];
    final_exam: string;
  };
}

const SyllabusModal: React.FC<ModalProps> = ({ isOpen, onClose, syllabus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<EditableSyllabusFields>({
    important_dates: { ...syllabus.important_dates }
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      // TODO: Implement API call to update syllabus
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update syllabus:', error);
    }
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateChange = (field: keyof EditableSyllabusFields['important_dates'], value: string) => {
    setEditedFields({
      ...editedFields,
      important_dates: {
        ...editedFields.important_dates,
        [field]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
      <div className="bg-white rounded-xl max-w-4xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{syllabus.course_name}</h2>
            <p className="text-lg text-blue-600 font-medium">{syllabus.course_code}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isEditing 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Dates'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Course Info */}
            <section className="bg-gray-50 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Instructor
                </h3>
                <p className="text-gray-900 font-medium text-lg">{syllabus.instructor.name}</p>
                <a href={`mailto:${syllabus.instructor.email}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                  {syllabus.instructor.email}
                </a>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Term
                </h3>
                <p className="text-gray-900 text-lg">{syllabus.term.semester} {syllabus.term.year}</p>
              </div>

              {/* Meeting Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Meeting Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-900 flex items-center">
                    <span className="w-20 text-gray-500">Days:</span>
                    {syllabus.meeting_info.days}
                  </p>
                  <p className="text-gray-900 flex items-center">
                    <span className="w-20 text-gray-500">Time:</span>
                    {syllabus.meeting_info.time}
                  </p>
                  <p className="text-gray-900 flex items-center">
                    <span className="w-20 text-gray-500">Location:</span>
                    {syllabus.meeting_info.location}
                  </p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Description
              </h3>
              <p className="text-gray-900 leading-relaxed">{syllabus.description}</p>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Important Dates - Editable */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Important Dates
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">First Class</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedFields.important_dates.first_class.split('T')[0]}
                      onChange={(e) => handleDateChange('first_class', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formatDate(syllabus.important_dates.first_class)}</p>
                  )}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">Last Class</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedFields.important_dates.last_class.split('T')[0]}
                      onChange={(e) => handleDateChange('last_class', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formatDate(syllabus.important_dates.last_class)}</p>
                  )}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">Final Exam</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedFields.important_dates.final_exam.split('T')[0]}
                      onChange={(e) => handleDateChange('final_exam', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formatDate(syllabus.important_dates.final_exam)}</p>
                  )}
                </div>
                {syllabus.important_dates.midterms.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-2">Midterms</p>                    {isEditing ? (
                      syllabus.important_dates.midterms.map((_, index) => (
                        <input
                          key={index}
                          type="date"
                          value={editedFields.important_dates.midterms[index].split('T')[0]}
                          onChange={(e) => {
                            const newMidterms = [...editedFields.important_dates.midterms];
                            newMidterms[index] = e.target.value;
                            setEditedFields({
                              ...editedFields,
                              important_dates: {
                                ...editedFields.important_dates,
                                midterms: newMidterms
                              }
                            });
                          }}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                        />
                      ))
                    ) : (
                      syllabus.important_dates.midterms.map((date, index) => (
                        <p key={index} className="text-gray-900">{formatDate(date)}</p>
                      ))
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Grading Policy */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Grading Policy
              </h3>
              <div className="space-y-2 bg-white rounded-lg divide-y divide-gray-100">
                {Object.entries(syllabus.grading_policy).map(([category, value]) => (
                  <div key={category} className="flex justify-between p-3">
                    <span className="text-gray-900 font-medium">{category}</span>
                    <span className="text-blue-600">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-gray-100">
          {isEditing && (
            <button
              className="w-full sm:flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
              onClick={handleSave}
            >
              <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Save Changes
            </button>
          )}
          <button
            className="w-full sm:flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
            onClick={() => window.open(`/api/syllabi/${syllabus.id}/pdf`, '_blank')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            View Syllabus PDF
          </button>          <button
            className="w-full sm:flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium"
            onClick={() => console.log('Sync to Google Calendar')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Sync to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyllabusModal;
