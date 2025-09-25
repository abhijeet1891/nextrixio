// src/app/api/apis/[id]/route.js
import { NextResponse } from "next/server";
import { getApiMetrics, updateApi } from "@/services/db/apiService";

export async function GET(request, { params }) {
  const { id } = params;
  const metrics = await getApiMetrics(id);
  return NextResponse.json(metrics);
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const updated = await updateApi(id, body);
  return NextResponse.json(updated);
}
