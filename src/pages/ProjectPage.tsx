import React, { useState, useEffect, useCallback } from 'react';
import { Project, Resource } from '../constants/interfaces';
import { useProjectStore } from '../store/projectStore';
import ResourceGrid from './ResourceGrid';
import ResourceViewer from '../components/ResourceViewer';
import { useNavigationStore } from '../store/navigationStore';

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
  
  const { selectedResourceId, setSelectedResourceId } = useNavigationStore();

  // Derive selectedResource from selectedResourceId and current project state
  const selectedResource = selectedResourceId ? project?.resources[selectedResourceId] : null;

  if (!project) return null;
  console.log(selectedResource);
  
  const handleTitleSubmit = () => {
    updateProjectById(project.id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleResourceAdd = (newResource: Resource) => {
    updateProjectById(project.id, {
      resources: {
        ...project.resources,
        [newResource.id]: newResource
      }
    });
  };

  const handleResourceDelete = (resourceId: string) => {
    const updatedResources = { ...project.resources };
    delete updatedResources[resourceId];
    updateProjectById(project.id, {
      resources: updatedResources
    });
  };

  const handleResourceUpdate = (resourceId: string, updates: Partial<Resource>) => {
    const currentProject = getProject();
    if (!currentProject) return;

    const resource = currentProject.resources[resourceId];
    if (!resource) return;

    // If resourceType changes, use the entire update object
    if (updates.resourceType && updates.resourceType !== resource.resourceType) {
      const newResource = updates as Resource;
      updateProjectById(currentProject.id, {
        resources: {
          ...currentProject.resources,
          [resourceId]: newResource
        }
      });
      return;
    }

    // Otherwise merge updates
    if (updates.stages) {
      const updatedStages = resource.stages.map(existingStage => {
        const updatedStage = updates.stages?.find(
          s => s.name === existingStage.name
        );
        return updatedStage || existingStage;
      });

      const updatedResource = {
        ...resource,
        ...updates,
        stages: updatedStages
      } as Resource;

      updateProjectById(currentProject.id, {
        resources: {
          ...currentProject.resources,
          [resourceId]: updatedResource
        }
      });
      return;
    }

    const updatedResource = {
      ...resource,
      ...updates
    } as Resource;

    updateProjectById(currentProject.id, {
      resources: {
        ...currentProject.resources,
        [resourceId]: updatedResource
      }
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
          {selectedResource && (
            <div className="h-full bg-white rounded-lg shadow">
              <ResourceViewer
                resource={selectedResource}
                onResourceUpdate={handleResourceUpdate}
              />
            </div>
          )}
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
              {Object.keys(project.resources).length} resources
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
            onResourceSelect={(resource) => setSelectedResourceId(resource.id)}
            selectedResourceId={selectedResourceId}
          />}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
