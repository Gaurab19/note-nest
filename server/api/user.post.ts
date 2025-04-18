

import 'dotenv/config';
import {drizzle} from 'drizzle-orm/mysql2';
import {usersTable} from '../db/schema';
import bcrypt from 'bcryptjs'
import {e} from "prisma/build/public/assets/vendor";

const db = drizzle(process.env.DATABASE_URL!);
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(body.password, salt);

        //sends to database
        const newUser = await db.insert(usersTable).values({
            email: body.email,
            password: passwordHash,
            salt: salt
        }).$returningId();
        console.log('Added user: ', newUser);

        const users = await db.select().from(usersTable);
        console.log('Getting all users from the database: ', users);

        return {data: users};
    }catch (e){
        console.log('grr',e.code)
        if(e.code=='ER_DUP_ENTRY'){
            throw createError({ statusCode: 409, statusMessage: 'An email with this address already exists!' })
        }
        return { error: 'Internal Server Error' };
    }
});

