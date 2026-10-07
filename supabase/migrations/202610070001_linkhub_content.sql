-- Apply only to the chosen LinkHub project. Owners are enrolled by an administrator.
create table public.linkhub_owners (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table public.linkhub_state (
  id boolean primary key default true check (id),
  draft jsonb,
  revision integer not null default 0 check (revision >= 0),
  updated_at timestamptz not null default now()
);
create table public.linkhub_published (
  id boolean primary key default true check (id),
  content jsonb not null,
  published_at timestamptz not null default now()
);
alter table public.linkhub_owners enable row level security;
alter table public.linkhub_state enable row level security;
alter table public.linkhub_published enable row level security;
revoke all on public.linkhub_owners, public.linkhub_state, public.linkhub_published from anon, authenticated;
grant all on public.linkhub_owners, public.linkhub_state, public.linkhub_published to service_role;
grant select on public.linkhub_published to anon, authenticated;
create policy "Visitors can read published content" on public.linkhub_published for select to anon, authenticated using (true);
insert into public.linkhub_state (id) values (true);

-- Only the validated Edge Function can write. A stale editor never overwrites newer edits.
create function public.linkhub_write(p_content jsonb, p_revision integer, p_publish boolean)
returns integer language plpgsql security invoker set search_path = '' as $$
declare new_revision integer;
begin
  update public.linkhub_state set draft = p_content, revision = revision + 1, updated_at = now()
    where id = true and revision = p_revision returning revision into new_revision;
  if new_revision is null then return null; end if;
  if p_publish then
    insert into public.linkhub_published (id, content, published_at) values (true, p_content, now())
    on conflict (id) do update set content = excluded.content, published_at = excluded.published_at;
  end if;
  return new_revision;
end;
$$;
revoke all on function public.linkhub_write(jsonb, integer, boolean) from public, anon, authenticated;
grant execute on function public.linkhub_write(jsonb, integer, boolean) to service_role;

-- Original uploads are immutable. No browser role may upload, overwrite, or delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('linkhub-artwork', 'linkhub-artwork', true, 15728640, array['image/png','image/jpeg','image/webp']);
