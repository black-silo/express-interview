-- Tasks belong to a project and are removed together with it.
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  status      text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index tasks_project_id_idx on public.tasks (project_id);

alter table public.tasks enable row level security;

grant select, insert, update, delete on public.tasks to service_role;
