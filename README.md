# 1PERCENTACADEMY Landing Page

Modern, premium, mobile-first forex mentorship landing page with:
- HTML, CSS, JavaScript frontend
- Node.js + Express backend
- Google Sheets API lead logging
- Funnel: Landing -> Lead Form -> Google Sheets -> WhatsApp -> Telegram

## Project Structure

```text
1percentacademy/
|-- public/
|   |-- index.html
|   |-- styles.css
|   |-- script.js
|   |-- favicon.svg
|-- routes/
|   |-- leadRoutes.js
|-- services/
|   |-- sheetsService.js
|-- .env.example
|-- .gitignore
|-- credentials.example.json
|-- package.json
|-- server.js
|-- vercel.json
|-- README.md
```

## 1) Create Google Cloud Project

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Click project selector -> **New Project**
3. Give project name (example: `1percentacademy-leads`)
4. Create project and switch to it

## 2) Enable Google Sheets API

1. In the same project, open **APIs & Services** -> **Library**
2. Search `Google Sheets API`
3. Click it -> **Enable**

## 3) Service Account Setup

1. Open **APIs & Services** -> **Credentials**
2. Click **Create Credentials** -> **Service Account**
3. Enter name (example: `sheet-writer`)
4. Complete the wizard (basic role is enough for this use)
5. Open created service account -> **Keys** tab
6. **Add Key** -> **Create New Key** -> JSON
7. Download JSON key file

## 4) credentials.json Placement

1. Rename downloaded JSON file to `credentials.json`
2. Place it in the project root (same level as `server.js`)

Alternative: keep your own name and update `GOOGLE_CREDENTIALS_PATH` in `.env`.

## 5) Spreadsheet Sharing Permissions

1. Create a Google Sheet for leads
2. Add headers in row 1:
   - `Name`
   - `Phone`
   - `Experience`
   - `Timestamp`
3. Click **Share** in Google Sheet
4. Copy service account email from `credentials.json` (`client_email`)
5. Share sheet with that email as **Editor**

## 6) Environment Variables Setup

1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Update `.env` values:
   - `SPREADSHEET_ID`: From Google Sheet URL
     - Example URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - `GOOGLE_SHEET_NAME`: Tab name (default: `Leads`)
   - `GOOGLE_CREDENTIALS_PATH`: `credentials.json` (or your custom path)

## 7) Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start server:
   ```bash
   npm run dev
   ```
3. Open:
   - `http://localhost:3000`
4. Submit the form and confirm:
   - Lead appears in Google Sheet
   - User is redirected to WhatsApp
   - Then user is redirected to Telegram

## Form/API Details

- Endpoint: `POST /api/leads`
- Payload:
  ```json
  {
    "name": "Rahul Sharma",
    "phone": "9876543210",
    "experience": "Beginner"
  }
  ```
- Saved columns:
  - Name
  - Phone
  - Experience
  - Timestamp (ISO format)

## Deployment

### Render

1. Push project to GitHub
2. Create new **Web Service** in Render
3. Build command:
   ```bash
   npm install
   ```
4. Start command:
   ```bash
   npm start
   ```
5. Add environment variables from `.env`
6. Upload/add `credentials.json` using Render disk or convert credentials to env-managed file path

### Vercel

1. Import GitHub repo in Vercel
2. Framework preset: **Other**
3. Keep included `vercel.json`
4. Add environment variables from `.env`
5. Ensure `credentials.json` is available at runtime (or switch to env-based credentials strategy)

## Notes

- `credentials.json` and `.env` are ignored in git by default.
- This project is beginner-friendly and intentionally minimal for easy maintenance.
