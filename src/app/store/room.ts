import { create } from 'zustand'

interface RoomState {
  list: number[]
  create: () => void
  join: () => void
}

export const useBearStore = create<RoomState>((set) => ({
  list: [],
  create: () => {
    const newList: number[] = []
    set((state) => ({ list: newList }))
  },
  join: () => {
    set({ list: [] })
  },
}))
