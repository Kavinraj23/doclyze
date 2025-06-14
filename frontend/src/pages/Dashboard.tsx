import React, { useState, useEffect } from 'react';
import ClassCard from '../components/ClassCard';
import UploadModal from '../components/UploadModal';
import { fetchSyllabi, deleteSyllabus } from '../features/syllabi/syllabiApi';
import type { Syllabus } from '../features/syllabi/syllabiApi';
import SyllabusModal from '../components/SyllabusModal';

const DashboardPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const loadSyllabi = async () => {
    try {
      setLoading(true);
      const data = await fetchSyllabi();
      setSyllabi(data);
    } catch (error) {
      setError('Failed to load syllabi. Please try again later.');
      console.error('Error loading syllabi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSyllabi();
  }, []);

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

  const selectedSyllabus = syllabi.find(s => s.id === selectedClass);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Study Snap</h2>
          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">
              Dashboard
            </button>
            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
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
            
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your classes...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => {
                    setError(null);
                    loadSyllabi();
                  }} 
                  className="mt-2 text-red-600 hover:text-red-700 underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Class Cards Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {syllabi.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600">No classes found. Upload a syllabus to get started.</p>
                  </div>
                ) : (
                  syllabi.map((syllabus) => (
                    <ClassCard
                      key={syllabus.id}
                      syllabus={syllabus}
                      onClick={() => setSelectedClass(syllabus.id)}
                      onDelete={handleDeleteSyllabus}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedSyllabus && (
        <SyllabusModal
          isOpen={selectedClass !== null}
          onClose={() => setSelectedClass(null)}
          syllabus={selectedSyllabus}
        />
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={loadSyllabi}
      />
    </div>
  );
};

export default DashboardPage;