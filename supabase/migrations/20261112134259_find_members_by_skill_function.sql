-- Find members who have a given skill at or above a minimum level.
-- Called from the API with supabase.rpc('find_members_by_skill', { ... }).
--
-- Raises P0002 (no_data_found) when the skill does not exist, so the API can
-- tell "unknown skill" (404) apart from "nobody has this skill" (empty list).
create or replace function public.find_members_by_skill(
  p_skill     text,
  p_min_level int default 1,
  p_limit     int default 20
)
returns table (
  member_id uuid,
  name      text,
  email     text,
  skill     text,
  level     smallint
)
language plpgsql
stable
set search_path = ''
as $$
declare
  v_skill_id   uuid;
  v_skill_name text;
begin
  if p_min_level not between 1 and 5 then
    raise exception 'p_min_level must be between 1 and 5' using errcode = '22023'; -- invalid_parameter_value
  end if;

  if p_limit not between 1 and 100 then
    raise exception 'p_limit must be between 1 and 100' using errcode = '22023';
  end if;

  select s.id, s.name
    into v_skill_id, v_skill_name
    from public.skills s
   where lower(s.name) = lower(p_skill);

  if v_skill_id is null then
    raise exception 'Skill "%" not found', p_skill using errcode = 'P0002';
  end if;

  return query
    select m.id, m.name, m.email, v_skill_name, ms.level
      from public.member_skills ms
      join public.members m on m.id = ms.member_id
     where ms.skill_id = v_skill_id
       and ms.level >= p_min_level
     order by ms.level desc, m.name asc
     limit p_limit;
end;
$$;

-- Only the backend (service_role) may call this function.
revoke execute on function public.find_members_by_skill(text, int, int) from public, anon, authenticated;
grant execute on function public.find_members_by_skill(text, int, int) to service_role;
