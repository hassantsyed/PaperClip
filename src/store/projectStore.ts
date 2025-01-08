import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Project } from '../constants/interfaces'

interface ProjectState {
  projects: Project[]
  addProject: (project: Project) => void
  deleteProject: (index: number) => void
  setProjects: (projects: Project[]) => void
  updateProjectById: (id: string, updates: Partial<Project>) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (project) => set((state) => ({ 
        projects: [...state.projects, project] 
      })),
      deleteProject: (index) => set((state) => ({
        projects: state.projects.filter((_, i) => i !== index)
      })),
      setProjects: (projects) => set({ projects }),
      updateProjectById: (id, updates) => set((state) => ({
        projects: state.projects.map(project => 
          project.id === id 
            ? { ...project, ...updates }
            : project
        )
      })),
    }),
    {
      name: 'project-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const data = await window.electronAPI.db.get(name);
          return JSON.parse(data || 'null');
        },
        setItem: async (name, value) => {
          await window.electronAPI.db.set(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await window.electronAPI.db.set(name, null);
        },
      })),
    }
  )
)