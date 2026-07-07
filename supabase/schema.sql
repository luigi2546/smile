-- ============================================================
-- Smile Center GH — Platform Database Schema
-- Run this in the Supabase SQL Editor (or via `supabase db push`)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- BRANCHES ----------
create table if not exists branches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  phone text,
  lat double precision,
  lng double precision,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- SERVICES ----------
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category text not null default 'General',
  price_ghs numeric(10, 2) not null default 0,
  duration_minutes int not null default 30,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- CUSTOMERS (CRM) ----------
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text,
  preferred_branch_id uuid references branches(id) on delete set null,
  date_of_birth date,
  is_member boolean not null default false,
  membership_started_at date,
  notes text,
  referred_by_customer_id uuid references customers(id) on delete set null,
  created_at timestamptz not null default now()
);
create unique index if not exists customers_phone_key on customers (phone);

-- ---------- APPOINTMENTS ----------
do $$ begin
  create type appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
exception when duplicate_object then null;
end $$;


create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id) on delete cascade,
  service_id uuid not null references services(id) on delete restrict,
  branch_id uuid not null references branches(id) on delete restrict,
  appointment_date date not null,
  appointment_time time not null,
  status appointment_status not null default 'pending',
  price_ghs numeric(10, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists appointments_date_idx on appointments (appointment_date);
create index if not exists appointments_customer_idx on appointments (customer_id);
create index if not exists appointments_branch_idx on appointments (branch_id);

-- ---------- REMINDERS ----------
do $$ begin
  create type reminder_type as enum ('follow_up', 'recall_cleaning', 'birthday', 'membership_renewal', 'custom');
exception when duplicate_object then null;
end $$;


create table if not exists reminders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id) on delete cascade,
  type reminder_type not null default 'custom',
  due_date date not null,
  message text,
  is_sent boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists reminders_due_idx on reminders (due_date);

-- ---------- STAFF PROFILES (linked to Supabase Auth users) ----------
create table if not exists staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'staff', -- 'admin' | 'branch_manager' | 'staff'
  branch_id uuid references branches(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_appointments_updated_at on appointments;
create trigger trg_appointments_updated_at
  before update on appointments
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table branches enable row level security;
alter table services enable row level security;
alter table customers enable row level security;
alter table appointments enable row level security;
alter table reminders enable row level security;
alter table staff_profiles enable row level security;

-- Public (anon) can read active branches & services — needed for the public website
drop policy if exists "public can view active branches" on branches;
create policy "public can view active branches" on branches
  for select using (is_active = true);

drop policy if exists "public can view active services" on services;
create policy "public can view active services" on services
  for select using (is_active = true);

-- Public (anon) can INSERT a new customer + appointment via the booking flow,
-- but cannot read/update/delete other people's records.
drop policy if exists "public can create a customer record" on customers;
create policy "public can create a customer record" on customers
  for insert with check (true);

drop policy if exists "public can create an appointment" on appointments;
create policy "public can create an appointment" on appointments
  for insert with check (true);

-- Authenticated staff (any row in staff_profiles) can do everything.
drop policy if exists "staff full access branches" on branches;
create policy "staff full access branches" on branches
  for all using (auth.uid() is not null);

drop policy if exists "staff full access services" on services;
create policy "staff full access services" on services
  for all using (auth.uid() is not null);

drop policy if exists "staff full access customers" on customers;
create policy "staff full access customers" on customers
  for all using (auth.uid() is not null);

drop policy if exists "staff full access appointments" on appointments;
create policy "staff full access appointments" on appointments
  for all using (auth.uid() is not null);

drop policy if exists "staff full access reminders" on reminders;
create policy "staff full access reminders" on reminders
  for all using (auth.uid() is not null);

drop policy if exists "staff can manage own profile" on staff_profiles;
create policy "staff can manage own profile" on staff_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- ---------- STITCH RENDERS ----------
create table if not exists stitch_renders (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references auth.users(id) on delete set null,
  template_id text,
  storage_url text,
  preview_url text,
  meta jsonb,
  created_at timestamptz not null default now()
);

alter table stitch_renders enable row level security;
drop policy if exists "staff can manage stitch renders" on stitch_renders;
create policy "staff can manage stitch renders" on stitch_renders
  for all using (auth.uid() is not null);

-- ============================================================
-- SUBSCRIPTION PLANS & MEMBERSHIPS
-- ============================================================

-- ---------- SUBSCRIPTION PLANS ----------
create table if not exists subscription_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price_ghs numeric(10, 2) not null default 0,
  features jsonb default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- SUBSCRIPTIONS ----------
do $$ begin
  create type subscription_status as enum ('active', 'paused', 'cancelled', 'expired');
exception when duplicate_object then null;
end $$;

create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id) on delete cascade,
  plan_id uuid not null references subscription_plans(id) on delete restrict,
  status subscription_status not null default 'active',
  started_at date not null default current_date,
  renews_at date not null,
  cancelled_at date,
  payment_ref text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_customer_idx on subscriptions (customer_id);
create index if not exists subscriptions_plan_idx on subscriptions (plan_id);
create index if not exists subscriptions_renews_idx on subscriptions (renews_at);

drop trigger if exists trg_subscriptions_updated_at on subscriptions;
create trigger trg_subscriptions_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

-- ---------- RLS ----------
alter table subscription_plans enable row level security;
alter table subscriptions enable row level security;

-- Public can view active plans (for the /membership pricing page)
drop policy if exists "public can view active plans" on subscription_plans;
create policy "public can view active plans" on subscription_plans
  for select using (is_active = true);

-- Staff full access
drop policy if exists "staff full access subscription_plans" on subscription_plans;
create policy "staff full access subscription_plans" on subscription_plans
  for all using (auth.uid() is not null);

drop policy if exists "staff full access subscriptions" on subscriptions;
create policy "staff full access subscriptions" on subscriptions
  for all using (auth.uid() is not null);

-- ---------- SEED PLANS ----------
insert into subscription_plans (name, description, price_ghs, features)
select *
from (values
  (
    'Basic',
    'Great for individuals who want regular dental care',
    120.00::numeric,
    '["1 cleaning per month", "Priority appointment booking", "10% off all services", "Free dental checkup"]'::jsonb
  ),
  (
    'Premium',
    'Full-coverage plan for complete dental wellness',
    250.00::numeric,
    '["2 cleanings per month", "Priority appointment booking", "20% off all services", "Free dental checkup", "Free teeth whitening (quarterly)", "Dedicated care coordinator"]'::jsonb
  )
) as t(name, description, price_ghs, features)
where not exists (select 1 from subscription_plans limit 1);
