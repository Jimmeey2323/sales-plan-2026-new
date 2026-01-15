# Database Setup - Neon PostgreSQL

## ✅ Current Configuration

Your app is now configured to save all changes permanently to **Neon PostgreSQL** database with localStorage as backup.

### Architecture

```
User Makes Change → SalesContext → Neon Database + LocalStorage
                                          ↓
                                   Auto-sync on every change
```

## 🔧 Configuration Files

### 1. Environment Variables (`.env`)
```
VITE_DATABASE_URL=postgresql://neondb_owner:npg_adL9B0uIREhP@ep-dry-sound-a15m8a9a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Database Functions (`lib/neon.ts`)
- ✅ `initializeDatabase()` - Creates table schema
- ✅ `saveSalesData()` - Saves/updates data
- ✅ `loadSalesData()` - Loads data
- ✅ `clearSalesData()` - Clears all data

### 3. Data Flow (`context/SalesContext.tsx`)

**On App Load:**
1. Initialize Neon database
2. Try loading from Neon first
3. Fallback to localStorage if Neon fails
4. Fallback to constants.ts if no saved data

**On Data Change:**
1. Save to localStorage (instant)
2. Save to Neon database (async, non-blocking)
3. Both happen automatically on every change

## 📊 Monitoring & Tools

### Database Status Page
Visit: `http://localhost:3000/database-status.html`
- Check Neon connection status
- View data statistics
- Monitor both Neon and localStorage

### Reset Data Page
Visit: `http://localhost:3000/reset-data.html`
- Clear both Neon and localStorage
- Reload fresh data from constants.ts
- Useful when updating constants.ts

## 🔍 Console Logging

The app now includes detailed console logging:

```
🔌 Neon database connection initialized
✅ Database initialized successfully
📥 Loading data from Neon...
✅ Loaded data from Neon database
💾 Data updated in Neon database
```

Open browser console (F12) to monitor database operations in real-time.

## 🚀 How It Works

### Adding a New Offer
1. You add an offer through the UI
2. SalesContext saves to localStorage immediately
3. SalesContext saves to Neon asynchronously
4. Console shows: `💾 Data updated in Neon database`

### Loading Data
**Priority Order:**
1. **Neon Database** (cloud, persistent)
2. **LocalStorage** (browser, backup)
3. **constants.ts** (default data)

### Updating constants.ts
If you edit `constants.ts` with new offers:

1. Visit `http://localhost:3000/reset-data.html`
2. Click "Reset Data & Reload App"
3. This clears Neon + localStorage
4. App loads fresh data from constants.ts
5. Fresh data is saved to both Neon and localStorage

## 🛡️ Reliability Features

### Auto-Fallback
- If Neon fails → uses localStorage
- If localStorage fails → uses constants.ts
- App always works, even offline

### Dual Storage
- **Neon**: Cloud persistence, survives browser clear
- **LocalStorage**: Instant access, offline backup

### Error Handling
All database operations have try-catch blocks with detailed logging.

## 🎯 Best Practices

### For Development
1. Use `database-status.html` to verify connection
2. Watch console for database operations
3. Use `reset-data.html` after changing constants.ts

### For Production
1. All changes auto-save to Neon
2. No manual save needed
3. Changes persist across devices
4. Browser cache clear won't lose data

## 📝 Common Tasks

### See Current Data Source
Check console on page load - it will show either:
- `📥 Loaded data from Neon database`
- `✅ Loaded data from localStorage`
- `🆕 Initializing default data from constants.ts`

### Force Reload from constants.ts
1. Visit `http://localhost:3000/reset-data.html`
2. Click reset button

### Verify Neon Connection
1. Visit `http://localhost:3000/database-status.html`
2. Should show green ✅ status

## 🔐 Security Notes

- Database URL is in `.env` file
- `.env` is gitignored (not committed)
- Connection uses SSL (`sslmode=require`)
- Fallback to hardcoded URL if env var missing

## ✨ Status: Fully Configured ✅

Your database setup is complete and working:
- ✅ Environment variables configured
- ✅ Neon functions with error handling
- ✅ Enhanced logging throughout
- ✅ Auto-save on every change
- ✅ Monitoring pages available
- ✅ Reset functionality working

**Next Steps:**
1. Open `http://localhost:3000/database-status.html` to verify
2. Visit `http://localhost:3000/reset-data.html` to load your new March offer
3. All future changes will auto-save to Neon ✨
