-- Sample data loaded by `npm run db:reset`.
insert into public.projects (id, name, description) values
  ('11111111-1111-1111-1111-111111111111', 'Website relaunch', 'Redesign and relaunch the marketing site'),
  ('22222222-2222-2222-2222-222222222222', 'Mobile app', 'First version of the companion app');

insert into public.tasks (project_id, title, status, due_date) values
  ('11111111-1111-1111-1111-111111111111', 'Draft wireframes',        'done',        '2026-11-01'),
  ('11111111-1111-1111-1111-111111111111', 'Write landing page copy', 'in_progress', '2026-11-20'),
  ('11111111-1111-1111-1111-111111111111', 'Set up analytics',        'todo',        null),
  ('22222222-2222-2222-2222-222222222222', 'Choose framework',        'done',        '2026-10-15'),
  ('22222222-2222-2222-2222-222222222222', 'Build login screen',      'todo',        '2026-12-01');

insert into public.members (id, name, email) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Ada Lovelace',    'ada@example.com'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Grace Hopper',    'grace@example.com'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Linus Torvalds',  'linus@example.com'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'Margaret Hamilton', 'margaret@example.com');

insert into public.skills (id, name) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'JavaScript'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'SQL'),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'React'),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'Docker'),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'Rust');

-- level: 1 = beginner ... 5 = expert. Nobody has Rust yet.
insert into public.member_skills (member_id, skill_id, level) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 5),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000002', 3),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000001', 3),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', 5),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000004', 2),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000004', 5),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000001', 1),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000003', 4),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000001', 4);
