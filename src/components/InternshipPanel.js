import React from 'react';

const InternshipPanel = ({ internship, onClose }) => {
  if (!internship) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900">Company Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Company Information */}
        <div className="p-6 border-b border-gray-200">
          {/* Company Logo and Name */}
          <div className="flex items-center mb-4">
            {internship.logo && (
              <img
                src={internship.logo}
                alt={internship.companyName}
                className="w-16 h-16 mr-4 object-contain bg-gray-50 rounded-lg p-2"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{internship.companyName}</h3>
              <p className="text-sm text-gray-600">{internship.city}</p>
            </div>
          </div>

          {/* Company Description */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">About {internship.companyName}</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{internship.description}</p>
          </div>

          {/* Company Tags */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Technology Focus</h4>
            <div className="flex flex-wrap gap-2">
              {internship.tags && internship.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Company Location */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Location</h4>
            <p className="text-sm text-gray-700">{internship.address}</p>
          </div>

          {/* Contact Information */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
            {(internship.email || internship.phone) ? (
              <div className="space-y-2">
                {internship.email && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${internship.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                      {internship.email}
                    </a>
                  </div>
                )}
                {internship.phone && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${internship.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                      {internship.phone}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                For contact information, please visit the company website.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => {
                // Open Google Maps with the address
                const encodedAddress = encodeURIComponent(internship.address);
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              View on Google Maps
            </button>
            {internship.website && (
              <button
                onClick={() => window.open(internship.website, '_blank')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Visit Website
              </button>
            )}
          </div>
        </div>

        {/* Students Section */}
        <div className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Student Internships ({internship.students.length})
          </h4>
          
          <div className="space-y-4 overflow-y-auto">
            {internship.students.map((student, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-gray-900">{student.name}</h5>
                    <p className="text-sm text-blue-600 font-medium">{student.role}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>{student.duration}</p>
                    <p>{student.year}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{student.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipPanel; 