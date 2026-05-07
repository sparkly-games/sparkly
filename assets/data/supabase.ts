import { createClient } from '@supabase/supabase-js';
import { getAuth } from 'firebase/auth';
import ENV_VARS from '@/assets/data/env';

const supabaseUrl = ENV_VARS.SUPABASE_URL;
const supabaseAnonKey = ENV_VARS.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (url, options = {}) => {
      const auth = getAuth();
      const user = auth.currentUser;
      const headers = new Headers(options.headers);

      headers.set('apikey', supabaseAnonKey);
      if (user) {
        const token = await user.getIdToken();
        headers.set('Authorization', `Bearer ${token}`);
      }

      return fetch(url, { ...options, headers });
    },
  },
});