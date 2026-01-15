// Direct Database Update Script
// Run this to update Neon database with revised offers from spreadsheet

import { saveSalesData, clearSalesData } from './lib/neon.ts';
import { MONTHS_DATA } from './constants.ts';

async function updateDatabaseWithRevisedOffers() {
  console.log('🔄 Starting database update with revised offers...');
  
  try {
    // Clear existing data
    console.log('🗑️ Clearing existing database...');
    await clearSalesData();
    
    // Save new data from constants.ts (which you've updated)
    console.log('💾 Saving revised offers to database...');
    const result = await saveSalesData(MONTHS_DATA);
    
    if (result.success) {
      console.log('✅ Database updated successfully!');
      console.log(`📊 Loaded ${MONTHS_DATA.length} months of data`);
      console.log('🎉 You can now reload your app to see the changes');
    } else {
      console.error('❌ Failed to update database:', result.error);
    }
  } catch (error) {
    console.error('❌ Error during update:', error);
  }
}

// Run the update
updateDatabaseWithRevisedOffers();
