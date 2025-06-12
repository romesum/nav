import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://vruzsoulrhbwmdcqmegp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydXpzb3Vscmhid21kY3FtZWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDc0NjcsImV4cCI6MjA2NTAyMzQ2N30.c9Ih0hC7RLPTL0irs31JoqRZDxeEVWyLI8ABOdzlKHE'
)
