import { google } from "googleapis";
import type { Registration } from "./types";

/**
 * Appends one registration row to the "Registrations" tab of a Google Sheet.
 *
 * Required env vars (set in .env.local for dev, and in your host's
 * environment variables panel for production):
 *
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   - the service account's client_email
 *   GOOGLE_PRIVATE_KEY             - the service account's private_key
 *                                     (keep the \n escape sequences intact)
 *   GOOGLE_SHEET_ID                - the long id in your sheet's URL
 *
 * Setup steps are in SETUP.md.
 */
export async function appendRegistration(entry: Registration) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    throw new Error(
      "Google Sheets is not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY and GOOGLE_SHEET_ID."
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toISOString();

  const commonRow = [
    timestamp,
    entry.category === "alist" ? "A-List / Veteran" : "Creative / Entertainer",
    entry.fullName,
    entry.email,
    entry.phone,
    entry.city,
    entry.country,
    entry.discipline,
    entry.portfolioLink,
    entry.instagram,
    entry.bio,
  ];

  const categoryRow =
    entry.category === "creative"
      ? [entry.yearsActive, entry.following, entry.goal, "", "", "", ""]
      : ["", "", "", entry.stageName, entry.managementContact, entry.achievements, `${entry.ambassadorInterest} / ${entry.collabType}`];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Registrations!A:R",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[...commonRow, ...categoryRow]],
    },
  });
}
