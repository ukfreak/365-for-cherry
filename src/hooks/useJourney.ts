import { useState, useEffect, useMemo } from 'react';
import { AppSettings } from '../types';

export interface JourneyStats {
  currentDay: number;
  formattedDay: string; // e.g. "Day 001 of 365"
  daysCompleted: number;
  daysRemaining: number;
  progressPercent: number;
  isUnlocked: (day: number) => boolean;
  isDay365: boolean;
  greeting: string;
  todayFormatted: string;
  startDateFormatted: string;
  isFutureJourney: boolean;
  daysUntilStart: number;
  isTodayTimeReached: boolean;
  msUntilTodayUnlock: number;
  notificationTime: string;
}

export function useJourney(settings: AppSettings): JourneyStats {
  // Live clock updating every second
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => {
    const currentHour = now.getHours();

    // Time of day greeting matching user screenshot
    let timeGreeting = 'Hello';
    if (currentHour >= 5 && currentHour < 12) {
      timeGreeting = 'Good morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      timeGreeting = 'Good afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      timeGreeting = 'Good evening';
    } else {
      timeGreeting = 'Sweet dreams';
    }

    const greeting = `${timeGreeting}, ${settings.recipientName}`;

    // Format today's date nicely: "Monday, 23 November 2026"
    const todayFormatted = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);

    // Calculate journey day from start date
    const [year, month, day] = settings.journeyStartDate.split('-').map(Number);
    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    const startDateFormatted = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(startDate);

    const diffTime = todayMidnight.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const isFutureJourney = diffDays < 1;
    const daysUntilStart = isFutureJourney
      ? Math.round((startDate.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Check if the current time has reached the preferred notification time today!
    const [targetH, targetM] = (settings.notificationTime || '09:00').split(':').map(Number);
    const targetUnlockDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetH, targetM, 0, 0);
    const msUntilTodayUnlock = Math.max(0, targetUnlockDate.getTime() - now.getTime());
    const isTodayTimeReached = now.getTime() >= targetUnlockDate.getTime();

    let currentDay = diffDays;
    let formattedDay = `Day 000 of 365`;
    let daysCompleted = 0;
    let daysRemaining = 365;
    let progressPercent = 0;

    if (isFutureJourney) {
      currentDay = 0;
      formattedDay = `Day 000 of 365`;
      daysCompleted = 0;
      daysRemaining = 365;
      progressPercent = 0;
    } else {
      currentDay = Math.max(1, Math.min(365, diffDays));
      formattedDay = `Day ${String(currentDay).padStart(3, '0')} of 365`;
      
      // When today's unlock time is reached, today is unlocked and counted as completed!
      daysCompleted = isTodayTimeReached ? currentDay : Math.max(0, currentDay - 1);
      daysRemaining = Math.max(0, 365 - daysCompleted);
      progressPercent = Math.min(100, Math.max(0, Math.round((daysCompleted / 365) * 100)));
    }

    // Allow manual preview override if in preview mode
    if (settings.previewMode && settings.previewDayOverride) {
      currentDay = Math.max(1, Math.min(365, settings.previewDayOverride));
      formattedDay = `Day ${String(currentDay).padStart(3, '0')} of 365`;
      daysCompleted = currentDay;
      daysRemaining = Math.max(0, 365 - currentDay);
      progressPercent = Math.min(100, Math.max(0, Math.round((currentDay / 365) * 100)));
    }

    // STRICT UNLOCK CHECK:
    // Past days (dayNum < currentDay): Unlocked.
    // Today (dayNum === currentDay): ONLY unlocked if preferred time has arrived (isTodayTimeReached) or previewMode!
    // Future days (dayNum > currentDay): Locked.
    const isUnlocked = (dayNum: number): boolean => {
      if (settings.previewMode) return true;
      if (isFutureJourney) return false;
      if (dayNum < currentDay) return true;
      if (dayNum === currentDay) return isTodayTimeReached;
      return false;
    };

    const isDay365 = currentDay >= 365 && (isTodayTimeReached || settings.previewMode);

    return {
      currentDay,
      formattedDay,
      daysCompleted,
      daysRemaining,
      progressPercent,
      isUnlocked,
      isDay365,
      greeting,
      todayFormatted,
      startDateFormatted,
      isFutureJourney,
      daysUntilStart,
      isTodayTimeReached,
      msUntilTodayUnlock,
      notificationTime: settings.notificationTime || '09:00',
    };
  }, [
    now,
    settings.journeyStartDate,
    settings.notificationTime,
    settings.previewMode,
    settings.previewDayOverride,
    settings.recipientName,
  ]);
}
