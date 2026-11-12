import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { badRequest, notFound, pick } from '../lib/httpError.js';

const router = Router();
const CREATE_FIELDS = ['project_id', 'title', 'status', 'due_date', 'blocked_reason'];
const UPDATE_FIELDS = ['title', 'status', 'due_date', 'blocked_reason'];
const STATUSES = ['todo', 'in_progress', 'blocked', 'done'];

function assertValidStatus(status) {
  if (status !== undefined && !STATUSES.includes(status)) {
    throw badRequest(`"status" must be one of: ${STATUSES.join(', ')}`);
  }
}

router.get('/', async (req, res) => {
  const { project_id: projectId, status } = req.query;
  assertValidStatus(status);

  let query = supabase.from('tasks').select('*').order('created_at', { ascending: true });
  if (projectId) query = query.eq('project_id', projectId);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Task');
  res.json(data);
});

router.post('/', async (req, res) => {
  const values = pick(req.body, CREATE_FIELDS);
  if (!values.project_id) throw badRequest('"project_id" is required');
  if (typeof values.title !== 'string' || !values.title.trim()) {
    throw badRequest('"title" is required');
  }
  assertValidStatus(values.status);

  const { data, error } = await supabase.from('tasks').insert(values).select().single();
  if (error) throw error;
  res.status(201).json(data);
});

router.patch('/:id', async (req, res) => {
  const values = pick(req.body, UPDATE_FIELDS);
  if (Object.keys(values).length === 0) {
    throw badRequest(`Provide at least one of: ${UPDATE_FIELDS.join(', ')}`);
  }
  assertValidStatus(values.status);

  const { data, error } = await supabase
    .from('tasks')
    .update(values)
    .eq('id', req.params.id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Task');
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', req.params.id)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Task');
  res.status(204).end();
});

export default router;
