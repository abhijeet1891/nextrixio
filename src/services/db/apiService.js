// src/services/db/apiService.js
import { dbClient } from "./client";

// Get all APIs for a user
export async function getApis(userId) {
  const { data, error } = await dbClient
    .from("apis")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

// Add new API
export async function addApi(api) {
  const { data, error } = await dbClient
    .from("apis")
    .insert([api]);
  if (error) throw error;
  return data;
}

// Get API metrics
export async function getApiMetrics(apiId) {
  const { data, error } = await dbClient
    .from("api_metrics")
    .select("*")
    .eq("api_id", apiId)
    .order("checked_at", { ascending: true });
  if (error) throw error;
  return data;
}

// Update API (e.g., status or alert threshold)
export async function updateApi(apiId, payload) {
  const { data, error } = await dbClient
    .from("apis")
    .update(payload)
    .eq("id", apiId);
  if (error) throw error;
  return data;
}
