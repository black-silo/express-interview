import { HttpError } from '../lib/httpError.js';

// Postgres error codes that are the client's fault.
// https://www.postgresql.org/docs/current/errcodes-appendix.html
const CLIENT_PG_ERRORS = {
  '22P02': 'Invalid input syntax', // e.g. malformed uuid
  '22007': 'Invalid date/time format',
  '22008': 'Date/time value out of range',
  '22023': 'Invalid parameter value', // raised by our SQL functions
  '23502': 'Missing required field', // not_null_violation
  '23503': 'Referenced record does not exist', // foreign_key_violation
  '23505': 'Duplicate value', // unique_violation
  '23514': 'Value violates a constraint', // check_violation
};

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// Express recognises error handlers by their 4-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }

  // Malformed JSON body from express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // PostgrestError from supabase-js.
  // P0002 (no_data_found) is raised by our SQL functions when a record is missing.
  if (err.code === 'P0002') {
    return res.status(404).json({ error: err.message });
  }
  if (err.code && CLIENT_PG_ERRORS[err.code]) {
    return res.status(400).json({ error: CLIENT_PG_ERRORS[err.code], details: err.message });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
