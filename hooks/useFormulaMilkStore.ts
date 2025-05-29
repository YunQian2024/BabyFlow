import { InferSelectModel } from 'drizzle-orm';
import { create } from 'zustand';
import { formulaMilkTable } from '../db/schema';

type FormulaMilk = InferSelectModel<typeof formulaMilkTable>;

interface FormulaMilkState {
  list: FormulaMilk[];
  form: FormulaMilk;
  listNeedReload: boolean;
}

export const useFormulaMilkStore = create<FormulaMilkState>()((set, get) => ({
  list: [],
  form: {} as FormulaMilk,
  listNeedReload: true,
}));
