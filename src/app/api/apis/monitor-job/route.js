// src/app/api/monitor-job/route.js

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// --- INITIALIZATION ---
// Ensure these environment variables are set on your hosting platform (Vercel/etc.)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

// Initialize the Service Role Client (Bypasses RLS for background writes)
const serviceSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false, 
  }
});

// --- CORE HANDLER: Triggered by the External Cron Job ---
export async function GET(request) {
  // 1. Security Check: Block external access without the secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    console.warn("Unauthorized attempt to run cron job.");
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Fetch all active APIs to check
  let apisToMonitor = [];
  try {
    const { data, error } = await serviceSupabase
      .from('apis')
      .select('id, url, method, alertMs'); 

    if (error) throw error;
    apisToMonitor = data;
  } catch (error) {
    console.error('Failed to fetch APIs from DB:', error.message);
    return NextResponse.json({ success: false, message: 'DB Error fetching APIs' }, { status: 500 });
  }

  // 3. Concurrently execute all checks
  const metricsBatch = apisToMonitor.map(async (api) => {
    const startTime = Date.now();
    let status = 'DOWN';
    let statusCode = null;

    try {
      const response = await fetch(api.url, { method: api.method || 'GET' });
      const responseTime = Date.now() - startTime;
      statusCode = response.status;
      
      if (statusCode >= 200 && statusCode < 300) {
        status = 'UP';
      }

      return {
        "apiId": api.id,
        "status": status,
        "responseTime": responseTime,
        "status_code": statusCode, 
        "checkedAt": new Date().toISOString()
      };
    } catch (error) {
      // Handles network errors, DNS, or fetch timeout
      console.error(`Check failed for ${api.url}:`, error.message);
      return {
        "apiId": api.id,
        "status": 'DOWN',
        "responseTime": Date.now() - startTime,
        "status_code": statusCode,
        "error_details": error.message,
        "checkedAt": new Date().toISOString()
      };
    }
  });

  const results = await Promise.all(metricsBatch);

  // 4. Batch Insert Results
  try {
    const { error } = await serviceSupabase
      .from('apiMetrics')
      .insert(results);

    if (error) throw error;
    
    // Success response
    return NextResponse.json({ 
      success: true, 
      message: `Monitoring job executed. Inserted ${results.length} metrics.`,
      metrics_inserted: results.length
    });

  } catch (error) {
    console.error('Failed to batch insert metrics:', error.message);
    return NextResponse.json({ success: false, message: 'DB Error inserting metrics' }, { status: 500 });
  }
}

// NOTE: POST is not required for a cron job, as Vercel/external schedulers use GET.