import { neon } from '@neondatabase/serverless';

// Neon database connection - using environment variable
// @ts-ignore - Vite env types
const DATABASE_URL = import.meta.env?.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_adL9B0uIREhP@ep-dry-sound-a15m8a9a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

if (!DATABASE_URL) {
  console.error('⚠️ VITE_DATABASE_URL environment variable is not set!');
}

console.log('🔌 Neon database connection URL:', DATABASE_URL.replace(/:[^:@]+@/, ':***@')); // Hide password

const sql = neon(DATABASE_URL);

console.log('✅ Neon database client initialized');

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Create sales_data table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS sales_data (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return { success: false, error };
  }
}

// Save sales data to Neon
export async function saveSalesData(data: any) {
  try {
    console.log('🔄 Starting Neon save operation...');
    
    // Always insert as a new record to maintain history
    const result = await sql`
      INSERT INTO sales_data (data) 
      VALUES (${JSON.stringify(data)})
      RETURNING id, updated_at
    `;
    
    console.log('💾 Data saved to Neon database, new record ID:', result[0].id);
    console.log('⏰ Created timestamp:', result[0]?.updated_at);
    
    return { success: true, action: 'inserted', id: result[0].id };
  } catch (error) {
    console.error('❌ Error saving to database:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    return { success: false, error };
  }
}

// Load sales data from Neon
export async function loadSalesData() {
  try {
    const result = await sql`
      SELECT data FROM sales_data 
      ORDER BY updated_at DESC 
      LIMIT 1
    `;
    
    if (result.length > 0) {
      console.log('📥 Data loaded from Neon database');
      return result[0].data;
    }
    
    console.log('ℹ️ No data found in Neon database');
    return null;
  } catch (error) {
    console.error('❌ Error loading from database:', error);
    return null;
  }
}

// Clear all sales data from Neon database
export async function clearSalesData() {
  try {
    await sql`DELETE FROM sales_data`;
    console.log('🗑️ Database cleared successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    return { success: false, error };
  }
}
