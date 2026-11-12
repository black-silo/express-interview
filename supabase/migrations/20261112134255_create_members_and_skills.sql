-- Team members, the skills they have, and a join table linking the two.
-- The join table also records how good a member is at each skill (1-5).

create table public.members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 200),
  email       text not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.skills (
  id    uuid primary key default gen_random_uuid(),
  name  text not null check (char_length(name) between 1 and 100)
);

-- Skill names are unique regardless of case ("React" and "react" are the same skill).
create unique index skills_name_lower_key on public.skills (lower(name));

create table public.member_skills (
  member_id  uuid not null references public.members (id) on delete cascade,
  skill_id   uuid not null references public.skills (id) on delete cascade,
  level      smallint not null check (level between 1 and 5),
  primary key (member_id, skill_id)
);

-- The primary key already covers lookups by member_id; this covers lookups by skill.
create index member_skills_skill_id_idx on public.member_skills (skill_id);

create trigger members_set_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

alter table public.members enable row level security;
alter table public.skills enable row level security;
alter table public.member_skills enable row level security;

grant select, insert, update, delete on public.members, public.skills, public.member_skills to service_role;
