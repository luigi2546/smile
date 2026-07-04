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
create type appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

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
create type reminder_type as enum ('follow_up', 'recall_cleaning', 'birthday', 'membership_renewal', 'custom');

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
create policy "public can view active branches" on branches
  for select using (is_active = true);

create policy "public can view active services" on services
  for select using (is_active = true);

-- Public (anon) can INSERT a new customer + appointment via the booking flow,
-- but cannot read/update/delete other people's records.
create policy "public can create a customer record" on customers
  for insert with check (true);

create policy "public can create an appointment" on appointments
  for insert with check (true);

-- Authenticated staff (any row in staff_profiles) can do everything.
create policy "staff full access branches" on branches
  for all using (auth.uid() in (select id from staff_profiles));

create policy "staff full access services" on services
  for all using (auth.uid() in (select id from staff_profiles));

create policy "staff full access customers" on customers
  for all using (auth.uid() in (select id from staff_profiles));

create policy "staff full access appointments" on appointments
  for all using (auth.uid() in (select id from staff_profiles));

create policy "staff full access reminders" on reminders
  for all using (auth.uid() in (select id from staff_profiles));

create policy "staff can view own profile" on staff_profiles
  for select using (auth.uid() = id or auth.uid() in (select id from staff_profiles where role = 'admin'));
