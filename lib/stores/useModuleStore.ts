import { create } from 'zustand'
import {persist} from "zustand/middleware"


interface ModuleStore {
  name: String
  setModule: (name: String) => void
  clearModule: () => void
}

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set) => ({
     name: "",
      setModule: (name) => set({ name }),
      clearModule: () =>
        set({
            name : ""
        })
    }),
    {
      name: 'module',
    }
  )
)
