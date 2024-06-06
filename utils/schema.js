import { serial, varchar } from "drizzle-orm/mysql-core";
import { integer, numeric, pgTable } from "drizzle-orm/pg-core";

export const Budgets = pgTable('budgets', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    amount: varchar('amount', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 255 }),
    createdBy: varchar('createdBy', { length: 255 }).notNull()
})

export const Expenses = pgTable('expenses', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    amount: numeric('amount', { length: 255 }).notNull().default(0),
    budgetId: integer('budgetId', { length: 255 }).references(() => Budgets.id),
    createdAt: varchar('createdAt', { length: 255 }).notNull() 
})