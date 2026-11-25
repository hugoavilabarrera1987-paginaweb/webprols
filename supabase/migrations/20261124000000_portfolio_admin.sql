create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null check (length(btrim(category)) between 1 and 80),
  summary text not null check (length(btrim(summary)) between 1 and 240),
  description_html text not null default '',
  client_name text,
  project_url text check (project_url is null or project_url ~ '^https?://'),
  seo_title text check (seo_title is null or length(seo_title) <= 70),
  seo_description text check (seo_description is null or length(seo_description) <= 170),
  is_published boolean not null default false,
  is_featured boolean not null default false,
  priority integer not null default 0 check (priority >= 0),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists projects_public_listing_idx
  on public.projects (is_published, is_featured desc, priority, published_at desc);
create index if not exists project_images_project_order_idx
  on public.project_images (project_id, sort_order);

create or replace function public.set_project_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.set_project_updated_at();

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

drop policy if exists "Admins can view their admin membership" on public.admin_users;
create policy "Admins can view their admin membership"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Anyone can view published projects" on public.projects;
create policy "Anyone can view published projects"
  on public.projects for select to anon, authenticated
  using (is_published);

drop policy if exists "Portfolio admins can manage projects" on public.projects;
create policy "Portfolio admins can manage projects"
  on public.projects for all to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

drop policy if exists "Anyone can view published project images" on public.project_images;
create policy "Anyone can view published project images"
  on public.project_images for select to anon, authenticated
  using (
    exists (
      select 1
      from public.projects
      where projects.id = project_images.project_id
        and projects.is_published
    )
  );

drop policy if exists "Portfolio admins can manage project images" on public.project_images;
create policy "Portfolio admins can manage project images"
  on public.project_images for all to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

grant select on public.projects, public.project_images to anon, authenticated;
grant insert, update, delete on public.projects, public.project_images to authenticated;
grant select on public.admin_users to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = 8388608,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Portfolio images can be viewed when their project is public" on storage.objects;
create policy "Portfolio images can be viewed when their project is public"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'portfolio-images'
    and exists (
      select 1
      from public.project_images
      join public.projects on projects.id = project_images.project_id
      where project_images.storage_path = storage.objects.name
        and projects.is_published
    )
  );

drop policy if exists "Portfolio admins can view all portfolio images" on storage.objects;
create policy "Portfolio admins can view all portfolio images"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'portfolio-images'
    and (select public.is_portfolio_admin())
  );

drop policy if exists "Portfolio admins can upload portfolio images" on storage.objects;
create policy "Portfolio admins can upload portfolio images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-images'
    and (select public.is_portfolio_admin())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Portfolio admins can update portfolio images" on storage.objects;
create policy "Portfolio admins can update portfolio images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'portfolio-images'
    and (select public.is_portfolio_admin())
  )
  with check (
    bucket_id = 'portfolio-images'
    and (select public.is_portfolio_admin())
  );

drop policy if exists "Portfolio admins can delete portfolio images" on storage.objects;
create policy "Portfolio admins can delete portfolio images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'portfolio-images'
    and (select public.is_portfolio_admin())
  );

