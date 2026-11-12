import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { badRequest, notFound, pick } from '../lib/httpError.js';

const router = Router();
const FIELDS = ['name', 'description'];

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, tasks(*)')
    .eq('id', req.params.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Project');
  res.json(data);
});

router.post('/', async (req, res) => {
  const values = pick(req.body, FIELDS);
  if (typeof values.name !== 'string' || !values.name.trim()) {
    throw badRequest('"name" is required');
  }

  const { data, error } = await supabase.from('projects').insert(values).select().single();
  if (error) throw error;
  res.status(201).json(data);
});

router.patch('/:id', async (req, res) => {
  const values = pick(req.body, FIELDS);
  if (Object.keys(values).length === 0) {
    throw badRequest(`Provide at least one of: ${FIELDS.join(', ')}`);
  }

  const { data, error } = await supabase
    .from('projects')
    .update(values)
    .eq('id', req.params.id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Project');
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', req.params.id)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Project');
  res.status(204).end();
});

export default router;
