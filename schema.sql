
-- Minimal schema for this build
create table if not exists customers(
  id uuid primary key default gen_random_uuid(),
  owner uuid,
  name text,
  phone text,
  email text,
  created_at timestamptz default now()
);

create table if not exists jobs(
  id uuid primary key default gen_random_uuid(),
  owner uuid,
  customer_id uuid references customers(id) on delete set null,
  art_desc text,
  storage_loc text,
  width_in numeric,
  height_in numeric,
  allowance_in numeric,
  tax_pct numeric,
  labor numeric,
  grand_text text,
  due_date date,
  created_at timestamptz default now()
);

create table if not exists job_mouldings(
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  position int,
  item text,
  ppft numeric
);

create table if not exists job_specials(
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  position int,
  descr text,
  unit numeric,
  qty numeric
);
