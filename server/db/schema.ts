

import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
    id: serial().primaryKey(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
});
