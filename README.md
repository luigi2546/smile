# Smile Center GH — Digital Platform (Phase 1 MVP)

Full-stack platform covering the Phase 1 "Foundation" pillars from the growth
proposal: public website, online booking, CRM, and an admin/branch dashboard.

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres, Auth)

## What's included

- **Public website** — homepage, services, branch locator (`/`, `/services`, `/branches`)
- **Online booking** — 3-step wizard (service → branch/date/time → details) that
  creates/matches a customer record and writes an appointment (`/book`)
- **CRM** — customer list with search, individual profile pages showing visit
  history, lifetime value, notes, and reminders (`/admin/customers`)
- **Admin dashboard** — KPIs (appointments, revenue, new customers) plus revenue
  trend and branch-distribution charts (`/admin/dashboard`)
- **Operations** — appointment status management and branch/service management
  (`/admin/appointments`, `/admin/branches`, `/admin/services`)

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Create your first staff login: **Authentication → Users → Add User** (email + password).
4. Copy that user's UUID and run this in the SQL Editor so they can access the admin panel:
   ```sql
   insert into staff_profiles (id, full_name, role)
   values ('paste-the-user-uuid-here', 'Your Name', 'admin');
   ```
5. Copy your Project URL and anon key from **Settings → API**.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 3. Run locally

```bash
npm install
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## 4. Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — add the same
environment variables there. Point `smilecentergh.com` at the Vercel deployment.

## Roadmap — what's next (Phase 2+, from the proposal)

- WhatsApp/AI receptionist automation (Twilio/WhatsApp Business API + a queue
  for automated reminders — the `reminders` table is already in place for this)
- Automated SMS/email appointment reminders (cron job reading `reminders` + `appointments`)
- Membership billing (Smile Club) via Paystack/Flutterwave recurring charges
- Referral tracking UI (schema already supports `referred_by_customer_id`)
- Role-based views for branch managers vs. admin (schema already supports `role`
  and `branch_id` on `staff_profiles` — just needs UI filtering)

## Project structure

```
app/
  page.tsx                     Homepage
  services/, branches/         Public marketing pages
  book/                        Booking wizard + server action
  admin/
    login/                     Staff login
    (protected)/                Sidebar-wrapped, auth-gated
      dashboard/                KPIs + charts
      customers/                CRM list + profile detail
      appointments/              Status management
      branches/, services/       Operational CRUD
components/
  ui/           Shared primitives (Button, Card, Input, Badge…)
  site/         Navbar, Footer
  booking/      Booking wizard
  admin/        Sidebar, stat cards, charts, status select
lib/
  supabase/     Browser + server Supabase clients
  types.ts      Shared domain types
  utils.ts      Formatting helpers
supabase/
  schema.sql    Tables + Row Level Security policies
  seed.sql      Demo branches, services, customers
```

Email: admin@smilecentergh.com
Password: Admin1234!


services
Teeth Whitening
Teeth Scaling
Teeth Polish
Fixing of Gem Tooth
