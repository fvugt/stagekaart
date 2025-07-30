import React from 'react';

const TagFilter = ({ 
  selectedTags, 
  onTagToggle, 
  availableTags, 
  stats,
  tagCounts
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1" style={{ zIndex: 9999 }}>
      {/* Technology Tags with Counts */}
      <div className="flex flex-wrap gap-1 justify-center mb-1">
        {availableTags.map((tag) => {
          const count = tagCounts?.[tag] || 0;
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag} ({count})
            </button>
          );
        })}
      </div>

      {/* Stats - Below tags */}
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
        <span><strong>{stats?.companies}</strong> companies</span>
        <span><strong>{stats?.internships}</strong> internships</span>
        <span><strong>{stats?.cities}</strong> cities</span>
      </div>
    </div>
  );
};

export default TagFilter; 