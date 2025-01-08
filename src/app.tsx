import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { Sidebar } from './components/sidebar';
import ProjectsGrid from './pages/ProjectGrid';
import ProjectPage from './pages/ProjectPage';
import { Project } from './constants/interfaces';

const App = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-300">
      <Sidebar />
      <div className="flex-1">
        {selectedProject ? (
          <ProjectPage 
            projectId={selectedProject.id} 
            onBack={() => setSelectedProject(null)} 
          />
        ) : (
          <>
            <h2 className="text-black text-2xl p-4">Projects</h2>
            <ProjectsGrid onProjectSelect={setSelectedProject} />
          </>
        )}
      </div>
    </div>
  );
};

const container = document.createElement('div');
container.style.position = 'absolute';
container.style.top = '0';
container.style.left = '0';
container.style.right = '0';
container.style.bottom = '0';
document.body.appendChild(container);

const root = createRoot(container);
root.render(<App />);