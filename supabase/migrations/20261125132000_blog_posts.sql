create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null check (length(btrim(category)) between 1 and 80),
  summary text not null check (length(btrim(summary)) between 1 and 240),
  content_html text not null default '',
  read_minutes integer not null default 1 check (read_minutes between 1 and 60),
  is_published boolean not null default false,
  seo_title text check (seo_title is null or length(seo_title) <= 70),
  seo_description text check (seo_description is null or length(seo_description) <= 170),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_public_listing_idx
  on public.blog_posts (is_published, published_at desc);

create or replace function public.set_blog_post_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_blog_post_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Anyone can view published blog posts" on public.blog_posts;
create policy "Anyone can view published blog posts"
  on public.blog_posts for select to anon, authenticated
  using (is_published);

drop policy if exists "Portfolio admins can manage blog posts" on public.blog_posts;
create policy "Portfolio admins can manage blog posts"
  on public.blog_posts for all to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

insert into public.blog_posts (
  title,
  slug,
  category,
  summary,
  read_minutes,
  is_published,
  published_at
)
values
  (
    'Por qué una empresa necesita un sitio web profesional',
    'por-que-empresa-necesita-sitio-web-profesional',
    'Diseño web',
    'Descubre cómo una presencia digital bien construida genera confianza y consultas.',
    5,
    true,
    now()
  ),
  (
    'Cuándo una empresa necesita un sistema web',
    'cuando-empresa-necesita-sistema-web',
    'Sistemas personalizados',
    'Identifica cuándo automatizar procesos puede mejorar la gestión y reducir tareas manuales.',
    6,
    true,
    now() - interval '1 minute'
  ),
  (
    'Qué es el SEO técnico',
    'que-es-el-seo-tecnico',
    'SEO',
    'Revisa los elementos técnicos que ayudan a los buscadores a entender y mostrar tu sitio.',
    7,
    true,
    now() - interval '2 minutes'
  ),
  (
    'Cómo mejorar la velocidad de un sitio',
    'como-mejorar-velocidad-sitio',
    'Optimización web',
    'Conoce prácticas clave para ofrecer una experiencia rápida en todos los dispositivos.',
    5,
    true,
    now() - interval '3 minutes'
  ),
  (
    'Beneficios de una tienda online',
    'beneficios-tienda-online',
    'Tiendas online',
    'Cómo vender de forma continua y administrar productos y pedidos desde un solo lugar.',
    6,
    true,
    now() - interval '4 minutes'
  ),
  (
    'Cómo mejorar la experiencia de usuario',
    'como-mejorar-experiencia-usuario',
    'UX/UI',
    'Principios para crear navegación clara, accesible y orientada a conversiones.',
    5,
    true,
    now() - interval '5 minutes'
  )
on conflict (slug) do nothing;
