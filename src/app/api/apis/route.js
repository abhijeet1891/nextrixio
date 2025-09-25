// src/app/api/apis/route.js
import { NextResponse } from "next/server";
import { getApis, addApi } from "@/services/db/apiService";

export async function GET(request) {
  // Get userId from auth/session
  const userId = "mock-user-id"; // Replace with real session
  const apis = await getApis(userId);
  return NextResponse.json(apis);
}

export async function POST(request) {
  const body = await request.json();
  const userId = "mock-user-id"; // Replace with session
  const newApi = await addApi({ ...body, user_id: userId });
  return NextResponse.json(newApi);
}
