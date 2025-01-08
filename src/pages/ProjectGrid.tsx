import React from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { useProjectStore } from '../store/projectStore';
import { Project, Resource } from '../constants/interfaces';

interface ProjectsGridProps {
  onProjectSelect: (project: Project) => void;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ onProjectSelect }) => {
  const { projects, addProject, deleteProject } = useProjectStore();

  const handleCreateNew = () => {
    const newProject = {
      id: crypto.randomUUID(),
      title: `Project ${projects.length + 1}`,
      resources: [] as Resource[]
    };
    addProject(newProject);
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          project={project}
          onClick={() => onProjectSelect(project)}
          onDelete={() => deleteProject(index)}
          index={index}
        />
      ))}
      <ProjectCard isCreateNew onClick={handleCreateNew} />
    </div>
  );
};

export default ProjectsGrid;
