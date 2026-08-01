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

## 6. Marketplace — Phase 1 setup (database + seller accounts)

This phase adds seller signup/login. No products or payments yet — that's
Phases 2–4.

**a. Create your Neon database**
1. Go to **neon.tech** → sign up (free tier is plenty for now).
2. Create a new project — name it anything, e.g. "creative-collective".
3. On the project dashboard, find **Connection string** — make sure the
   toggle is set to **Pooled connection** (important: Next.js needs the
   pooled one, not the direct one, or you'll hit connection limits).
4. Copy the full string — it looks like:
   `postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require`

**b. Set environment variables**

Add to your `.env.local` (see `.env.local.example` for the full template):
```
DATABASE_URL="<the connection string from step a4>"
AUTH_SECRET=<generate one — see below>
```

Generate `AUTH_SECRET` by running this in your project folder:
```
npx auth secret
```
This writes it directly into `.env.local` for you.

**c. Install the new dependencies and generate the Prisma client**

```
npm install
npx prisma generate
```

**d. Create the actual database tables**

```
npx prisma db push
```

This reads `prisma/schema.prisma` and creates the tables in your Neon
database. Run this again any time the schema file changes.

**e. Run it**

```
npm run dev
```

Try it:
1. Go to `/seller/signup`, create an account
2. Log in at `/seller/login`
3. You should land on `/seller/dashboard`, showing your name and a
   reminder to add bank details (that part comes in Phase 2)

**To inspect your database visually** at any point:
```
npx prisma studio
```
This opens a browser-based table viewer — useful for confirming signups
actually landed in the `User` table.

## 7. Deploying Phase 1 to Vercel

Add two new environment variables in Vercel (Settings → Environment
Variables), alongside your existing Google ones:
```
DATABASE_URL
AUTH_SECRET
```
Then redeploy. Vercel runs `prisma generate` automatically during build
(it's wired into `postinstall` — see `package.json`), so you don't need to
do anything extra there.

