import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import InternshipPanel from './components/InternshipPanel';
import TagFilter from './components/TagFilter';
import internshipsData from './data/internships.json';

function App() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [zoomToInternship, setZoomToInternship] = useState(null);

  // Load internships data
  useEffect(() => {
    console.log('App: Loading internships data:', internshipsData);
    setInternships(internshipsData);
    setFilteredInternships(internshipsData);
  }, []);

  // Get all unique tags from internships
  const availableTags = useMemo(() => {
    const tags = new Set();
    internships.forEach(internship => {
      if (internship.tags) {
        internship.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [internships]);

  // Filter internships based on search term and selected tags
  useEffect(() => {
    let filtered = internships;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((internship) => {
        const searchLower = searchTerm.toLowerCase();
        return internship.companyName.toLowerCase().includes(searchLower);
      });
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((internship) => {
        return internship.tags && selectedTags.some(tag => internship.tags.includes(tag));
      });
    }

    setFilteredInternships(filtered);
  }, [searchTerm, selectedTags, internships]);

  const handleInternshipSelect = useCallback((internship) => {
    setSelectedInternship(internship);
    // Don't clear search term to avoid map re-render issues
  }, []);

  const handleSearchResultClick = useCallback((internship) => {
    setSelectedInternship(internship);
    setZoomToInternship(internship);
    setSearchTerm(''); // Clear search when selecting a result
  }, []);

  const handleClosePanel = () => {
    setSelectedInternship(null);
  };

  const handleTagToggle = useCallback((tag) => {
    if (tag === 'clear') {
      setSelectedTags([]);
    } else {
      setSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    }
  }, []);

  // Calculate total students across all companies
  const totalStudents = internships.reduce((total, internship) => total + internship.students.length, 0);

  // Calculate tag counts
  const tagCounts = useMemo(() => {
    const counts = {};
    availableTags.forEach(tag => {
      counts[tag] = internships.filter(internship => 
        internship.tags && internship.tags.includes(tag)
      ).length;
    });
    return counts;
  }, [internships, availableTags]);

  return (
    <div className="h-screen w-full bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">StageKaart</h1>
          <p className="text-sm text-gray-600">Interactive map of student internships in the Netherlands</p>
        </div>
        <div className="w-80">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredInternships={filteredInternships}
            onInternshipSelect={handleSearchResultClick}
          />
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="absolute top-16 left-0 right-0 bottom-0 flex">
        {/* Map Container - Left Side (2/3 width) */}
        <div className="w-2/3 relative">
          <Map
            internships={filteredInternships}
            selectedInternship={selectedInternship}
            onInternshipSelect={handleInternshipSelect}
            zoomToInternship={zoomToInternship}
            onZoomComplete={() => setZoomToInternship(null)}
          />

          {/* Tag Filter - Overlay on map with high z-index */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2" style={{ zIndex: 99999 }}>
            <TagFilter
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availableTags={availableTags}
              stats={{
                companies: filteredInternships.length,
                internships: totalStudents,
                cities: new Set(internships.map(i => i.city)).size
              }}
              tagCounts={tagCounts}
            />
          </div>
        </div>

        {/* Details Panel - Right Side (1/3 width) */}
        <div className="w-1/3 bg-white border-l border-gray-200 overflow-hidden">
          {selectedInternship ? (
            <InternshipPanel
              internship={selectedInternship}
              onClose={handleClosePanel}
            />
          ) : (
            <div className="p-6 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Company</h3>
              <p className="text-sm">Click on a pin on the map to view detailed information about the company and its internships.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 