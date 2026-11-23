import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { AppSettings, Memory, Reason, VoiceNote } from './types';
import {
  getAllReasons,
  getAllMemories,
  getAllVoiceNotes,
  getSettings,
  saveSettings as saveSettingsToDb,
  updateReason as updateReasonInDb,
  markReasonRevealed,
  toggleFavoriteReason,
  resetAllReasons,
  saveMemory as saveMemoryToDb,
  deleteMemory as deleteMemoryFromDb,
  clearAllMemories,
  resetAllAppData,
  saveVoiceNote as saveVoiceNoteToDb,
  deleteVoiceNote as deleteVoiceNoteFromDb,
  seedInitialDemoData,
  DEFAULT_SETTINGS,
} from './services/db';
import { useJourney } from './hooks/useJourney';
import { Header } from './components/common/Header';
import { Navigation, TabType } from './components/common/Navigation';
import { FloatingElements } from './components/home/FloatingElements';
import { GreetingHeader } from './components/home/GreetingHeader';
import { JourneyProgress } from './components/home/JourneyProgress';
import { TodayReasonCard } from './components/home/TodayReasonCard';
import { ReasonsJournal } from './components/reasons/ReasonsJournal';
import { MemoriesScrapbook } from './components/memories/MemoriesScrapbook';
import { VoiceNotesDiary } from './components/voice/VoiceNotesDiary';
import { Day365Surprise } from './components/surprise/Day365Surprise';
import { SettingsModal } from './components/settings/SettingsModal';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);

  // Hook calculating current day, progress, unlocked status
  const journeyStats = useJourney(settings);

  // Unread badge tracking for Journal tab
  const [lastSeenUnlocked, setLastSeenUnlocked] = useState<number>(() => {
    const saved = localStorage.getItem('journal_last_seen_unlocked');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  // Initial Load from IndexedDB
  useEffect(() => {
    async function init() {
      try {
        await seedInitialDemoData();
        const [loadedSettings, loadedReasons, loadedMemories, loadedVoiceNotes] =
          await Promise.all([
            getSettings(),
            getAllReasons(),
            getAllMemories(),
            getAllVoiceNotes(),
          ]);

        setSettings(loadedSettings);
        setReasons(loadedReasons);
        setMemories(loadedMemories);
        setVoiceNotes(loadedVoiceNotes);

        // Check if opened from notification with day parameter
        const urlParams = new URLSearchParams(window.location.search);
        const dayParam = urlParams.get('day');
        const tabParam = urlParams.get('tab') as TabType;

        if (dayParam) {
          setCurrentTab('home');
        } else if (tabParam) {
          setCurrentTab(tabParam);
        }
      } catch (e) {
        console.error('Initialization error:', e);
      } finally {
        setLoading(false);
      }
    }

    init();

    // Register Service Worker for PWA & Push
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });

      // Listen for message from service worker when notification is clicked
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NOTIFICATION_OPENED') {
          setCurrentTab('home');
        }
      });
    }

    // Capture PWA beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPwaPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Real-time notification trigger when unlock time arrives while in-app
  useEffect(() => {
    if (journeyStats.isTodayTimeReached && !journeyStats.isFutureJourney && journeyStats.currentDay > 0) {
      const todayKey = `notified-day-${journeyStats.currentDay}-${settings.notificationTime}-${journeyStats.todayFormatted}`;
      const alreadyNotified = sessionStorage.getItem(todayKey);
      if (!alreadyNotified) {
        sessionStorage.setItem(todayKey, 'true');
        // If notification permission is granted, pop up notification!
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            const activeReason = reasons.find((r) => r.day === journeyStats.currentDay);
            const reasonBody = activeReason?.text || "I love how you can make even my most ordinary days feel completely magical and special.";
            new Notification('A little reminder from someone who loves you ❤️', {
              body: reasonBody,
              icon: '/icons/icon-192.png',
            });
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }, [
    journeyStats.isTodayTimeReached,
    journeyStats.currentDay,
    settings.notificationTime,
    journeyStats.todayFormatted,
    journeyStats.isFutureJourney,
  ]);

  const handleInstallPWA = async () => {
    if (!pwaPrompt) {
      setIsSettingsOpen(true);
      return;
    }
    pwaPrompt.prompt();
    const { outcome } = await pwaPrompt.userChoice;
    if (outcome === 'accepted') {
      setPwaPrompt(null);
    }
  };

  // Reasons Handlers
  const handleRevealReason = async (day: number) => {
    await markReasonRevealed(day);
    setReasons((prev) =>
      prev.map((r) => (r.day === day ? { ...r, revealedAt: new Date().toISOString() } : r))
    );
  };

  const handleToggleFavorite = async (day: number) => {
    const isFav = await toggleFavoriteReason(day);
    setReasons((prev) =>
      prev.map((r) => (r.day === day ? { ...r, isFavorite: isFav } : r))
    );
  };

  const handleSaveReasonNote = async (day: number, note: string) => {
    const reason = reasons.find((r) => r.day === day);
    if (reason) {
      const updated = { ...reason, customNote: note };
      await updateReasonInDb(updated);
      setReasons((prev) => prev.map((r) => (r.day === day ? updated : r)));
    }
  };

  const handleUpdateReason = async (updated: Reason) => {
    await updateReasonInDb(updated);
    setReasons((prev) => prev.map((r) => (r.day === updated.day ? updated : r)));
  };

  const handleResetAllReasons = async () => {
    await resetAllReasons();
    const fresh = await getAllReasons();
    setReasons(fresh);
  };

  // Memories Handlers
  const handleSaveMemory = async (memory: Memory) => {
    await saveMemoryToDb(memory);
    setMemories((prev) => {
      const exists = prev.some((m) => m.id === memory.id);
      if (exists) {
        return prev.map((m) => (m.id === memory.id ? memory : m));
      }
      return [memory, ...prev];
    });
  };

  const handleDeleteMemory = async (id: string) => {
    await deleteMemoryFromDb(id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Voice Notes Handlers
  const handleSaveVoiceNote = async (note: VoiceNote) => {
    await saveVoiceNoteToDb(note);
    const refreshed = await getAllVoiceNotes();
    setVoiceNotes(refreshed);
  };

  const handleDeleteVoiceNote = async (id: string) => {
    await deleteVoiceNoteFromDb(id);
    setVoiceNotes((prev) => prev.filter((v) => v.id !== id));
  };

  // Settings Handlers
  const handleSaveSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = await saveSettingsToDb(newSettings);
    setSettings(updated);
  };

  // Backup & Restore
  const handleExportData = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      reasons,
      memories,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `365-reasons-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (jsonString: string) => {
    const parsed = JSON.parse(jsonString);
    if (parsed.settings) {
      await saveSettingsToDb(parsed.settings);
      setSettings(parsed.settings);
    }
    if (Array.isArray(parsed.reasons)) {
      for (const r of parsed.reasons) {
        await updateReasonInDb(r);
      }
      setReasons(parsed.reasons);
    }
    if (Array.isArray(parsed.memories)) {
      for (const m of parsed.memories) {
        await saveMemoryToDb(m);
      }
      setMemories(parsed.memories);
    }
  };

  const handleClearMemories = async () => {
    await clearAllMemories();
    setMemories([]);
  };

  const handleResetAllData = async () => {
    localStorage.removeItem('journal_last_seen_unlocked');
    setLastSeenUnlocked(0);
    await resetAllAppData();
    const [loadedSettings, loadedReasons, loadedMemories, loadedVoiceNotes] =
      await Promise.all([
        getSettings(),
        getAllReasons(),
        getAllMemories(),
        getAllVoiceNotes(),
      ]);
    setSettings(loadedSettings);
    setReasons(loadedReasons);
    setMemories(loadedMemories);
    setVoiceNotes(loadedVoiceNotes);
  };

  // Today's Reason
  const todayReason = reasons.find((r) => r.day === journeyStats.currentDay);
  const unlockedReasonsCount = reasons.filter((r) => journeyStats.isUnlocked(r.day)).length;

  const handleSelectTab = (tab: TabType) => {
    if (tab === 'reasons') {
      setLastSeenUnlocked(unlockedReasonsCount);
      localStorage.setItem('journal_last_seen_unlocked', String(unlockedReasonsCount));
    }
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (currentTab === 'reasons' && unlockedReasonsCount > 0) {
      setLastSeenUnlocked(unlockedReasonsCount);
      localStorage.setItem('journal_last_seen_unlocked', String(unlockedReasonsCount));
    }
  }, [currentTab, unlockedReasonsCount]);

  const journalBadgeCount =
    currentTab === 'reasons' ? 0 : Math.max(0, unlockedReasonsCount - lastSeenUnlocked);

  if (loading) {
    return (
      <div className="min-h-screen bg-romantic-cream flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-romantic-blush to-romantic-pastel flex items-center justify-center shadow-md animate-pulse">
          <Heart className="w-10 h-10 fill-romantic-rose text-romantic-rose animate-heartbeat" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-romantic-brown mt-4">
          365 Reasons to Love You
        </h2>
        <p className="font-cursive text-lg text-romantic-rose mt-1">
          Loading our year of love...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-romantic-softBg text-romantic-brown font-sans flex flex-col relative selection:bg-romantic-blush selection:text-romantic-brown">
      {/* Ambient background particles and soft gradients */}
      <FloatingElements />

      {/* Top Header */}
      <Header
        settings={settings}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        canInstallPWA={!!pwaPrompt}
        onInstallPWA={handleInstallPWA}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pt-3 pb-24 transition-all duration-300">
        {/* TAB 1: HOME (TODAY) */}
        {currentTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            <GreetingHeader stats={journeyStats} recipientName={settings.recipientName} />

            <TodayReasonCard
              reason={todayReason}
              isUnlocked={journeyStats.isUnlocked(journeyStats.currentDay)}
              onReveal={handleRevealReason}
              onToggleFavorite={handleToggleFavorite}
              onOpenNotes={() => handleSelectTab('reasons')}
              senderName={settings.senderName}
              recipientName={settings.recipientName}
              isFutureJourney={journeyStats.isFutureJourney}
              daysUntilStart={journeyStats.daysUntilStart}
              journeyStartDate={settings.journeyStartDate}
              isTodayTimeReached={journeyStats.isTodayTimeReached}
              msUntilTodayUnlock={journeyStats.msUntilTodayUnlock}
              notificationTime={journeyStats.notificationTime}
            />

            <JourneyProgress stats={journeyStats} />
          </div>
        )}

        {/* TAB 2: REASONS JOURNAL */}
        {currentTab === 'reasons' && (
          <div className="animate-fade-in">
            <ReasonsJournal
              reasons={reasons}
              isUnlocked={journeyStats.isUnlocked}
              currentDay={journeyStats.currentDay}
              journeyStartDate={settings.journeyStartDate}
              onToggleFavorite={handleToggleFavorite}
              onSaveNote={handleSaveReasonNote}
              senderName={settings.senderName}
              notificationTime={journeyStats.notificationTime}
            />
          </div>
        )}

        {/* TAB 3: MEMORIES SCRAPBOOK */}
        {currentTab === 'memories' && (
          <div className="animate-fade-in">
            <MemoriesScrapbook
              memories={memories}
              onSaveMemory={handleSaveMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          </div>
        )}

        {/* TAB 4: VOICE NOTES DIARY */}
        {currentTab === 'voice' && (
          <div className="animate-fade-in">
            <VoiceNotesDiary
              voiceNotes={voiceNotes}
              onSaveVoiceNote={handleSaveVoiceNote}
              onDeleteVoiceNote={handleDeleteVoiceNote}
              senderName={settings.senderName}
            />
          </div>
        )}

        {/* TAB 5: DAY 365 SURPRISE */}
        {currentTab === 'surprise' && (
          <div className="animate-fade-in">
            <Day365Surprise
              currentDay={journeyStats.currentDay}
              isUnlocked={journeyStats.isDay365 || settings.previewMode}
              settings={settings}
              onUpdateSettings={handleSaveSettings}
            />
          </div>
        )}
      </main>

      {/* Mobile-first bottom navigation bar */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isDay365={journeyStats.isDay365}
        journalBadgeCount={journalBadgeCount}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSaveSettings={handleSaveSettings}
          reasons={reasons}
          onUpdateReason={handleUpdateReason}
          onResetAllReasons={handleResetAllReasons}
          currentDay={journeyStats.currentDay}
          onClose={() => setIsSettingsOpen(false)}
          canInstallPWA={!!pwaPrompt}
          onInstallPWA={handleInstallPWA}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetAllData={handleResetAllData}
          onClearMemories={handleClearMemories}
        />
      )}
    </div>
  );
};

export default App;
