import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from "@shared/schema";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
