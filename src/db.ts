import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect().then(() => console.log('connected'));
export const db = drizzle(client);