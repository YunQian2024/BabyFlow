import type { FormulaMilk } from '@/db/schema'
import { create } from 'zustand'

interface FormulaMilkState {
  list: FormulaMilk[]
  form: FormulaMilk
  dailyTimes: number
  dailyMilkIntake: number
  listNeedReload: boolean
  setList: (v: FormulaMilk[]) => void
  setForm: (v: FormulaMilk) => void
  updateForm: (key: string, value: any) => void
  setDailyTimes: (v: number) => void
  setDailyMilkIntake: (v: number) => void
  setListNeedReload: (v: boolean) => void
}

export const useFormulaMilkStore = create<FormulaMilkState>()((set, get) => ({
  list: [],
  form: {} as FormulaMilk,
  dailyTimes: 0,
  dailyMilkIntake: 0,
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
  setDailyTimes: (v) => set(() => ({ dailyTimes: v })),
  setDailyMilkIntake: (v) => set(() => ({ dailyMilkIntake: v })),
  setListNeedReload: (v) => set(() => ({ listNeedReload: v })),
}))
