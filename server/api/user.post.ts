

import 'dotenv/config';
import {drizzle} from 'drizzle-orm/mysql2';
import {usersTable} from '../db/schema';
import bcrypt from 'bcryptjs'

const db = drizzle(process.env.DATABASE_URL!);
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log('grr', body)

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    //sends to database
    const newUser = await db.insert(usersTable).values({email: body.email, password: passwordHash,salt:salt}).$returningId();
    console.log('Added user: ', newUser);

    const users = await db.select().from(usersTable);
    console.log('Getting all users from the database: ', users);

    return {data: users};
});

