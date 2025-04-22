import 'dotenv/config';
import {drizzle} from 'drizzle-orm/mysql2';
import {notes} from '../db/schema';


const db = drizzle(process.env.DATABASE_URL!);
export default defineEventHandler(async (event) => {
    try {
        return await db.select().from(notes);
    }
    catch (e) {
        console.log('err',e)
    }
});