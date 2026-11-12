import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

// Shared server-side client. Uses the service_role key, so it bypasses RLS.
// Never expose this key to the browser.
export const supabase = createClient(config.supabaseUrl, config.supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
