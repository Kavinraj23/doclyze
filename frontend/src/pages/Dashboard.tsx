import React, { useState, useEffect } from 'react';
import ClassCard from '../components/ClassCard';
import type { AccentColor } from '../components/ClassCard';
import UploadModal from '../components/UploadModal';
import { fetchSyllabi, deleteSyllabus, updateSyllabusColor } from '../features/syllabi/syllabiApi';
import type { Syllabus } from '../features/syllabi/syllabiApi';
import SyllabusModal from '../components/SyllabusModal';

const DashboardPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    // Apply dark mode to body
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const loadSyllabi = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSyllabi();
      setSyllabi(data);
    } catch (error) {
      console.error('Error loading syllabi:', error);
      setError('Failed to load syllabi. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSyllabi();
  }, []);

  const handleUploadSuccess = async () => {
    try {
      await loadSyllabi();
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Error reloading syllabi after upload:', error);
      setError('Upload successful, but failed to refresh the list. Please reload the page.');
    }
  };

  const handleDeleteSyllabus = async (id: number) => {
    try {
      setError(null); // Clear any existing errors
      await deleteSyllabus(id);
      await loadSyllabi(); // Refresh the list
    } catch (error) {
      const err = error as { response?: { status: number } };
      console.error('Failed to delete syllabus:', err);
      const errorMessage = err.response?.status === 404
        ? 'Syllabus not found. It may have been already deleted.'
        : 'Failed to delete syllabus. Please try again.';
      setError(errorMessage);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleColorChange = async (syllabusId: number, color: AccentColor) => {
    try {
      setError(null);
      await updateSyllabusColor(syllabusId, color);
      // Update the local state to reflect the color change
      setSyllabi(prevSyllabi => prevSyllabi.map(syllabus => 
        syllabus.id === syllabusId 
          ? { ...syllabus, accent_color: color }
          : syllabus
      ));
    } catch (error) {
      console.error('Failed to update syllabus color:', error);
      setError('Failed to update color. Please try again.');
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteAllSyllabi = async () => {
    try {
      setError(null);
      // Delete each syllabus
      await Promise.all(syllabi.map(syllabus => deleteSyllabus(syllabus.id)));
      await loadSyllabi();
      setShowDeleteConfirmation(false);
      setShowSettingsPanel(false);
    } catch (error) {
      console.error('Error deleting all syllabi:', error);
      setError('Failed to delete all syllabi. Please try again.');
    }
  };

  const selectedSyllabus = syllabi.find(s => s.id === selectedClass);

  if (error) {
    console.error('Current error state:', error); // Debug log
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Study Snap
          </h2>
          <nav className="space-y-2">
            <button 
              className={`w-full text-left px-4 py-2 rounded-md font-medium 
                ${!showSettingsPanel ? 'bg-blue-50 text-blue-700' : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setShowSettingsPanel(false)}
            >
              Dashboard
            </button>
            <button 
              className={`w-full text-left px-4 py-2 rounded-md font-medium
                ${showSettingsPanel ? 'bg-blue-50 text-blue-700' : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setShowSettingsPanel(true)}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {showSettingsPanel ? (
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Dark Mode</span>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Delete All Classes</span>
                    <button
                      onClick={() => setShowDeleteConfirmation(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Delete All
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Classes</h1>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Upload Syllabus</span>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading syllabi...</p>
                  </div>
                ) : syllabi.length === 0 ? (
                  <div className="text-center py-12">
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      No syllabi uploaded yet. Click the Upload button to get started!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {syllabi.map((syllabus) => (
                      <ClassCard
                        key={syllabus.id}
                        syllabus={syllabus}
                        onClick={() => setSelectedClass(syllabus.id)}
                        onDelete={() => handleDeleteSyllabus(syllabus.id)}
                        accentColor={(syllabus.accent_color as AccentColor) || 'blue'}
                        onColorChange={(color) => handleColorChange(syllabus.id, color)}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete All Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full shadow-xl`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Delete All Classes
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete all classes? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllSyllabi}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        isDarkMode={isDarkMode}
      />

      {selectedSyllabus && (
        <SyllabusModal
          isOpen={selectedClass !== null}
          onClose={() => setSelectedClass(null)}
          syllabus={selectedSyllabus}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default DashboardPage;