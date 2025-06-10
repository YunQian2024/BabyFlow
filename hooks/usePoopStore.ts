import type { Poop } from '@/db/schema'
import { create } from 'zustand'

interface PoopState {
  list: Poop[]
  form: Poop
  poopTimes: number
  listNeedReload: boolean
  setList: (v: Poop[]) => void
  setForm: (v: Poop) => void
  updateForm: (key: string, value: any) => void
  setPoopTimes: (v: number) => void
  setListNeedReload: (v: boolean) => void
}

export const usePoopStore = create<PoopState>()((set, get) => ({
  list: [],
  form: {} as Poop,
  poopTimes: 0,
  listNeedReload: true,
  setList: (v) => set(() => ({ list: v })),
  setForm: (v) => set(() => ({ form: v })),
  updateForm: (k, v) =>
    set(() => ({
      form: {
        ...get().form,
        [k]: v,
      },
    })),
  setPoopTimes: (v) => set(() => ({ poopTimes: v })),
  setListNeedReload: (v) => set(() => ({ listNeedReload: v })),
}))
