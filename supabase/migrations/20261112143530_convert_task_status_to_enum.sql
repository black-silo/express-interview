-- Move task status from free text + check constraint to a proper Postgres enum,
-- and add an "in_review" step between in_progress and done.

create type public.task_status as enum ('todo', 'in_progress', 'in_review', 'done');

-- The check constraint is redundant once the column is an enum.
alter table public.tasks drop constraint tasks_status_check;

-- The text default can't be cast automatically, so swap it around the type change.
alter table public.tasks alter column status drop default;

alter table public.tasks
  alter column status type public.task_status
  using status::public.task_status;

alter table public.tasks alter column status set default 'todo';
