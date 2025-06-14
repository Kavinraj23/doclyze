import React, { useState } from 'react';
import type { Syllabus } from '../features/syllabi/syllabiApi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  syllabus: Syllabus;
  isDarkMode?: boolean;
}

interface EditableSyllabusFields {
  important_dates: {
    first_class: string;
    last_class: string;
    midterms: string[];
    final_exam: string;
  };
}

const SyllabusModal: React.FC<ModalProps> = ({ isOpen, onClose, syllabus, isDarkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<EditableSyllabusFields>({
    important_dates: { ...syllabus.important_dates }
  });

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col transform transition-all`}>
        {/* Header */}
        <div className={`p-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-start sticky top-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} z-10`}>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {syllabus.course_code}
              </h2>
              <span className={`px-2 py-1 rounded text-sm font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                {syllabus.term.semester} {syllabus.term.year}
              </span>
            </div>
            <p className={`text-lg leading-snug ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {syllabus.course_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDarkMode 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            } transition-colors`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Instructor Info */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <svg className="w-5 h-5 mr-2 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Instructor
            </h3>
            <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className="font-medium">{syllabus.instructor.name}</p>
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {syllabus.instructor.email}
              </p>
            </div>
          </div>

          {/* Meeting Info */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <svg className="w-5 h-5 mr-2 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Meeting Information
            </h3>
            <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {syllabus.meeting_info.days}
              </p>
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {syllabus.meeting_info.time}
              </p>
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {syllabus.meeting_info.location}
              </p>
            </div>
          </div>

          {/* Important Dates */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-lg font-semibold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <svg className="w-5 h-5 mr-2 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Important Dates
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`text-sm px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1 ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200/70 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>
            <div className={`grid gap-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  First Class
                </span>
                <span className="font-medium">{formatDate(syllabus.important_dates.first_class)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Last Class
                </span>
                <span className="font-medium">{formatDate(syllabus.important_dates.last_class)}</span>
              </div>
              {syllabus.important_dates.midterms.map((date, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Midterm {index + 1}
                  </span>
                  <span className="font-medium">{formatDate(date)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Final Exam
                </span>
                <span className="font-medium">{formatDate(syllabus.important_dates.final_exam)}</span>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <svg className="w-5 h-5 mr-2 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Course Description
            </h3>
            <p className={`whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {syllabus.description}
            </p>
          </div>

          {/* Calendar Sync Button */}
          <div className="flex justify-end pt-2">
            <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Sync to Google Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SyllabusModal;
