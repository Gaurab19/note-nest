import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { user } from '../db/schema';

const db = drizzle(process.env.DATABASE_URL!);
export default defineEventHandler(async (event) => {
        const users = await db.select().from(user);
        console.log('Getting all users from the database: ', users)
        return { data: users }
})