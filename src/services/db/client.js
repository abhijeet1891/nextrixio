// src/services/db/client.js

// Supabase client
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export const dbClient = createClient(SUPABASE_URL, SUPABASE_KEY);
