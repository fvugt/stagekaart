import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import InternshipPanel from './components/InternshipPanel';
import CompanyList from './components/CompanyList';
import TagFilter from './components/TagFilter';
import strapiData from './data/dataFromStrapi.json';

const ensureUrlProtocol = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed.replace(/^\/+/, '')}`;
};

const normalizeStrapiData = (rawData) => {
  if (!rawData || !Array.isArray(rawData.data)) return [];

  return rawData.data.map((company, index) => {
    const tagsArray = typeof company.tags === 'string'
      ? company.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : Array.isArray(company.tags)
        ? company.tags
        : [];

    const coordinates = (company.lat !== undefined && company.lon !== undefined)
      ? [Number(company.lat), Number(company.lon)].filter(num => !Number.isNaN(num))
      : null;

    return {
      id: company.id ?? index + 1,
      companyName: company.companyName ?? 'Onbekend bedrijf',
      coordinates: coordinates && coordinates.length === 2 ? coordinates : null,
      address: company.address ?? '',
      description: company.description ?? '',
      city: company.city ?? '',
      website: ensureUrlProtocol(company.website),
      email: company.email ?? '',
      phone: company.phone ?? '',
      tags: tagsArray,
      students: Array.isArray(company.studenten)
        ? company.studenten.map((student, studentIndex) => ({
            id: student.id ?? studentIndex,
            name: student.name ?? '',
            duration: student.duration ?? '',
            year: student.year ? (parseInt(student.year, 10) || student.year) : '',
            role: student.role ?? '',
            description: student.description ?? ''
          }))
        : []
    };
  });
};

const internshipsData = normalizeStrapiData(strapiData);

function App() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [zoomToInternship, setZoomToInternship] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  // Load internships data
  useEffect(() => {
    console.log('App: Loading internships data:', internshipsData);
    setInternships(internshipsData);
    setFilteredInternships(internshipsData);
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
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
    setZoomToInternship(internship);
    if (isMobile) {
      setShowMobilePanel(true);
    }
    // Don't clear search term to avoid map re-render issues
  }, [isMobile]);

  const handleSearchResultClick = useCallback((internship) => {
    setSelectedInternship(internship);
    setZoomToInternship(internship);
    setSearchTerm(''); // Clear search when selecting a result
    if (isMobile) {
      setShowMobilePanel(true);
    }
  }, [isMobile]);

  const handleClosePanel = () => {
    setSelectedInternship(null);
    if (isMobile) {
      setShowMobilePanel(false);
    }
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
      <div className={`fixed top-0 left-0 right-0 z-20 bg-white shadow-sm border-b border-gray-200 ${isMobile ? 'h-20' : 'h-16'} flex items-center justify-between px-4 md:px-6`}>
        <div className="flex-1 min-w-0">
          <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900 truncate`}>Stagekaart</h1>
          {!isMobile && (
            <p className="text-sm text-gray-600">Waar onze studenten afgelopen jaar stage hebben gelopen.</p>
          )}
        </div>
        <div className={`${isMobile ? 'w-48' : 'w-80'} flex-shrink-0`}>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredInternships={filteredInternships}
            onInternshipSelect={handleSearchResultClick}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={`absolute ${isMobile ? 'top-20' : 'top-16'} left-0 right-0 bottom-0 flex ${isMobile ? 'flex-col' : ''}`}>
        {/* Map Container */}
        <div className={`${isMobile ? 'w-full h-full' : 'w-2/3'} relative`}>
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
              tagCounts={tagCounts}
            />
          </div>

          {/* Mobile Panel Toggle Button */}
          {isMobile && (
            <div className="absolute bottom-4 right-4" style={{ zIndex: 1001 }}>
              <button
                onClick={() => setShowMobilePanel(!showMobilePanel)}
                className="bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Details Panel */}
        {!isMobile ? (
          <div className="w-1/3 bg-white border-l border-gray-200 overflow-hidden">
            {selectedInternship ? (
              <InternshipPanel
                internship={selectedInternship}
                onClose={handleClosePanel}
              />
            ) : (
              <CompanyList
                internships={filteredInternships}
                onCompanySelect={handleInternshipSelect}
              />
            )}
          </div>
        ) : (
          /* Mobile Panel - Slide up from bottom */
          <div className={`mobile-panel absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 transition-transform duration-300 ease-in-out ${
            showMobilePanel ? 'translate-y-0' : 'translate-y-full'
          }`} style={{ height: '70vh', zIndex: 1000 }}>
            <div className="h-full flex flex-col">
              {/* Mobile Panel Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  {selectedInternship && (
                    <button
                      onClick={handleClosePanel}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="Terug naar bedrijfslijst"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedInternship ? selectedInternship.companyName : 'Alle Bedrijven'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowMobilePanel(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Sluiten"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Panel Content */}
              <div className="flex-1 overflow-hidden">
                {selectedInternship ? (
                  <InternshipPanel
                    internship={selectedInternship}
                    onClose={handleClosePanel}
                    hideHeader={true}
                  />
                ) : (
                  <CompanyList
                    internships={filteredInternships}
                    onCompanySelect={handleInternshipSelect}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 