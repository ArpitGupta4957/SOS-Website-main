import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project details
const SUPABASE_URL = 'https://phjzmfrsaanbxeoudzih.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoanptZnJzYWFuYnhlb3VkemloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMzkzMDgsImV4cCI6MjA1NzgxNTMwOH0.Gj6Dah6jDGwnhY2v2PPHyr_WArVG8Ox-8JiafU2AD88'
// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
