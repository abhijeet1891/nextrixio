// services/db/authClient.js
import { createBrowserClient } from "@supabase/ssr";

export function getAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // This function sets up the client to read the session from cookies
  return createBrowserClient(supabaseUrl, supabaseKey); 
}