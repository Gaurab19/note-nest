import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import { notes } from '../../db/schema';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const pool = mysql.createPool({ uri: process.env.DATABASE_URL });
const db = drizzle(pool);

export default defineEventHandler(async (event) => {
    try {
        const cookies = parseCookies(event);
        const token = cookies.NoteNestJWT;

        if (!token) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Not authorized to delete',
            });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        const idParam = await getRouterParam(event, 'id');
        const id = parseInt(idParam);

        // Check if the note exists
        const existingNotes = await db
            .select()
            .from(notes)
            .where(eq(notes.id, id));

        const noteToDelete = existingNotes[0];

        if (!noteToDelete) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Note does not exist',
            });
        }

        // Optional: Check if the note belongs to the user
        if (noteToDelete.userId !== decodedToken.id) {
            throw createError({
                statusCode: 403,
                statusMessage: 'You do not have permission to delete this note',
            });
        }

        // Perform deletion
        await db.delete(notes).where(eq(notes.id, id));

        return { success: true, message: 'Note deleted successfully' };
    } catch (e) {
        console.log('err', e);
        return { success: false, error: e.message };
    }
});
