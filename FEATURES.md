# Physique 57 India - 2026 Sales Masterplan

A comprehensive sales planning and management system with **Neon Database** backend for permanent data storage.

## 🚀 Features

### 💾 Permanent Data Storage
- **Neon Database Integration**: All changes (edits, additions, deletions, cancellations) are automatically saved to Neon PostgreSQL database
- **Dual Storage**: Data syncs to both localStorage (for offline access) and Neon (for permanent cloud storage)
- **Auto-sync**: Every change is immediately persisted to the cloud

### 📊 Viewing Modes
- **Monthly View**: Detailed breakdown of individual months with offers, targets, and operations
- **Year View**: Complete overview of all 12 months in a single scrollable page
- Tab navigation to switch between views

### 📤 Advanced Export System

Export your sales plan in **7 different formats**:

1. **PDF Export** 📄
   - Professionally formatted multi-page document
   - Includes all offers, targets, and strategies
   - Perfect for presentations and printing

2. **Word Document (.docx)** 📝
   - Fully editable Microsoft Word format
   - Structured with headings and formatted text
   - Easy to customize and share

3. **Image Export (.png)** 🖼️
   - High-resolution visual overview
   - Beautiful gradient designs
   - Great for social media and quick sharing

4. **Email Body HTML** 📧
   - Responsive HTML email template
   - Copy-paste ready for email clients
   - Professional styling with embedded CSS

5. **JSON Export** 📋
   - Complete data structure
   - Developer-friendly format
   - Easy to import/process

6. **CSV Export** 📊
   - Spreadsheet-compatible format
   - Import into Excel, Google Sheets
   - Analyze in data tools

7. **Clipboard Copy** 📎
   - Quick JSON copy to clipboard
   - Instant data sharing

### ✨ Export Options
- **Scope Selection**: Export current month only or full year
- **Filter Cancelled**: Choose to include or exclude cancelled offers
- **Format Selection**: Pick from 7 export formats

### 🎯 Sales Management
- Add new offers to any month
- Edit existing offers
- Delete offers (with confirmation)
- Mark offers as cancelled/active
- All changes automatically saved to Neon database

### 🔄 Factory Reset
- Reset all data to original defaults
- Confirmation prompt for safety
- Resets both localStorage and Neon database

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Neon PostgreSQL (Serverless)
- **PDF**: jsPDF + html2canvas
- **Word**: docx
- **State Management**: React Context API

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Configuration

The app is pre-configured to connect to your Neon database:
- Connection string is in `.env` file
- Database schema auto-initializes on first run
- All changes sync automatically

## 📖 Usage

### Switching Views
- Use the tab selector in the sidebar to switch between **Monthly** and **Year View**

### Exporting Data
1. Click "Advanced Export" button in sidebar
2. Choose scope (Current Month or All Data)
3. Select if you want to include cancelled offers
4. Pick your export format (PDF, Word, Image, Email, JSON, CSV, or Clipboard)
5. Click "Export Now"

### Managing Offers
- **Add**: Click "Add Offer" button on any month view
- **Edit**: Click the edit icon on any offer card
- **Delete**: Click the delete icon (with confirmation)
- **Cancel/Activate**: Toggle the cancelled status

### Data Persistence
- All changes are automatically saved to Neon database
- No manual save required
- Data persists across sessions and devices

## 🎨 Export Formats Explained

### PDF
Perfect for: Presentations, printing, formal documentation
Features: Multi-page layout, branded headers, professional formatting

### Word (.docx)
Perfect for: Further editing, collaborative documents
Features: Editable text, structured headings, easy customization

### Image (.png)
Perfect for: Quick sharing, social media, visual overviews
Features: High-resolution, beautiful gradients, eye-catching design

### Email Body
Perfect for: Sending updates via email
Features: Responsive HTML, embedded styles, email-client compatible

### JSON
Perfect for: Developers, data integration, backups
Features: Complete data structure, easy to parse

### CSV
Perfect for: Spreadsheet analysis, data manipulation
Features: Excel/Sheets compatible, structured data

### Clipboard
Perfect for: Quick sharing, temporary transfers
Features: Instant copy, JSON format

## 🔐 Security

- Database credentials stored securely in environment variables
- SSL-required connection to Neon
- No sensitive data exposed in frontend

## 📝 License

Confidential - Physique 57 India Internal Use Only

---

© 2026 Physique 57 India - All Rights Reserved
