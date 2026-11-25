import express from 'express';
import cors from 'cors';
import webPush from 'web-push';
import cron from 'node-cron';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Paths for persistence
const VAPID_FILE = path.join(__dirname, 'vapid.json');
const SUBS_FILE = path.join(__dirname, 'subscriptions.json');

// Ensure data files exist
function loadVapidKeys() {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    return {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY
    };
  }
  if (fs.existsSync(VAPID_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(VAPID_FILE, 'utf-8'));
    } catch (e) {
      console.error('Failed reading vapid.json, regenerating keys');
    }
  }
  const keys = webPush.generateVAPIDKeys();
  fs.writeFileSync(VAPID_FILE, JSON.stringify(keys, null, 2), 'utf-8');
  console.log('Generated new VAPID keys:');
  console.log('Public Key:', keys.publicKey);
  return keys;
}

const vapidKeys = loadVapidKeys();
webPush.setVapidDetails(
  'mailto:support@365reasons.app',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

function loadSubscriptions() {
  if (fs.existsSync(SUBS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SUBS_FILE, 'utf-8'));
    } catch (e) {
      console.error('Failed reading subscriptions.json');
    }
  }
  return [];
}

function saveSubscriptions(subs) {
  fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2), 'utf-8');
}

// ----------------- ROUTES -----------------

// 1. Get VAPID Public Key for client subscription
app.get('/api/vapid-public-key', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

// 2. Health check
app.get('/api/health', (req, res) => {
  const subs = loadSubscriptions();
  res.json({
    status: 'ok',
    activeSubscribers: subs.length,
    timestamp: new Date().toISOString()
  });
});

// 3. Register or update subscription
app.post('/api/subscribe', (req, res) => {
  const { subscription, notificationTime, journeyStartDate, recipientName, timezone } = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Valid push subscription required' });
  }

  const subs = loadSubscriptions();
  // Filter out any existing subscription with the same endpoint
  const filtered = subs.filter((s) => s.subscription.endpoint !== subscription.endpoint);

  filtered.push({
    id: 'sub-' + Date.now(),
    subscription,
    notificationTime: notificationTime || '09:00',
    journeyStartDate: journeyStartDate || new Date().toISOString().split('T')[0],
    recipientName: recipientName || 'My Love',
    timezone: timezone || 'UTC',
    createdAt: new Date().toISOString(),
    lastSentDate: null
  });

  saveSubscriptions(filtered);
  console.log(`[Push Server] New subscriber registered! Time: ${notificationTime || '09:00'}, Timezone: ${timezone || 'UTC'}`);
  res.status(201).json({ success: true, message: 'Subscribed to daily love reminders!' });
});

// 4. Unsubscribe
app.post('/api/unsubscribe', (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) {
    return res.status(400).json({ error: 'Endpoint required' });
  }

  const subs = loadSubscriptions();
  const remaining = subs.filter((s) => s.subscription.endpoint !== endpoint);
  saveSubscriptions(remaining);

  console.log(`[Push Server] Unsubscribed: ${endpoint.substring(0, 30)}...`);
  res.json({ success: true, message: 'Unsubscribed successfully.' });
});

const REASONS_FILE = path.join(__dirname, 'reasons.json');

function getReasonForDay(dayNumber) {
  if (fs.existsSync(REASONS_FILE)) {
    try {
      const list = JSON.parse(fs.readFileSync(REASONS_FILE, 'utf-8'));
      const found = list.find((r) => r.day === dayNumber);
      if (found && found.text) return found.text;
    } catch (e) {
      console.error('Failed reading reasons.json');
    }
  }
  return "I love how you can make even my most ordinary days feel completely magical and special.";
}

// 5. Send an immediate test notification
app.post('/api/test-notification', async (req, res) => {
  const { subscription, dayNumber, reasonText } = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Push subscription required' });
  }

  const day = dayNumber || 1;
  const bodyText = reasonText || getReasonForDay(day);

  const payload = JSON.stringify({
    title: 'A little reminder from someone who loves you ❤️',
    body: bodyText,
    day: day,
    url: `/?day=${day}`
  });

  try {
    await webPush.sendNotification(subscription, payload);
    console.log('[Push Server] Test notification delivered with reason text!');
    res.json({ success: true, message: 'Test notification sent!' });
  } catch (error) {
    console.error('[Push Server] Failed to send test notification:', error);
    res.status(500).json({
      error: 'Failed to send notification via Web Push',
      details: error.message
    });
  }
});

// ----------------- BACKGROUND SCHEDULER -----------------
// Runs every minute to check if any user needs their daily reminder
cron.schedule('* * * * *', async () => {
  const subs = loadSubscriptions();
  if (subs.length === 0) return;

  const now = new Date();
  const currentUtcHour = now.getUTCHours();
  const currentUtcMinute = now.getUTCMinutes();

  let modified = false;

  for (const sub of subs) {
    try {
      // Determine local time for user's timezone
      let userHour, userMinute, userDateStr;
      try {
        const userTimeStr = new Intl.DateTimeFormat('en-GB', {
          timeZone: sub.timezone,
          hour: '2-digit',
          minute: '2-digit',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour12: false
        }).format(now);
        // Format: DD/MM/YYYY, HH:MM
        const parts = userTimeStr.split(', ');
        const timeParts = parts[1].split(':');
        userHour = parseInt(timeParts[0], 10);
        userMinute = parseInt(timeParts[1], 10);
        userDateStr = parts[0];
      } catch (e) {
        // Fallback to UTC
        userHour = currentUtcHour;
        userMinute = currentUtcMinute;
        userDateStr = now.toISOString().split('T')[0];
      }

      const [targetH, targetM] = (sub.notificationTime || '09:00').split(':').map(Number);

      // Check if it's the target time and hasn't already been sent today
      if (userHour === targetH && userMinute === targetM && sub.lastSentDate !== userDateStr) {
        // Calculate day number safely
        const start = new Date(sub.journeyStartDate);
        const diffMs = now.getTime() - start.getTime();
        const rawDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = Math.max(1, Math.min(365, rawDay));
        const reasonText = getReasonForDay(currentDay);

        console.log(`[Push Server] Sending daily reminder to ${sub.recipientName} for Day ${currentDay}...`);

        const payload = JSON.stringify({
          title: 'A little reminder from someone who loves you ❤️',
          body: reasonText,
          day: currentDay,
          url: `/?day=${currentDay}`
        });

        await webPush.sendNotification(sub.subscription, payload);
        sub.lastSentDate = userDateStr;
        modified = true;
      }
    } catch (err) {
      console.error(`[Push Server] Error delivering to subscriber ${sub.id}:`, err.message);
      // If subscription expired or gone (410 / 404), mark for cleanup
      if (err.statusCode === 410 || err.statusCode === 404) {
        sub.toRemove = true;
        modified = true;
      }
    }
  }

  if (modified) {
    const active = subs.filter((s) => !s.toRemove);
    saveSubscriptions(active);
  }
});

// ---------------------------------------------------------------
// SHARED MEMORIES (stored in Supabase so every device sees them)
// Needs these environment variables on Render:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, MEMORIES_PASSWORD
// ---------------------------------------------------------------
const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const MEMORIES_PASSWORD = process.env.MEMORIES_PASSWORD || '';

function memoriesConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY && MEMORIES_PASSWORD);
}

function supabase(pathAndQuery, options = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      // Old-style keys are JWTs (start with "eyJ") and go in Authorization too;
      // new-style "sb_secret_..." keys must only be sent as apikey.
      ...(SUPABASE_SERVICE_KEY.startsWith('eyJ') ? { Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } : {}),
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

function passwordOk(req) {
  const given = Buffer.from(String(req.get('x-memories-password') || ''));
  const wanted = Buffer.from(MEMORIES_PASSWORD);
  return given.length === wanted.length && crypto.timingSafeEqual(given, wanted);
}

function requireMemoriesAccess(req, res, next) {
  if (!memoriesConfigured()) {
    return res.status(503).json({ error: 'Shared memories are not set up on the server yet.' });
  }
  if (!passwordOk(req)) {
    return res.status(401).json({ error: 'Wrong password.' });
  }
  next();
}

app.get('/api/memories', async (req, res) => {
  if (!memoriesConfigured()) {
    return res.status(503).json({ error: 'Shared memories are not set up on the server yet.' });
  }
  try {
    const r = await supabase('memories?select=*&order=created_at.desc');
    if (!r.ok) throw new Error(`Supabase responded ${r.status}`);
    const rows = await r.json();
    res.json({
      memories: rows.map((m) => ({
        id: m.id,
        title: m.title,
        date: m.date,
        caption: m.caption,
        imageDataUrl: m.image_data_url,
        tag: m.tag || undefined,
        createdAt: Number(m.created_at),
      })),
    });
  } catch (err) {
    console.error('Failed to load memories:', err.message);
    res.status(502).json({ error: 'Could not load memories.' });
  }
});

app.post('/api/memories', requireMemoriesAccess, async (req, res) => {
  const m = req.body || {};
  const valid =
    typeof m.id === 'string' && m.id.length > 0 && m.id.length <= 100 &&
    !m.id.startsWith('default-') &&
    typeof m.title === 'string' && m.title.trim() && m.title.length <= 200 &&
    typeof m.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(m.date) &&
    typeof m.caption === 'string' && m.caption.length <= 5000 &&
    typeof m.imageDataUrl === 'string' && m.imageDataUrl.startsWith('data:image/') &&
    m.imageDataUrl.length <= 6_000_000 &&
    Number.isFinite(m.createdAt);
  if (!valid) return res.status(400).json({ error: 'Invalid memory.' });

  try {
    const r = await supabase('memories?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        id: m.id,
        title: m.title.trim(),
        date: m.date,
        caption: m.caption,
        image_data_url: m.imageDataUrl,
        tag: typeof m.tag === 'string' && m.tag.trim() ? m.tag.trim().slice(0, 100) : null,
        created_at: Math.round(m.createdAt),
      }),
    });
    if (!r.ok) throw new Error(`Supabase responded ${r.status}`);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to save memory:', err.message);
    res.status(502).json({ error: 'Could not save the memory.' });
  }
});

app.delete('/api/memories/:id', requireMemoriesAccess, async (req, res) => {
  try {
    const r = await supabase(`memories?id=eq.${encodeURIComponent(req.params.id)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    });
    if (!r.ok) throw new Error(`Supabase responded ${r.status}`);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete memory:', err.message);
    res.status(502).json({ error: 'Could not delete the memory.' });
  }
});

// Serve static frontend in production if dist directory exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log('===============================================');
  console.log(`✨ 365 Reasons Server running on 0.0.0.0:${PORT}`);
  console.log('===============================================');
});
