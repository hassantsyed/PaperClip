import { createRoot } from 'react-dom/client';
import { Sidebar } from './components/sidebar';
import ProjectsGrid from './pages/ProjectGrid';
import ProjectPage from './pages/ProjectPage';
import { useNavigationStore } from './store/navigationStore';

const App = () => {
  const selectedProject = useNavigationStore(state => state.selectedProject);

  return (
    <div className="flex min-h-screen bg-slate-300">
      <Sidebar />
      <div className="flex-1">
        {selectedProject ? (
          <ProjectPage 
            projectId={selectedProject.id} 
            onBack={() => useNavigationStore.getState().setSelectedProject(null)} 
          />
        ) : (
          <>
            <h2 className="text-black text-2xl p-4">Projects</h2>
            <ProjectsGrid />
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