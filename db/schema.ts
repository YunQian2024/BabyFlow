import { InferSelectModel } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** 配置表 */
export const configTable = sqliteTable('config', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  value: text().notNull(),
  group: text().notNull().default('default'),
});

/** 配方奶记录表 */
export const formulaMilkTable = sqliteTable('formula_milk_log', {
  id: int().primaryKey({ autoIncrement: true }),
  startTime: text().notNull(),
  endTime: text().notNull(),
  durationMinutes: int().notNull(),
  milkIntake: int().notNull(),
});

export type FormulaMilk = InferSelectModel<typeof formulaMilkTable>;
