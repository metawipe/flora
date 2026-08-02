-- Zamin Gullari: profiles, products, orders + RLS
-- Run in Supabase SQL Editor (or via supabase db push)

create extension if not exists citext;

create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum (
  'new',
  'confirmed',
  'delivering',
  'done',
  'cancelled'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  login citext not null unique,
  phone text not null default '',
  name text,
  last_name text,
  email text,
  address text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id text primary key,
  name text not null,
  price numeric not null check (price >= 0),
  old_price numeric,
  badge text,
  images jsonb not null default '[]'::jsonb,
  category text not null default 'bouquets',
  description text,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id text primary key,
  created_at timestamptz not null default now(),
  status public.order_status not null default 'new',
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  phone text not null,
  address text not null,
  date text not null,
  slot text not null default 'slotDay',
  pay text not null default 'cash',
  comment text not null default '',
  recipient text,
  card_text text,
  promo_code text,
  discount numeric not null default 0,
  total numeric not null default 0,
  items jsonb not null default '[]'::jsonb
);

create index products_category_idx on public.products (category);
create index products_available_idx on public.products (available);
create index orders_created_at_idx on public.orders (created_at desc);
create index orders_user_id_idx on public.orders (user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, login, phone, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'login', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Profiles
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id);
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin());

-- Products
create policy products_public_read on public.products
  for select using (available = true or public.is_admin());
create policy products_admin_insert on public.products
  for insert with check (public.is_admin());
create policy products_admin_update on public.products
  for update using (public.is_admin());
create policy products_admin_delete on public.products
  for delete using (public.is_admin());

-- Orders
create policy orders_insert_anyone on public.orders
  for insert with check (true);
create policy orders_select_own_or_admin on public.orders
  for select using (
    public.is_admin()
    or (auth.uid() is not null and user_id = auth.uid())
  );
create policy orders_admin_update on public.orders
  for update using (public.is_admin());
