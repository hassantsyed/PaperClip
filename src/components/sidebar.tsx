import React from 'react';
import { useProjectStore } from '../store/projectStore';
import { useNavigationStore } from '../store/navigationStore';
import { getResourceTitle } from '../constants/utils';

export const Sidebar: React.FC = () => {
  const projects = useProjectStore(state => state.projects);
  const { 
    selectedProject, 
    setSelectedProject,
    selectedResourceId,
    setSelectedResourceId 
  } = useNavigationStore();

  return (
    <div 
      className="group relative w-8 hover:w-64 transition-all duration-300 bg-slate-300 h-screen"
    >
      <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black">
        <div className="absolute right-0 top-[200px] transform translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 border-2 border-black flex items-center justify-center">
          <span className="transform rotate-0">❯</span>
        </div>
      </div>
      <div className="p-4 invisible group-hover:visible whitespace-nowrap">
        <h1 className="text-black text-2xl font-bold mb-4">PaperClip</h1>
        <div className="space-y-2">
          {projects.map(project => (
            <div key={project.id}>
              <div
                onClick={() => setSelectedProject(project)}
                className={`cursor-pointer p-2 rounded transition-colors duration-200 ${
                  selectedProject?.id === project.id 
                    ? 'bg-slate-400 text-white' 
                    : 'hover:bg-slate-200'
                }`}
              >
                {project.title}
              </div>
              {selectedProject?.id === project.id && (
                <div className="ml-4 mt-1 space-y-1">
                  {Object.values(project.resources)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(resource => (
                      <div
                        key={resource.id}
                        onClick={() => setSelectedResourceId(resource.id)}
                        className={`text-sm truncate py-1 px-2 rounded cursor-pointer ${
                          selectedResourceId === resource.id
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-600 hover:bg-slate-200'
                        }`}
                      >
                        {getResourceTitle(resource)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};