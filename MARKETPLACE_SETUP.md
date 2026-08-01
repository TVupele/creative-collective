# Marketplace Setup — All Phases

This covers everything needed to get the full marketplace running: database,
admin login, product uploads, the public shop, and checkout with Paystack.

## 1. Database (Supabase)

1. Go to **https://supabase.com** → sign up → **New project**
2. Set a database password when prompted — save it, you'll need it in the
   connection strings below
3. Once the project's ready, go to **Project Settings → Database**
4. Under **Connection string**, you need **two** different strings — this
   trips a lot of people up, so worth being precise about:
   - **Transaction pooler** (port `6543`, has `?pgbouncer=true` at the end)
     → this is your `DATABASE_URL`, used for the app's actual queries
   - **Session pooler** or **Direct connection** (port `5432`, no
     `pgbouncer` param) → this is your `DIRECT_URL`, used only when running
     migrations
   
   Using the pooled string for both will make `prisma migrate` hang or fail
   — Supabase's transaction pooler doesn't support the prepared statements
   migrations need.
5. Add both to `.env.local`:
   ```
   DATABASE_URL="postgres://postgres.your-project-ref:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgres://postgres.your-project-ref:password@aws-0-region.pooler.supabase.com:5432/postgres"
   ```
   (Supabase shows you the exact strings with your actual project ref and
   region already filled in — copy them directly rather than retyping.)

## 2. Auth secret

```
AUTH_SECRET="run: npx auth secret — or paste output of: openssl rand -base64 32"
```

## 3. Your admin account

There's no public signup — you create your own login via a one-time seed
command. Add to `.env.local`:

```
ADMIN_NAME="Your Name"
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=choose-a-strong-password
```

## 4. Commission rate

```
COMMISSION_PERCENT=20
```

Change this any time — it locks in per-sale at checkout, so past orders keep
whatever rate was active when they happened.

## 5. Image uploads (Vercel Blob)

1. In your Vercel project dashboard → **Storage** → **Create Database** → **Blob**
2. Copy the read-write token it generates
3. Add to `.env.local`:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

## 6. Paystack (checkout)

You mentioned you'll paste your test keys separately — once you have them:

```
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

**Also set up the webhook** (this is what reliably marks orders paid, even
if a buyer closes their browser mid-payment):

1. Paystack dashboard → **Settings → API Keys & Webhooks**
2. Add webhook URL: `https://your-deployed-domain.com/api/checkout/webhook`
   (for local testing, you'll need a tunnel tool like `ngrok` — Paystack
   can't reach `localhost` directly)
3. No need to select specific events — the webhook handler checks for
   `charge.success` itself and ignores everything else

**Test card numbers** (test mode only, no real charge):
- Card: `4084 0840 8408 4081`, any future expiry, CVV `408`, PIN `0000`, OTP `123456`

## 7. Install, generate, migrate, seed

```
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

**I could not run `prisma generate` myself** — my build environment can't
reach the host Prisma downloads its engine binary from. Every other file in
this project compiled cleanly against the code that depends on it (I
verified this directly, and traced every build failure down to only that
one missing piece) — but the database connection itself gets its first
real test on your machine.

## 8. Run it

```
npm run dev
```

## Walking through it end to end

1. **http://localhost:3000/admin/login** — log in with your `ADMIN_EMAIL`/`ADMIN_PASSWORD`
2. **Dashboard → Products → New product** — upload a test item, set it to
   "Live on shop", save
3. **http://localhost:3000/shop** — your item should appear; try the search
   and category filter
4. Click into the item → **Add to cart** → **View cart** → **Checkout**
5. Fill in buyer details → you're redirected to Paystack's hosted checkout
   (only works once your Paystack keys are set)
6. Pay with the test card above → redirected back to an order confirmation
   page → check `/admin/products` again, stock should have decremented

## How money flows (for your own reference)

- Buyer pays the **full amount** — it lands entirely in your Paystack
  account, since there's no split/subaccount involved
- Each order item records `payoutAmount` (price minus your commission) and
  `payoutStatus` (defaults to `PENDING`)
- **Actually paying members is a manual step right now** — you see what's
  owed via the order records, transfer it yourself (bank app or Paystack
  Transfers), and there's no "mark as paid" UI yet. If you want that
  automated later — either a dashboard button that triggers a real Paystack
  Transfer, or at least a way to mark `payoutStatus` as paid for
  record-keeping — that's a clean, well-scoped next addition whenever
  you're ready for it.

## Full file map

**Phase 1 — database & admin auth**
`prisma/schema.prisma`, `prisma.config.ts`, `prisma/seed.ts`, `lib/prisma.ts`,
`auth.ts`, `proxy.ts`, `app/api/auth/[...nextauth]/route.ts`,
`app/admin/login/page.tsx`, `app/admin/dashboard/page.tsx`,
`components/AuthProvider.tsx`, `types/next-auth.d.ts`

**Phase 2 — admin product management**
`lib/require-admin.ts`, `lib/money.ts`, `app/api/admin/upload/route.ts`,
`app/api/admin/products/route.ts`, `app/api/admin/products/[id]/route.ts`,
`app/admin/products/page.tsx`, `app/admin/products/new/page.tsx`,
`app/admin/products/[id]/edit/page.tsx`, `components/ProductForm.tsx`

**Phase 3 — public storefront**
`app/shop/page.tsx`, `app/shop/[id]/page.tsx`, `components/ProductCard.tsx`,
`components/ShopFilters.tsx`

**Phase 4 — cart & checkout**
`lib/cart-context.tsx`, `components/AddToCartButton.tsx`, `app/cart/page.tsx`,
`app/checkout/page.tsx`, `lib/paystack.ts`, `lib/order-fulfillment.ts`,
`app/api/checkout/initialize/route.ts`, `app/api/checkout/webhook/route.ts`,
`app/api/checkout/verify/route.ts`, `app/order/[id]/page.tsx`

Plus a floating "Shop" link added to `app/layout.tsx`, visible site-wide.
