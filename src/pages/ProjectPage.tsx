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
  const getProject = () => useProjectStore.getState().projects.find(p => p.id === projectId);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!project) return null;
  console.log(project.resources);

  const handleTitleSubmit = () => {
    updateProjectById(project.id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleResourceAdd = (newResource: Resource) => {
    updateProjectById(project.id, {
      resources: [...project.resources, newResource]
    });
  };

  const handleResourceDelete = (resourceId: string) => {
    console.log("RESOURCE DELETING");
    updateProjectById(project.id, {
      resources: project.resources.filter(resource => resource.id !== resourceId)
    });
  };

  const handleResourceUpdate = (resourceId: string, updatedResource: Resource) => {
    console.log("RESOURCE UPDATING");
    const currentProject = getProject();
    console.log("Current resources:", currentProject?.resources);
    console.log("Looking for resource with ID:", resourceId);
    console.log("Updated resource:", updatedResource);
    
    if (!currentProject) return;

    const updatedResources = currentProject.resources.map(resource => {
      if (resource.id === resourceId) {
        console.log("Found matching resource:", resource);
        return updatedResource;
      }
      return resource;
    });
    
    console.log("Updated resources array:", updatedResources);
    
    updateProjectById(currentProject.id, {
      resources: updatedResources
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
          style={{ height: isExpanded ? '40%' : '85%' }}
        >
          {/* Add your upper content here */}
        </div>
        <div className="absolute w-full select-none z-10">
          <div 
            className="absolute w-full border-t-4 border-black border-dotted"
            style={{ top: isExpanded ? '40vh' : '85vh' }}
          >
            <div 
              className="absolute left-1/2 -translate-x-1/2 -translate-y-10 
                        cursor-pointer p-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span 
                className="block transform transition-transform duration-300 text-black text-xl"
                style={{ transform: `rotate(${isExpanded ? '90deg' : '-90deg'})` }}
              >
                ❯
              </span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                          bg-slate-300 px-4 text-sm text-slate-500">
              {project.resources.length} resources
            </div>
          </div>
        </div>
        <div 
          className={`absolute left-0 right-0 bottom-0 transition-all duration-300`}
          style={{ 
            top: isExpanded ? 'calc(40vh + 20px)' : 'calc(85vh + 20px)',
          }}
        >
          {isExpanded && <ResourceGrid 
            resources={project.resources} 
            onResourceAdd={handleResourceAdd}
            onResourceDelete={handleResourceDelete}
            onResourceUpdate={handleResourceUpdate}
          />}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
