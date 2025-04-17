

import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users_table', {
    id: serial().primaryKey(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    salt:varchar({ length: 255 }).notNull()
});
