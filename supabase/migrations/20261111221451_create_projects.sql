-- Projects: top-level container for tasks.
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 200),
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS on with no policies: only the service_role key (used by the backend) can access rows.
alter table public.projects enable row level security;

grant select, insert, update, delete on public.projects to service_role;
