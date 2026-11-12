-- Allow tasks to be marked as "blocked" (waiting on something outside the team).
-- Replaces the check constraint created in create_tasks.

alter table public.tasks drop constraint tasks_status_check;

alter table public.tasks
  add constraint tasks_status_check
  check (status in ('todo', 'in_progress', 'blocked', 'done'));

-- An optional reason, only meaningful when the task is blocked.
alter table public.tasks add column blocked_reason text;

alter table public.tasks
  add constraint tasks_blocked_reason_check
  check (blocked_reason is null or status = 'blocked');
