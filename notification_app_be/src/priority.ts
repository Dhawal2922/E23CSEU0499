import 'dotenv/config';
import { Log, initLogger } from 'logger-middleware';

// Initialize logger
initLogger({ token: process.env.LOG_TOKEN || '' });

// Type definitions for Notification
export interface Notification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;
  Timestamp: string;
}

// Weights for priority sorting
const WEIGHTS: Record<Notification['Type'], number> = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

// Fallback data in case the corporate firewall blocks the 4.224.186.213 IP
const FALLBACK_NOTIFICATIONS: Notification[] = [
  { "ID": "d146095a-0d86-4a34-9e69-3900a14576bc", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30" },
  { "ID": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18" },
  { "ID": "81589ada-0ad3-4f77-9554-f52fb558e09d", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06" },
  { "ID": "0005513a-142b-4bbc-8678-eefec65e1ede", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:50:54" },
  { "ID": "ea836726-c25e-4f21-a72f-544a6af8a37f", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:42" },
  { "ID": "003cb427-8fc6-47f7-bb00-be228f6b0d2c", "Type": "Result", "Message": "external", "Timestamp": "2026-04-22 17:50:30" },
  { "ID": "e5c4ff20-31bf-4d40-8f02-72fda59e8918", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:18" },
  { "ID": "1cfce5ee-ad37-4894-8946-d707627176a5", "Type": "Event", "Message": "tech-fest", "Timestamp": "2026-04-22 17:50:06" },
  { "ID": "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:49:54" },
  { "ID": "8a7412bd-6065-4d09-8501-a37f11cc848b", "Type": "Placement", "Message": "Advanced Micro Devices Inc. hiring", "Timestamp": "2026-04-22 17:49:42" }
];

/**
 * Fetches notifications from the API, falling back to sample data if blocked by firewall.
 */
async function fetchNotifications(): Promise<Notification[]> {
  const url = 'http://4.224.186.213/evaluation-service/notifications';
  
  await Log('backend', 'info', 'service', `Attempting to fetch notifications from ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.LOG_TOKEN}`,
        'Content-Type': 'application/json'
      },
      // Timeout aggressively so it doesn't hang forever if the firewall drops the packet silently
      signal: AbortSignal.timeout(5000) 
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    await Log('backend', 'info', 'service', `Successfully fetched ${data.notifications?.length || 0} notifications`);
    return data.notifications || [];

  } catch (error: any) {
    await Log('backend', 'error', 'service', `Network/Firewall error fetching notifications: ${error.message}`);
    console.warn(`[WARN] Using fallback data because the external API failed (${error.message}).`);
    return FALLBACK_NOTIFICATIONS;
  }
}

/**
 * Priority Queue Sorting Algorithm
 * Placement > Result > Event
 * Resolves ties using descending timestamp (newest first)
 */
function sortPriority(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    // Compare weights first
    const weightA = WEIGHTS[a.Type] || 0;
    const weightB = WEIGHTS[b.Type] || 0;
    
    if (weightA !== weightB) {
      return weightB - weightA; // Higher weight comes first
    }

    // Tie-breaker: Recency
    const timeA = new Date(a.Timestamp.replace(' ', 'T')).getTime();
    const timeB = new Date(b.Timestamp.replace(' ', 'T')).getTime();
    
    return timeB - timeA; // Newer timestamp comes first
  });
}

/**
 * Main execution block
 */
export async function getTopNNotifications(n: number = 10): Promise<Notification[]> {
  await Log('backend', 'info', 'controller', `Requested top ${n} priority notifications`);
  
  const notifications = await fetchNotifications();
  const sorted = sortPriority(notifications);
  const topN = sorted.slice(0, n);

  await Log('backend', 'info', 'controller', `Successfully computed top ${n} priority notifications`);
  return topN;
}

// If executed directly
if (require.main === module) {
  (async () => {
    console.log("=== Campus Priority Inbox ===");
    const top10 = await getTopNNotifications(10);
    
    top10.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.Type}] ${notif.Message} (${notif.Timestamp})`);
    });
    console.log("=============================");
  })();
}
