import { create } from 'zustand'

const useAuth = create<{ name: string; update: (name: string) => void }>(
  (set) => ({
    name: '',
    update: (name: string) => set({ name: name }),
  })
)

export default useAuth
