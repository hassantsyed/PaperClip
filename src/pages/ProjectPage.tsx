import React, { useState } from 'react';
import { Project } from '../constants/interfaces';
import { useProjectStore } from '../store/projectStore';

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

  if (!project) return null;

  const handleTitleSubmit = () => {
    updateProjectById(project.id, { title: editedTitle });
    setIsEditing(false);
  };

  return (
    <div className="p-4">
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
      <div className="grid grid-cols-1 gap-4">
        {project.resources.map((resource, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow">
            {/* Resource content here */}
            <pre>{JSON.stringify(resource, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPage;
