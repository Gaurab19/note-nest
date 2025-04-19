

import 'dotenv/config';
import {drizzle} from 'drizzle-orm/mysql2';
import {usersTable} from '../db/schema';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const db = drizzle(process.env.DATABASE_URL!);
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        if (!validator.isEmail(body.email)) {
            throw createError({
                statusCode: 400,
                message: 'Please enter valid email!',
            })
        }

        if (
            !validator.isStrongPassword(body.password, {
                minLength: 8,
                minLowercase: 0,
                minUppercase: 0,
                minNumbers: 0,
                minSymbols: 0,
            })
        ) {
            throw createError({
                statusCode: 400,
                message: 'Password must be at least 8 characters long!',
            })
        }
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
        console.log('grr',e.code,e)
        if(e.code=='ER_DUP_ENTRY'){
            throw createError({ statusCode: 409, statusMessage: 'An email with this address already exists!' })
        }
        throw createError({
            statusCode: 400,
            message: e?.message,
        })
    }
});

