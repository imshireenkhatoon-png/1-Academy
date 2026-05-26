const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getCredentialsPath() {
  const relativePath = process.env.GOOGLE_CREDENTIALS_PATH || "credentials.json";
  return path.isAbsolute(relativePath) ? relativePath : path.join(process.cwd(), relativePath);
}

async function getAuthClient() {
  const credentialsPath = getCredentialsPath();

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(
      `Google credentials file not found at ${credentialsPath}. Add it and restart the server.`
    );
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES
  });

  return auth.getClient();
}

async function appendLeadToSheet({ name, phone, experience, timestamp }) {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Leads";

  if (!spreadsheetId) {
    throw new Error("SPREADSHEET_ID is missing in .env");
  }

  const authClient = await getAuthClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });
  const row = [name, phone, experience, timestamp];
  const escapedSheetName = sheetName.replace(/'/g, "''");
  const targetRange = `'${escapedSheetName}'!A:D`;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: targetRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row]
      }
    });
  } catch (error) {
    const reason =
      error?.response?.data?.error?.message || error?.errors?.[0]?.message || error?.message || "";
    const isRangeError = /Unable to parse range/i.test(reason);

    if (!isRangeError) {
      throw error;
    }

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets(properties(title))"
    });

    const firstSheetTitle = spreadsheet.data?.sheets?.[0]?.properties?.title;
    if (!firstSheetTitle) {
      throw new Error(
        `Sheet tab '${sheetName}' not found and no fallback sheet is available in this spreadsheet.`
      );
    }

    const escapedFallbackTitle = firstSheetTitle.replace(/'/g, "''");
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${escapedFallbackTitle}'!A:D`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row]
      }
    });
  }
}

module.exports = { appendLeadToSheet };
