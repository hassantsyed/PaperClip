import React from 'react';
import { Resource } from '../constants/interfaces';

interface ResourceCardProps {
  resource: Resource;
  onDelete: () => void;
  onSelect: () => void;
  isSelected?: boolean;
}

const isTerminal = (resource: Resource): boolean => {
    // Resource is terminal when all stages are DONE or ERROR
    return resource.stages.every(stage => 
        stage.status === 'DONE' || stage.status === 'ERROR'
    );
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete, onSelect, isSelected }) => {
  const terminal = isTerminal(resource);
  console.log(terminal);
  console.log(resource);

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

  // Add click handler for the entire card
  const handleClick = () => {
    onSelect();
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative w-48 h-48 border-2 rounded-lg p-4 
                cursor-pointer hover:bg-slate-200 transition-colors duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' 
                  : 'border-slate-400'}`}
    >
      {!terminal && (
        <div className="absolute top-2 right-2 w-6 h-6">
          <div className="w-full h-full border-4 border-slate-400 border-t-slate-800 
                         rounded-full animate-spin"></div>
        </div>
      )}
      {terminal && onDelete && (
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