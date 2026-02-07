import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/nonprofit_automation';

// Configure postgres client with connection pooling
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Idle connection timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
  prepare: false, // Disable prepared statements for compatibility
});

export const db = drizzle(client, { schema });

export { schema };

// Graceful shutdown helper
export async function closeDatabaseConnection(): Promise<void> {
  console.log('[DB] Closing database connection...');
  await client.end();
  console.log('[DB] Database connection closed');
}
