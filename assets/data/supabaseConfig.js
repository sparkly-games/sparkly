import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rlyfsrqbincyhoauehfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJseWZzcnFiaW5jeWhvYXVlaGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTU2NDcsImV4cCI6MjA4NDMzMTY0N30.-ET5SHNDGpZ7j66KJbgGDSP1iIcvA9jv4O4pZvxUmyQ';

export const supabase = createClient(supabaseUrl, supabaseKey);