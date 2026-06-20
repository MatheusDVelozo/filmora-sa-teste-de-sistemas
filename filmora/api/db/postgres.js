import { Pool }  from 'pg';
import dotenv from 'dotenv';

dotenv.config();


export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ||5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'pcmatheus_pg',
  database: process.env.DB_NAME || 'filmora_db',
  max: 10,
});
