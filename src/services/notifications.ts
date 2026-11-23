import { AppSettings } from '../types';

export interface NotificationStatus {
  supported: boolean;
  permission: NotificationPermission;
  isStandalone: boolean;
  isIOS: boolean;
  isSubscribed: boolean;
  instructions?: string;
}

// Convert VAPID public key string to Uint8Array for pushManager
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

export function getEffectiveServerUrl(configuredUrl?: string): string {
  if (typeof window === 'undefined') return configuredUrl || '';
  if (!configuredUrl || configuredUrl.includes('localhost:3001')) {
    // If running in production browser on a domain, use the current origin
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return window.location.origin;
    }
  }
  return configuredUrl || 'http://localhost:3001';
}

export function isStandalonePWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export async function checkNotificationSupport(): Promise<NotificationStatus> {
  const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const ios = isIOS();
  const standalone = isStandalonePWA();

  let permission: NotificationPermission = 'default';
  if ('Notification' in window) {
    permission = Notification.permission;
  }

  let isSubscribed = false;
  if (supported && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      isSubscribed = !!sub;
    } catch (e) {
      // ignore
    }
  }

  let instructions: string | undefined;
  if (ios && !standalone) {
    instructions =
      'On Apple iOS devices, daily push notifications require adding this app to your Home Screen first. Tap the Share icon below and select "Add to Home Screen".';
  }

  return {
    supported,
    permission,
    isStandalone: standalone,
    isIOS: ios,
    isSubscribed,
    instructions,
  };
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser.');
  }
  return await Notification.requestPermission();
}

export async function subscribeToPushNotifications(settings: AppSettings): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications are not supported in this environment.');
  }

  // 1. Ensure permission is granted
  const perm = await requestPermission();
  if (perm !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  // 2. Register / wait for service worker
  const registration = await navigator.serviceWorker.ready;
  const baseUrl = getEffectiveServerUrl(settings.serverUrl);

  // 3. Fetch VAPID public key from backend server
  let publicKey = '';
  try {
    const res = await fetch(`${baseUrl}/api/vapid-public-key`);
    if (res.ok) {
      const data = await res.json();
      publicKey = data.publicKey;
    }
  } catch (err) {
    console.warn('Backend push server not reachable, using mock subscription mode for demo.');
  }

  if (!publicKey) {
    // If backend isn't reached, show local notification confirmation
    await showLocalNotification(
      'Daily Reminders Enabled! ❤️',
      `You'll receive a reminder every day at ${settings.notificationTime}`
    );
    return null;
  }

  // 4. Subscribe with PushManager
  const convertedKey = urlBase64ToUint8Array(publicKey);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  });

  // 5. Send subscription to backend server
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        notificationTime: settings.notificationTime,
        journeyStartDate: settings.journeyStartDate,
        recipientName: settings.recipientName,
        timezone,
      }),
    });
  } catch (e) {
    console.error('Failed to register subscription with server', e);
  }

  return subscription;
}

export async function unsubscribeFromPushNotifications(serverUrl: string): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;

  const baseUrl = getEffectiveServerUrl(serverUrl);

  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe();
      try {
        await fetch(`${baseUrl}/api/unsubscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        });
      } catch (e) {
        // ignore
      }
      return true;
    }
  } catch (err) {
    console.error('Unsubscribe error:', err);
  }
  return false;
}

export async function sendTestNotification(
  settings: AppSettings,
  currentDay: number,
  reasonText?: string
): Promise<void> {
  const perm = await requestPermission();
  if (perm !== 'granted') {
    throw new Error('Permission denied. Please allow notifications in your browser settings.');
  }

  const notificationContent =
    reasonText ||
    'I love how you can make even my most ordinary days feel completely magical and special.';

  const baseUrl = getEffectiveServerUrl(settings.serverUrl);

  // First try backend web push if subscribed
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();

    if (sub) {
      try {
        const res = await fetch(`${baseUrl}/api/test-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription: sub,
            dayNumber: currentDay,
            reasonText: notificationContent,
          }),
        });
        if (res.ok) return;
      } catch (e) {
        console.warn('Backend test notification call failed, falling back to local service worker notification.');
      }
    }

    // Local Service Worker notification fallback
    await reg.showNotification('A little reminder from someone who loves you ❤️', {
      body: notificationContent,
      icon: '/icons/icon-192.png',
      badge: '/icons/heart.svg',
      data: { url: `/?day=${currentDay}`, day: currentDay },
      vibrate: [200, 100, 200],
    } as any);
    return;
  }

  // Simple Notification API fallback
  new Notification('A little reminder from someone who loves you ❤️', {
    body: notificationContent,
    icon: '/icons/icon-192.png',
  });
}

export async function showLocalNotification(title: string, body: string): Promise<void> {
  if (Notification.permission !== 'granted') return;
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/heart.svg',
    });
  } else {
    new Notification(title, { body, icon: '/icons/icon-192.png' });
  }
}
