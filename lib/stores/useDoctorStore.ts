// stores/useDoctorStore.ts
import { create } from 'zustand'
import {persist} from "zustand/middleware"

interface Doctor {
  name: string
  image: string
}

interface DoctorStore {
  doctor: Doctor
  setDoctor: (doctor: Doctor) => void
  clearDoctor: () => void
}

export const useDoctorStore = create<DoctorStore>()(
  persist(
    (set) => ({
      doctor: {
        name: '',
        image: '',
      },
      setDoctor: (doctor) => set({ doctor }),
      clearDoctor: () =>
        set({
          doctor: {
            name: '',
            image: '',
          },
        }),
    }),
    {
      name: 'temp',
    }
  )
)
