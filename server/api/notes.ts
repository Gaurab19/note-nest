import 'dotenv/config';
import { eq } from "drizzle-orm";
import {drizzle} from 'drizzle-orm/mysql2';
import {notes} from '../db/schema';
import jwt from "jsonwebtoken";

const db = drizzle(process.env.DATABASE_URL!);
export default defineEventHandler(async (event) => {
    try {
        const cookies=parseCookies(event);
        const token=cookies.NoteNestJWT;

        if(!token){
            throw createError({
                statusCode:401,
                statusMessage:'Not authorized to access notes!'
            })
        }
        const decodedToken=await jwt.verify(token,process.env.JWT_SECRET);
        return await db.select().from(notes).where(
            eq(notes.userId, decodedToken.id)
        )
    }
    catch (e) {
        console.log('err',e)
    }
});