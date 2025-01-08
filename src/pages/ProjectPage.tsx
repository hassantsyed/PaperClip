import React, { useState, useEffect, useCallback } from 'react';
import { Project, Resource } from '../constants/interfaces';
import { useProjectStore } from '../store/projectStore';
import ResourceGrid from './ResourceGrid';

interface ProjectPageProps {
  projectId: string;
  onBack: () => void;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ projectId, onBack }) => {
  const project = useProjectStore(state => 
    state.projects.find(p => p.id === projectId)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project?.title ?? '');
  const updateProjectById = useProjectStore(state => state.updateProjectById);
  const [dividerPosition, setDividerPosition] = useState(300);
  const [isDragging, setIsDragging] = useState(false);

  if (!project) return null;

  const handleTitleSubmit = () => {
    updateProjectById(project.id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const container = document.querySelector('.p-4');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newPosition = Math.max(0, e.y - containerRect.top);
        setDividerPosition(newPosition);
      }
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleResourceAdd = (newResource: Resource) => {
    updateProjectById(project.id, {
      resources: [...project.resources, newResource]
    });
  };

  const handleResourceDelete = (resourceId: string) => {
    updateProjectById(project.id, {
      resources: project.resources.filter(resource => resource.id !== resourceId)
    });
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center 
                   hover:bg-slate-500 transition-colors duration-200"
        >
          ←
        </button>
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-3xl font-bold bg-transparent border-b-2 border-slate-500 
                     focus:border-slate-700 outline-none px-2 py-1 min-w-[200px]
                     transition-colors duration-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setEditedTitle(project.title);
                setIsEditing(false);
              }
            }}
            onBlur={handleTitleSubmit}
            autoFocus
          />
        ) : (
          <h1 
            className="text-3xl font-bold cursor-pointer hover:bg-slate-100 
                     px-2 py-1 rounded transition-colors duration-200"
            onClick={() => setIsEditing(true)}
          >
            {project.title}
          </h1>
        )}
      </div>
      <div className="flex-1 relative">
        <div 
          className="absolute top-0 left-0 right-0"
          style={{ height: `${dividerPosition}px` }}
        >
          {/* Add your upper content here */}
        </div>
        <div 
          className="absolute w-full select-none cursor-ns-resize"
          style={{ top: `${dividerPosition}px` }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute w-full border-t-4 border-black border-dotted">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                          bg-slate-300 px-4 text-sm text-slate-500">
              {project.resources.length} resources
            </div>
          </div>
        </div>
        <div 
          className="absolute left-0 right-0 bottom-0 bg-white"
          style={{ top: `${dividerPosition + 20}px` }}
        >
          <ResourceGrid 
            resources={project.resources} 
            onResourceAdd={handleResourceAdd}
            onResourceDelete={handleResourceDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
