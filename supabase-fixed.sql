
-- Esquema y políticas para Supabase (corregido, sin IF NOT EXISTS)
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  email text,
  preferred_household_id uuid,
  created_at timestamptz default now()
);

create table if not exists public.coaches (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.households (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.household_members (
  household_id uuid references public.households(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('owner','member')) default 'member',
  primary key (household_id, user_id)
);

create table if not exists public.incomes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  household_id uuid references public.households(id) on delete set null,
  source text not null,
  amount numeric(14,2) not null check (amount >= 0),
  kind text check (kind in ('fijo','variable')) default 'fijo',
  created_at timestamptz default now()
);

create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  household_id uuid references public.households(id) on delete set null,
  category text not null,
  amount numeric(14,2) not null check (amount >= 0),
  essential boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.debts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  household_id uuid references public.households(id) on delete set null,
  creditor text not null,
  type text check (type in ('tarjeta','prestamo','hipoteca','otro')) default 'tarjeta',
  balance numeric(14,2) not null check (balance >= 0),
  min_payment numeric(14,2) not null default 0,
  rate numeric(7,4) default 0,
  priority integer default 999,
  created_at timestamptz default now()
);

create table if not exists public.savings_fund (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  household_id uuid references public.households(id) on delete set null,
  goal numeric(14,2) not null check (goal >= 0),
  current numeric(14,2) not null default 0 check (current >= 0),
  updated_at timestamptz default now()
);

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  due_date date,
  status text check (status in ('pendiente','hecha')) default 'pendiente',
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  level text check (level in ('basico','intermedio','avanzado')) default 'basico',
  kind text check (kind in ('video','pdf','audio','nota')) default 'nota',
  title text not null,
  url text
);

alter table profiles enable row level security;
alter table households enable row level security;
alter table household_members enable row level security;
alter table incomes enable row level security;
alter table expenses enable row level security;
alter table debts enable row level security;
alter table savings_fund enable row level security;
alter table tasks enable row level security;
alter table resources enable row level security;

create or replace function is_coach(u uuid) returns boolean language sql stable as $$
  select exists (select 1 from public.coaches c where c.user_id = u);
$$;

create or replace function in_same_household(u uuid, h uuid) returns boolean language sql stable as $$
  select exists(select 1 from public.household_members hm where hm.user_id = u and hm.household_id = h);
$$;

create policy "profiles read own or coach" on profiles for select using (auth.uid() = user_id or is_coach(auth.uid()));
create policy "profiles upsert own" on profiles for all using (auth.uid() = user_id);

create policy "households member read" on households for select using (in_same_household(auth.uid(), id) or created_by = auth.uid() or is_coach(auth.uid()));
create policy "households owner write" on households for all using (created_by = auth.uid());

create policy "household_members member read" on household_members for select using (in_same_household(auth.uid(), household_id) or is_coach(auth.uid()));
create policy "household_members owner write" on household_members for all using (auth.uid() = user_id);

create policy "incomes select" on incomes for select using (user_id = auth.uid() or is_coach(auth.uid()) or (household_id is not null and in_same_household(auth.uid(), household_id)));
create policy "incomes modify" on incomes for all using (user_id = auth.uid() or (household_id is not null and in_same_household(auth.uid(), household_id)));

create policy "expenses select" on expenses for select using (user_id = auth.uid() or is_coach(auth.uid()) or (household_id is not null and in_same_household(auth.uid(), household_id)));
create policy "expenses modify" on expenses for all using (user_id = auth.uid() or (household_id is not null and in_same_household(auth.uid(), household_id)));

create policy "debts select" on debts for select using (user_id = auth.uid() or is_coach(auth.uid()) or (household_id is not null and in_same_household(auth.uid(), household_id)));
create policy "debts modify" on debts for all using (user_id = auth.uid() or (household_id is not null and in_same_household(auth.uid(), household_id)));

create policy "fund select" on savings_fund for select using (user_id = auth.uid() or is_coach(auth.uid()) or (household_id is not null and in_same_household(auth.uid(), household_id)));
create policy "fund modify" on savings_fund for all using (user_id = auth.uid() or (household_id is not null and in_same_household(auth.uid(), household_id)));

create policy "tasks select" on tasks for select using (user_id = auth.uid() or is_coach(auth.uid()));
create policy "tasks insert" on tasks for insert with check (auth.uid() = user_id or is_coach(auth.uid()));
create policy "tasks update" on tasks for update using (auth.uid() = user_id or is_coach(auth.uid()));
create policy "tasks delete" on tasks for delete using (auth.uid() = user_id or is_coach(auth.uid()));

create policy "resources read" on resources for select using (true);
create policy "resources coach write" on resources for all using (is_coach(auth.uid()));
