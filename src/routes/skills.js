import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { badRequest } from '../lib/httpError.js';

const router = Router();

/**
 * Parse an optional integer query param, falling back to a default.
 */
function intQuery(value, { name, min, max, fallback }) {
  if (value === undefined) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw badRequest(`"${name}" must be an integer between ${min} and ${max}`);
  }
  return n;
}

// GET /api/skills/:skill/members?min_level=3&limit=10
// Path param:   skill      - skill name, case-insensitive (e.g. "javascript")
// Query params: min_level  - minimum proficiency, 1-5 (default 1)
//               limit      - max results, 1-100 (default 20)
router.get('/:skill/members', async (req, res) => {
  const minLevel = intQuery(req.query.min_level, { name: 'min_level', min: 1, max: 5, fallback: 1 });
  const limit = intQuery(req.query.limit, { name: 'limit', min: 1, max: 100, fallback: 20 });

  const { data, error } = await supabase.rpc('find_members_by_skill', {
    p_skill: req.params.skill,
    p_min_level: minLevel,
    p_limit: limit,
  });
  if (error) throw error;
  res.json(data);
});

export default router;
