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

export async function addUser(user) {
  const { data, error } = await supabase.from("users").insert([user]);
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

export async function getApis(userId) {
  const { data, error } = await supabase
    .from("apis")
    .select("*")
    .eq("userId", userId);
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

export async function getApiMetrics(apiId) {
  const { data, error } = await supabase
    .from("apiMetrics")
    .select("*")
    .eq("apiId", apiId)
    .order("checkedAt", { ascending: true });
  if (error) throw error;
  return data;
}
