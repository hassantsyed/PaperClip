import React from 'react';
import { Project } from '../constants/interfaces';

interface ProjectCardProps {
  project?: Project;
  isCreateNew?: boolean;
  onClick: () => void;
  onDelete?: () => void;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  isCreateNew, 
  onClick, 
  onDelete,
  index 
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  if (isCreateNew) {
    return (
      <div 
        onClick={onClick}
        className="w-48 h-48 border-4 border-dashed border-black rounded-lg 
                   flex items-center justify-center cursor-pointer hover:bg-slate-200 
                   transition-colors duration-200"
      >
        <span className="text-black text-center">Create New Project</span>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="relative w-48 h-48 border-2 border-black rounded-lg p-4 
                 cursor-pointer hover:bg-slate-200 transition-colors duration-200"
    >
      {!isCreateNew && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 
                     flex items-center justify-center text-white hover:bg-red-600 
                     transition-colors duration-200"
        >
          ×
        </button>
      )}
      <h3 className="text-black font-bold">{project?.title}</h3>
      <div className="text-sm text-gray-600 mt-2">
        {Object.keys(project?.resources || {}).length} Resources
      </div>
    </div>
  );
}; 