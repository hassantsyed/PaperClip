import React, { version } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { useProjectStore } from '../store/projectStore';
import { Project, Resource } from '../constants/interfaces';
import { useNavigationStore } from '../store/navigationStore';

const ProjectsGrid:React.FC = () => {
  const { projects, addProject, deleteProject } = useProjectStore();
  const setSelectedProject = useNavigationStore(state => state.setSelectedProject);

  const handleCreateNew = () => {
    const newProject = {
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      title: `Project ${projects.length + 1}`,
      resources: {} as { [id: string]: Resource },
      createdAt: new Date(),
      version: "0.0.1" as const
    };
    addProject(newProject);
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          project={project}
          onClick={() => setSelectedProject(project)}
          onDelete={() => deleteProject(index)}
          index={index}
        />
      ))}
      <ProjectCard isCreateNew onClick={handleCreateNew} />
    </div>
  );
};

export default ProjectsGrid;
