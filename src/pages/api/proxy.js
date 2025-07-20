import { google } from "googleapis";

const SHEET_ID = "1OWtO8jYeNFwTpF6movC3o2xDkXlSohTPowiJVYq4cXY";

export async function fetchSheetData(tabName) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: tabName,
  });
  const rows = res.data.values;
  if (!rows || rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || "";
    });
    return obj;
  });
}

// No default export; this is now a utility, not an API route.
