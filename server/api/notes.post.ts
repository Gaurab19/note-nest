import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import {notes} from "../db/schema"
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const pool = mysql.createPool({ uri: process.env.DATABASE_URL });
const db = drizzle(pool);

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event); // { title: '...', text: '...' }
        const cookies = parseCookies(event);
        const token = cookies.NoteNestJWT;

        if (!token) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Not authorized to add a note',
            });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        // Insert the new note
        await db.insert(notes).values({
            title: body.title,
            text: body.text,
            userId: decodedToken.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return { success: true };
    } catch (e) {
        console.log('err', e);
        return { success: false, error: e.message };
    }
});
