import 'dotenv/config';
import {drizzle} from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm'
import {usersTable} from '../db/schema';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken'

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
        //sends to database
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, body.email))

        const isValid = await bcrypt.compare(body.password, user.password)
        if (!isValid) {
            throw createError({
                statusCode: 401,
                message: 'Invalid email or password!',
            })
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET)
        setCookie(event, 'NoteNestJWT', token)
        return {data: user.id, succeeded: true};
    } catch (e) {
        if (e.code == 'ER_DUP_ENTRY') {
            throw createError({statusCode: 409, statusMessage: 'An email with this address already exists!'})
        }
        throw createError({
            statusCode: e?.statusCode,
            message: e?.message,
        })
    }
});

