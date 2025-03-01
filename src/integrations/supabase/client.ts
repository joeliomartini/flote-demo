
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://okccwcmjysxqqpxjmwcn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rY2N3Y21qeXN4cXFweGptd2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NjMzNzQsImV4cCI6MjA1NjQzOTM3NH0.KBH4qe5UiBaLsA4frn5RD85RhhDMBv3mCmpSvXBfDfs";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
