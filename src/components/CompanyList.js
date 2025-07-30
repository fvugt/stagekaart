import React from 'react';

const CompanyList = ({ internships, onCompanySelect }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Companies</h2>
          <p className="text-sm text-gray-600">{internships.length} companies available</p>
        </div>
      </div>

      {/* Company List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {internships.map((internship, index) => (
            <div
              key={index}
              onClick={() => onCompanySelect(internship)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start space-x-3">
                {/* Company Logo */}
                {internship.logo && (
                  <img
                    src={internship.logo}
                    alt={internship.companyName}
                    className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1 flex-shrink-0"
                  />
                )}
                
                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {internship.companyName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{internship.city}</p>
                      
                      {/* Tags */}
                      {internship.tags && internship.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {internship.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {internship.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{internship.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Student Count */}
                    <div className="text-right ml-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {internship.students.length} student{internship.students.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyList; 