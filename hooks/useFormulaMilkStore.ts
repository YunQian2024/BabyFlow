import { InferSelectModel } from 'drizzle-orm';
import { create } from 'zustand';
import { formulaMilkTable } from '../db/schema';

type FormulaMilk = InferSelectModel<typeof formulaMilkTable>;

interface FormulaMilkState {
  list: FormulaMilk[];
  form: FormulaMilk;
  listNeedReload: boolean;
  setList: (v: FormulaMilk[]) => void;
  setForm: (v: FormulaMilk) => void;
  updateForm: (key: string, value: any) => void;
  setListNeedReload: (v: boolean) => void;
}

export const useFormulaMilkStore = create<FormulaMilkState>()((set, get) => ({
  list: [],
  form: {} as FormulaMilk,
  listNeedReload: true,
  setList: v => set(() => ({ list: v })),
  setForm: v => set(() => ({ form: v })),
  updateForm: (k, v) =>
    set(() => ({
      form: {
        ...get().form,
        [k]: v,
      },
    })),
  setListNeedReload: v => set(() => ({ listNeedReload: v })),
}));
