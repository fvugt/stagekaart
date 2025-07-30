import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, filteredInternships, onInternshipSelect }) => {
  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <div className="absolute right-3 top-2.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Search Results */}
      {searchTerm && filteredInternships.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2 space-y-1">
            {filteredInternships.map((internship) => (
              <div
                key={internship.id}
                onClick={() => onInternshipSelect(internship)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer transition-colors"
              >
                <div className="flex items-center">
                  {internship.logo && (
                    <img
                      src={internship.logo}
                      alt={internship.companyName}
                      className="w-6 h-6 mr-2 object-contain"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{internship.companyName}</h4>
                    <p className="text-xs text-gray-600">{internship.city}</p>
                    <p className="text-xs text-gray-500">{internship.students.length} student{internship.students.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {searchTerm && filteredInternships.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 text-center text-gray-500 text-sm bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          No companies found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBar; 