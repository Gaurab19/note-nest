import { int, text, timestamp, mysqlTable, serial, varchar, primaryKey } from 'drizzle-orm/mysql-core';
import { sql } from "drizzle-orm";

export const usersTable = mysqlTable('users_table', {
    id: int('id').primaryKey().autoincrement(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    salt: varchar('salt', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
export const notes = mysqlTable("Note", {
    id: serial('id').primaryKey().autoincrement(),
    userId: int('user_id').references(() => usersTable.id),
    title: varchar('title', { length: 255 }).notNull(),
    text: text('text').notNull(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});