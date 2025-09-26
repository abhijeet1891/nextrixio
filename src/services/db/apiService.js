import { supabase } from "./client";

// -----------------------------
// Users
// -----------------------------
export async function getUser(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

// In your apiService.js:

// 🚨 Must be updated to accept the client instance
export async function addUser(supabaseClient, userProfileData) {
  // Use the client instance passed from handleSignup
  const { data, error } = await supabaseClient 
    .from("users")
    .insert([userProfileData]);
    
  if (error) throw error;
  return data;
}

// -----------------------------
// APIs
// -----------------------------
export async function addApi(api) {
  const { data, error } = await supabase.from("apis").insert([api]);
  if (error) throw error;
  return data[0];
}

// MODIFIED: Read (GET) All User's APIs for the Dashboard List
export async function getApis(userId) {
  const { data, error } = await supabase
    .from("apis")
    .select(`
      *,
      apiMetrics (
        status, 
        responseTime, 
        checkedAt
      )
    `)
    .eq("userId", userId) // Although RLS handles this, it's good for clarity
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data;
}

// -----------------------------
// API Metrics
// -----------------------------
export async function addApiMetric(metric) {
  const { data, error } = await supabase.from("apiMetrics").insert([metric]);
  if (error) throw error;
  return data[0];
}

// NEW: Read (GET) Single API
export async function getSingleApi(apiId) {
  const { data, error } = await supabase
    .from("apis")
    .select(`
      *, 
      apiMetrics (
        status, 
        responseTime, 
        checkedAt
      )
    `)
    .eq('id', apiId)
    .single(); // Ensure only one record is returned

  if (error) throw error;
  return data;
}
// NEW: Update API Configuration
export async function updateApi(apiId, updates) {
  const { data, error } = await supabase
    .from("apis")
    .update(updates)
    .eq('id', apiId)
    .select() // Return the updated record
    .single();

  if (error) throw error;
  return data;
}
// NEW: Delete API Configuration
export async function deleteApi(apiId) {
  const { error } = await supabase
    .from("apis")
    .delete()
    .eq('id', apiId);

  if (error) throw error;
  return true; // Return success status
}