// src/services/db/authClient.js
'use client'; 

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// --- 1. Core Client Initialization ---
// Initialize the client once outside the hook. This constant will be used by all exports.
const coreSupabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Export the core client instance for direct use in service files (e.g., apiService.js)
export const supabaseClient = coreSupabaseClient;


// --- 2. The useAuth Hook (Client-Side State) ---
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial session/user
    coreSupabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Set up real-time listener for auth state changes
    const { data: { subscription } } = coreSupabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []); 

  return { 
    user, 
    loading,
    supabase: coreSupabaseClient // Expose the client via the hook
  };
}


// --- 3. The Original getAuthClient Function (For compatibility) ---
// This function returns the same core client instance.
export function getAuthClient() {
  // It's cleaner to just return the pre-initialized constant:
  return coreSupabaseClient; 
}