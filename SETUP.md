# Creative Collective — Setup Guide

## 1. Install and run locally

```
npm install
npm run dev
```

Open http://localhost:3000. If npm throws an `ECOMPROMISED` error on Windows,
switch to Node v22 LTS first (this is the same fix you used on SwiftBeds).

## 2. Connect Google Sheets

Registrations are appended as rows to a Google Sheet using a service account
(no OAuth login flow needed — it writes silently in the background).

**a. Create the sheet**
1. Make a new Google Sheet.
2. Rename the first tab to exactly `Registrations`.
3. Add this header row in row 1:
   `Timestamp | Category | Full Name | Email | Phone | City | Country | Discipline | Portfolio Link | Instagram | Bio | Years Active | Following | Goal | Stage Name | Management Contact | Achievements | Ambassador/Collab`
4. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

**b. Create a Google Cloud service account**
1. Go to console.cloud.google.com → create/select a project.
2. Enable the **Google Sheets API** (APIs & Services → Library).
3. APIs & Services → Credentials → Create Credentials → Service Account.
4. Open the service account → Keys → Add Key → JSON. This downloads a file
   with `client_email` and `private_key`.
5. Back in your Google Sheet, click **Share** and share it with the
   `client_email` address (Editor access).

**c. Set environment variables**

Copy `.env.local.example` to `.env.local` and fill in:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email from the JSON file>
GOOGLE_PRIVATE_KEY="<private_key from the JSON file, keep the \n's>"
GOOGLE_SHEET_ID=<the Sheet ID from step a4>
```

Restart `npm run dev` after saving.

## 3. Deploy (Vercel, matching your other builds)

1. Push this project to GitHub.
2. Import it in Vercel.
3. In Vercel → Settings → Environment Variables, add the same three
   `GOOGLE_*` variables from above.
4. Deploy.

## 4. What happens on registration

1. User picks a category on `/join`: **Creative & Entertainer** or
   **A-List & Veteran** — each reveals its own form fields.
2. On submit, the form POSTs to `/api/register`.
3. The API route validates the payload and appends one row to your
   `Registrations` sheet tab.
4. The user is redirected to `/?joined=1`, which shows the "You're on the
   list" waiting-list banner on the homepage.

## 5. Swapping in real assets

`public/patterns/` holds the images you sent (zebra, giraffe, the CBAAC
seal, the Africa Heritage Tour badge, the Wakanow logo). Since CBAAC and
Wakanow are outside organizations, confirm you have their go-ahead to use
their marks on a live, public site before you deploy — the files are wired
in and ready to go the moment that's confirmed.
