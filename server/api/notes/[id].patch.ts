import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import { notes } from '../../db/schema';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({ uri: process.env.DATABASE_URL });
const db = drizzle(pool);

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const cookies = parseCookies(event);
        const token = cookies.NoteNestJWT;

        if (!token) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Not authorized to update',
            });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        const idParam = await getRouterParam(event, 'id');
        const id = parseInt(idParam);

        // First: Check if the note exists and belongs to the user
        const existingNotes = await db
            .select()
            .from(notes)
            .where(eq(notes.id, id));

        const noteTryingToUpdate = existingNotes[0];

        if (!noteTryingToUpdate) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Note does not exist',
            });
        }

        // Optional: if you want to ensure user owns the note
        if (noteTryingToUpdate.userId !== decodedToken.id) {
            throw createError({
                statusCode: 403,
                statusMessage: 'You do not have permission to update this note',
            });
        }

        // Update the note
        await db
            .update(notes)
            .set({
                text: body.updatedNote,
                title:body.title,
                updatedAt: new Date(),
            })
            .where(eq(notes.id, id));

        return { success: true };
    } catch (e) {
        console.log('err', e);
        return { success: false, error: e.message };
    }
});
