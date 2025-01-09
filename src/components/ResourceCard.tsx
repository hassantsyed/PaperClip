import React from 'react';
import { Resource, TERMINAL_REOSURCE_STATES } from '../constants/interfaces';

interface ResourceCardProps {
  resource: Resource;
  onDelete?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete }) => {
  const getResourceIcon = () => {
    switch (resource.resourceType) {
      case 'pdf':
        return '📄';
      case 'file':
        return '📁';
      case 'link':
        return '🔗';
      default:
        return '📎';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const isTerminal = TERMINAL_REOSURCE_STATES.includes(resource.status);

  return (
    <div className="relative w-48 h-48 border-2 border-slate-400 rounded-lg p-4 
                    cursor-pointer hover:bg-slate-200 transition-colors duration-200">
      {!isTerminal && (
        <div className="absolute top-2 right-2 w-6 h-6">
          <div className="w-full h-full border-4 border-slate-400 border-t-slate-800 
                         rounded-full animate-spin"></div>
        </div>
      )}
      {isTerminal && onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-300 
                     flex items-center justify-center text-white hover:bg-red-500 
                     transition-colors duration-200 text-lg font-bold"
        >
          ×
        </button>
      )}
      <div className="text-4xl mb-2">{getResourceIcon()}</div>
      <h3 className="text-black font-bold truncate">
        {resource.resourceType === 'file' ? resource.filename :
         resource.resourceType === 'link' ? resource.title || resource.url :
         resource.resourceType === 'pdf' ? resource.title :
         'Untitled Resource'}
      </h3>
      <div className="text-sm text-gray-600 mt-2">
        {new Date(resource.createdAt).toLocaleDateString()}
      </div>
      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {resource.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-slate-400 text-white px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}; 