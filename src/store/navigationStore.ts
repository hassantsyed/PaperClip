import { create } from 'zustand'
import { Project } from '../constants/interfaces'

interface NavigationState {
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
}))