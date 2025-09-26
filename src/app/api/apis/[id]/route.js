// src/app/api/apis/[id]/route.js
import { NextResponse } from "next/server";
import { 
    // FIX: Import the function that *actually* fetches the API and its metrics
    getSingleApi, 
    updateApi, 
    // REMOVED: getApiMetrics, which caused the error
} from "../../../../services/db/apiService"; 

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    // Call getSingleApi, which fetches the API configuration AND its nested metrics
    const apiWithMetrics = await getSingleApi(id); 
    
    if (!apiWithMetrics) {
      return NextResponse.json({ message: "API not found" }, { status: 404 });
    }
    
    // Return the full object
    return NextResponse.json(apiWithMetrics); 

  } catch (error) {
    console.error("Error fetching single API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;
  
  try {
    const body = await request.json();
    const updated = await updateApi(id, body);

    if (!updated) {
      return NextResponse.json({ message: "API not found or not authorized" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}