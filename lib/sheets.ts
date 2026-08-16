import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";
import type { Registration } from "./types";

/**
 * Appends one registration to a Google Sheet.
 *
 * Creatives and A-List entries go to the "Registrations" tab; partners go to
 * their own "Partners" tab, which is created (with headers) on first use.
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

const PARTNER_SHEET = "Partners";

const PARTNER_HEADERS = [
  "Timestamp",
  "Organisation",
  "Organisation type",
  "Contact person",
  "Role",
  "Email",
  "Phone",
  "City",
  "Country",
  "Website",
  "Focus areas",
  "Support types",
  "Budget / scale",
  "Projects of interest",
  "Message",
];

function getClient() {
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

  return { sheets: google.sheets({ version: "v4", auth }), sheetId };
}

/**
 * Makes sure a tab exists, adding it with a header row the first time.
 * Safe to call on every submission — it's a no-op once the tab is there.
 */
async function ensureSheetTab(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  title: string,
  headers: string[]
) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = meta.data.sheets?.some((s) => s.properties?.title === title);
  if (exists) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title } } }] },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${title}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [headers] },
  });
}

export async function appendRegistration(entry: Registration) {
  const { sheets, sheetId } = getClient();
  const timestamp = new Date().toISOString();

  if (entry.category === "partner") {
    await ensureSheetTab(sheets, sheetId, PARTNER_SHEET, PARTNER_HEADERS);

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${PARTNER_SHEET}!A:O`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            timestamp,
            entry.organisation,
            entry.orgType,
            entry.fullName,
            entry.role,
            entry.email,
            entry.phone,
            entry.city,
            entry.country,
            entry.website,
            entry.focusAreas.join(", "),
            entry.supportTypes.join(", "),
            entry.budgetRange,
            entry.projectInterest,
            entry.message,
          ],
        ],
      },
    });
    return;
  }

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
      : [
          "",
          "",
          "",
          entry.stageName,
          entry.managementContact,
          entry.achievements,
          `${entry.ambassadorInterest} / ${entry.collabType}`,
        ];

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
