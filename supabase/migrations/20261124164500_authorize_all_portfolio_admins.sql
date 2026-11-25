create or replace function public.authorize_new_portfolio_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.admin_users (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function public.authorize_new_portfolio_admin() from public, anon, authenticated;

drop trigger if exists authorize_new_portfolio_admin on auth.users;
create trigger authorize_new_portfolio_admin
after insert on auth.users
for each row execute function public.authorize_new_portfolio_admin();

insert into public.admin_users (user_id)
select id
from auth.users
on conflict (user_id) do nothing;
