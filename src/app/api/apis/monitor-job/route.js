import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { monitorQueue } from '@/lib/queue'; // Import the queue utility

// --- INITIALIZATION ---
// Ensure these environment variables are set on your hosting platform (Vercel/etc.)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

// Initialize the Service Role Client (Bypasses RLS for reading the full list of APIs)
const serviceSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false, 
  }
});

/**
 * --- CORE HANDLER: Scheduler/Producer ---
 * This function quickly checks the database for APIs that are due for a check 
 * and immediately offloads the monitoring work to the external BullMQ queue.
 * It is crucial this function executes and returns quickly (< 15 seconds).
 */
export async function GET(request) {
  // 1. Security Check: Block external access without the secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    console.warn("Unauthorized attempt to run cron job.");
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Fetch all active APIs to check (This must be a fast database query)
  let apisToMonitor = [];
  try {
    const { data, error } = await serviceSupabase
      .from('apis')
      .select('id, url, method, frequencyMinutes, headers'); // Fetch all necessary data to enqueue the job

    if (error) throw error;
    apisToMonitor = data;
  } catch (error) {
    console.error('Failed to fetch APIs from DB:', error.message);
    return NextResponse.json({ success: false, message: 'DB Error fetching APIs' }, { status: 500 });
  }

  // 3. Enqueue jobs into the external queue system
  const currentTimestamp = Date.now();
  let jobsEnqueued = 0;
  let enqueuePromises = [];

  apisToMonitor.forEach(api => {
    // In a real system, you would check api.lastChecked time against api.frequencyMinutes
    // to determine if the check is due. For simplicity, we enqueue all for now.
    
    const jobPayload = {
      apiId: api.id,
      url: api.url,
      method: api.method || 'GET',
      headers: api.headers || {},
      supabaseServiceRoleKey: SUPABASE_SERVICE_ROLE_KEY, // Pass necessary credentials for the worker
    };

    // Add the job to the queue and collect the promise
    enqueuePromises.push(monitorQueue.addMonitorJob(api.id, jobPayload));
    jobsEnqueued++;
  });
  
  // Wait for all jobs to be successfully added to the queue (fast I/O operation)
  await Promise.all(enqueuePromises);

  // 4. Return Success Response Immediately
  // We return a 200 OK status to Vercel, signaling the scheduled task is done, 
  // even though the actual monitoring work is happening separately.
  return NextResponse.json({ 
    success: true, 
    message: `API Monitoring Sweep Scheduled. Enqueued ${jobsEnqueued} jobs to the BullMQ Worker.`,
    total_apis: apisToMonitor.length,
    enqueued_jobs: jobsEnqueued
  });
}