// Import the Supabase client
import { createClient } from '@supabase/supabase-js';

// Supabase API URL and anon public key
const supabaseUrl = 'https://ejittbocyykewnhbzpxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqaXR0Ym9jeXlrZXduaGJ6cHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjE2MTgsImV4cCI6MjA2MjE5NzYxOH0.l5Rd9AFcfOphQcLEkx6gayw-LAJ1UUVuZ_QYdskLcTg';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
