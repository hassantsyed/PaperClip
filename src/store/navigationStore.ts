import { create } from 'zustand'
import { Project, Resource } from '../constants/interfaces'

interface NavigationState {
  selectedProject: Project | null
  selectedResourceId: string | null
  setSelectedProject: (project: Project | null) => void
  setSelectedResourceId: (resourceId: string | null) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  selectedProject: null,
  selectedResourceId: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
  setSelectedResourceId: (resourceId) => set({ selectedResourceId: resourceId }),
}))