import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Calendar,
  Heart,
  Shield,
  Download,
  Upload,
  Sparkles,
  Smartphone,
  Eye,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AppSettings, Reason } from '../../types';
import {
  checkNotificationSupport,
  NotificationStatus,
  requestPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  sendTestNotification,
} from '../../services/notifications';
import { ReasonEditorModal } from './ReasonEditorModal';

interface SettingsModalProps {
  settings: AppSettings;
  onSaveSettings: (settings: Partial<AppSettings>) => void;
  reasons: Reason[];
  onUpdateReason: (reason: Reason) => void;
  onResetAllReasons: () => void;
  currentDay: number;
  onClose: () => void;
  canInstallPWA: boolean;
  onInstallPWA: () => void;
  onExportData: () => void;
  onImportData: (json: string) => void;
  onResetAllData?: () => void;
  onClearMemories?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings,
  reasons,
  onUpdateReason,
  onResetAllReasons,
  currentDay,
  onClose,
  canInstallPWA,
  onInstallPWA,
  onExportData,
  onImportData,
  onResetAllData,
  onClearMemories,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'pwa' | 'privacy'>('general');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Form State
  const [recipientName, setRecipientName] = useState(settings.recipientName);
  const [senderName, setSenderName] = useState(settings.senderName);
  const [journeyStartDate, setJourneyStartDate] = useState(settings.journeyStartDate);
  const [notificationTime, setNotificationTime] = useState(settings.notificationTime);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [previewMode, setPreviewMode] = useState(settings.previewMode);
  const [previewDayOverride, setPreviewDayOverride] = useState<number>(
    settings.previewDayOverride || currentDay
  );

  // Notification status
  const [notifStatus, setNotifStatus] = useState<NotificationStatus | null>(null);
  const [isTestingNotif, setIsTestingNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifError, setNotifError] = useState('');

  useEffect(() => {
    checkNotificationSupport().then(setNotifStatus);
  }, []);

  const handleToggleNotifications = async (enabled: boolean) => {
    setNotifError('');
    setNotifMessage('');

    if (enabled) {
      try {
        const perm = await requestPermission();
        if (perm === 'granted') {
          setNotificationsEnabled(true);
          onSaveSettings({ notificationsEnabled: true });

          // Attempt subscription
          await subscribeToPushNotifications({
            ...settings,
            notificationTime,
            notificationsEnabled: true,
          });

          setNotifMessage('Daily notifications activated successfully! ❤️');
          checkNotificationSupport().then(setNotifStatus);
        } else {
          setNotificationsEnabled(false);
          setNotifError('Notification permission was denied. Please allow it in browser settings.');
        }
      } catch (err: any) {
        setNotifError(err.message || 'Failed to activate notifications.');
        setNotificationsEnabled(false);
      }
    } else {
      setNotificationsEnabled(false);
      onSaveSettings({ notificationsEnabled: false });
      await unsubscribeFromPushNotifications(settings.serverUrl);
      setNotifMessage('Notifications disabled.');
      checkNotificationSupport().then(setNotifStatus);
    }
  };

  const handleSendTestNotification = async () => {
    setIsTestingNotif(true);
    setNotifError('');
    setNotifMessage('');

    try {
      const activeReason = reasons.find((r) => r.day === Math.max(1, currentDay));
      await sendTestNotification(settings, Math.max(1, currentDay), activeReason?.text);
      setNotifMessage('Test reminder delivered! Look for the heart notification ✨');
    } catch (err: any) {
      setNotifError(err.message || 'Failed to send test notification.');
    } finally {
      setIsTestingNotif(false);
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      recipientName: recipientName.trim() || 'Cherry',
      senderName: senderName.trim() || 'Yash',
      journeyStartDate,
      notificationTime,
      previewMode,
      previewDayOverride: previewMode ? Number(previewDayOverride) : null,
    };
    onSaveSettings(updatedSettings);

    if (notificationsEnabled) {
      subscribeToPushNotifications({
        ...settings,
        ...updatedSettings,
      }).catch(() => {});
    }

    setNotifMessage('Settings saved successfully!');
    setTimeout(() => setNotifMessage(''), 2500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            onImportData(event.target.result as string);
            setNotifMessage('Backup data restored successfully!');
          } catch (err) {
            setNotifError('Failed to parse backup file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-romantic-pastel flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-romantic-pastel/60 shrink-0">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-romantic-rose fill-romantic-rose animate-heartbeat" />
            <h3 className="font-serif text-xl font-bold text-romantic-brown">
              Gift Settings & Journal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-romantic-softBg hover:bg-romantic-pastel/60 text-romantic-brown flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 pt-3 pb-2 border-b border-romantic-pastel/40 shrink-0 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              activeTab === 'general'
                ? 'bg-romantic-rose text-white shadow-xs'
                : 'text-romantic-brown hover:bg-romantic-pastel/50'
            }`}
          >
            General & Journey
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-romantic-rose text-white shadow-xs'
                : 'text-romantic-brown hover:bg-romantic-pastel/50'
            }`}
          >
            Daily Notifications
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'bg-romantic-rose text-white shadow-xs'
                : 'text-romantic-brown hover:bg-romantic-pastel/50'
            }`}
          >
            PWA Install Guide
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-romantic-rose text-white shadow-xs'
                : 'text-romantic-brown hover:bg-romantic-pastel/50'
            }`}
          >
            Privacy & Backup
          </button>
        </div>

        {/* Feedback Messages */}
        {notifMessage && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center space-x-1.5 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notifMessage}</span>
          </div>
        )}
        {notifError && (
          <div className="mt-2 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center space-x-1.5 shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{notifError}</span>
          </div>
        )}

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
          {/* TAB 1: GENERAL & JOURNEY */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-romantic-brown mb-1">
                    His Name (Recipient)
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-romantic-brown mb-1">
                    Your Name (Sender)
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
                  />
                </div>
              </div>

              {/* Journey Start Date */}
              <div>
                <label className="block text-xs font-semibold text-romantic-brown mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-romantic-rose" />
                  <span>Journey Start Date (Day 1)</span>
                </label>
                <input
                  type="date"
                  value={journeyStartDate}
                  onChange={(e) => setJourneyStartDate(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
                />
                <p className="text-[10px] text-romantic-brown/60 mt-1">
                  Days are calculated from this date. Change to test different progress states!
                </p>
              </div>

              {/* Girlfriend Preparation / Preview Mode Toggle */}
              <div className="p-4 bg-romantic-pastel/30 rounded-2xl border border-romantic-blush/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-romantic-deepRose" />
                    <div>
                      <h4 className="text-xs font-bold text-romantic-brown">
                        Preview / God Mode (For Girlfriend)
                      </h4>
                      <p className="text-[10px] text-romantic-brown/60">
                        Unlock all days to review content & test Day 365
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={previewMode}
                    onChange={(e) => setPreviewMode(e.target.checked)}
                    className="w-4 h-4 accent-romantic-rose rounded"
                  />
                </div>

                {previewMode && (
                  <div className="pt-2 border-t border-romantic-blush/30 flex items-center justify-between">
                    <span className="text-xs text-romantic-brown font-medium">
                      Simulate Day (1-365):
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={previewDayOverride}
                      onChange={(e) => setPreviewDayOverride(Number(e.target.value))}
                      className="w-20 px-2 py-1 text-xs rounded-xl border border-romantic-pastel text-center font-bold"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-romantic-rose text-white text-xs font-semibold hover:bg-romantic-deepRose shadow-sm"
                >
                  Save Settings ✨
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: DAILY NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="p-4 bg-romantic-cream/80 rounded-2xl border border-romantic-pastel space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-romantic-rose" />
                    <span className="text-xs font-bold text-romantic-brown">
                      Enable Daily Love Reminder
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => handleToggleNotifications(e.target.checked)}
                    className="w-4 h-4 accent-romantic-rose rounded"
                  />
                </div>

                {/* Time Picker */}
                <div>
                  <label className="block text-xs font-semibold text-romantic-brown mb-1">
                    Preferred Daily Reminder Time
                  </label>
                  <input
                    type="time"
                    value={notificationTime}
                    onChange={(e) => {
                      const newTime = e.target.value;
                      setNotificationTime(newTime);
                      onSaveSettings({ notificationTime: newTime });
                      if (notificationsEnabled) {
                        subscribeToPushNotifications({
                          ...settings,
                          notificationTime: newTime,
                        }).catch(() => {});
                      }
                    }}
                    className="w-full text-xs px-3 py-2 rounded-2xl border border-romantic-pastel bg-white"
                  />
                  <p className="text-[10px] text-romantic-brown/60 mt-1">
                    At this time every day, he'll receive: "A little reminder from someone who loves you ❤️"
                  </p>
                </div>
              </div>

              {/* Status and Diagnostics */}
              <div className="p-3.5 bg-romantic-softBg rounded-2xl border border-romantic-pastel space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-romantic-brown/70">Browser Permission:</span>
                  <span
                    className={`font-semibold capitalize px-2 py-0.5 rounded-full text-[10px] ${
                      notifStatus?.permission === 'granted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : notifStatus?.permission === 'denied'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {notifStatus?.permission || 'Default'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-romantic-brown/70">Web Push Support:</span>
                  <span className="font-semibold text-romantic-brown">
                    {notifStatus?.supported ? 'Supported' : 'Not supported in this browser'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-romantic-brown/70">Device Mode:</span>
                  <span className="font-semibold text-romantic-brown">
                    {notifStatus?.isStandalone ? 'Installed PWA (Full Push)' : 'Browser Tab'}
                  </span>
                </div>

                {notifStatus?.instructions && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl mt-1 border border-amber-200">
                    {notifStatus.instructions}
                  </p>
                )}
              </div>

              {/* Test Notification Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  disabled={isTestingNotif}
                  className="w-full py-2.5 rounded-full bg-romantic-pastel hover:bg-romantic-blush text-romantic-deepRose text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isTestingNotif ? 'Sending reminder...' : 'Send Test Reminder Now ❤️'}
                  </span>
                </button>
                <p className="text-[10px] text-romantic-brown/60 text-center mt-1">
                  Triggers an immediate preview notification to verify permissions on your device.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PWA INSTALLATION GUIDE */}
          {activeTab === 'pwa' && (
            <div className="space-y-4 text-xs text-romantic-brown/85">
              <div className="p-4 bg-romantic-cream/80 rounded-2xl border border-romantic-pastel space-y-2">
                <div className="flex items-center space-x-2 text-romantic-rose">
                  <Smartphone className="w-4 h-4" />
                  <h4 className="font-serif text-sm font-bold text-romantic-brown">
                    Install as a Private App
                  </h4>
                </div>
                <p className="leading-relaxed">
                  Installing <strong>365 Reasons</strong> on his phone gives him an app icon on his home screen, full-screen offline access, and reliable daily notifications without needing to open a browser.
                </p>

                {canInstallPWA && (
                  <button
                    onClick={onInstallPWA}
                    className="w-full mt-2 py-2.5 rounded-full bg-romantic-rose text-white font-semibold hover:bg-romantic-deepRose shadow-sm flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install to Phone Now</span>
                  </button>
                )}
              </div>

              {/* iOS Instructions */}
              <div className="p-3.5 rounded-2xl bg-white border border-romantic-pastel space-y-2">
                <h5 className="font-semibold text-romantic-brown flex items-center gap-1.5">
                  <span>Apple iPhone / iPad Instructions (Safari):</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-romantic-brown/80 pl-1 leading-relaxed">
                  <li>Open this page in <strong>Safari</strong>.</li>
                  <li>Tap the <strong>Share</strong> button (square with arrow pointing up).</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top right corner.</li>
                  <li>Open the app from the home screen icon and allow notifications!</li>
                </ol>
              </div>

              {/* Android Instructions */}
              <div className="p-3.5 rounded-2xl bg-white border border-romantic-pastel space-y-2">
                <h5 className="font-semibold text-romantic-brown">
                  Android Instructions (Chrome):
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-romantic-brown/80 pl-1 leading-relaxed">
                  <li>Tap the <strong>three dots</strong> in Chrome's top right corner.</li>
                  <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                  <li>Confirm installation. The app will appear alongside native apps.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY & BACKUP */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs text-romantic-brown/85">
              <div className="p-4 bg-romantic-cream/80 rounded-2xl border border-romantic-pastel space-y-2">
                <div className="flex items-center space-x-2 text-romantic-rose">
                  <Shield className="w-4 h-4" />
                  <h4 className="font-serif text-sm font-bold text-romantic-brown">
                    100% Private Love Journal
                  </h4>
                </div>
                <p className="leading-relaxed">
                  Your photos, voice recordings, and customized reasons are stored safely inside your device's browser <strong>IndexedDB</strong>. They are never shared publicly or indexed on search engines.
                </p>
              </div>

              {/* Export & Import */}
              <div className="p-4 bg-white rounded-2xl border border-romantic-pastel space-y-3">
                <h5 className="font-semibold text-romantic-brown">
                  Backup & Transfer Your Gift
                </h5>
                <p className="text-[11px] text-romantic-brown/70 leading-relaxed">
                  You can download a full backup file containing all customized reasons, memories, and settings. You can import this file onto his phone before gifting it!
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={onExportData}
                    className="py-2 px-3 rounded-full bg-romantic-softBg hover:bg-romantic-pastel/60 text-romantic-brown font-medium border border-romantic-pastel flex items-center justify-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5 text-romantic-rose" />
                    <span>Export Backup</span>
                  </button>

                  <label className="py-2 px-3 rounded-full bg-romantic-softBg hover:bg-romantic-pastel/60 text-romantic-brown font-medium border border-romantic-pastel flex items-center justify-center space-x-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-romantic-rose" />
                    <span>Import Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset Section */}
              <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200/80 space-y-2.5">
                <h5 className="font-semibold text-rose-800 flex items-center gap-1.5">
                  <span>Reset & Testing Tools</span>
                </h5>
                <p className="text-[11px] text-rose-900/70 leading-relaxed">
                  Reset memories, test notifications from scratch, or clear sample photos.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {onClearMemories && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Clear all photos and stories from Our Little Memories?')) {
                          onClearMemories();
                          setNotifMessage('All memories cleared!');
                        }
                      }}
                      className="py-2 px-3 rounded-full bg-white hover:bg-rose-50 text-rose-700 font-medium border border-rose-200 text-xs shadow-xs"
                    >
                      Clear Memories
                    </button>
                  )}

                  {onResetAllData && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Reset all app data to clean state for Cherry & Yash (Nov 29th)?')) {
                          onResetAllData();
                          setNotifMessage('App reset to clean state!');
                        }
                      }}
                      className="py-2 px-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-xs"
                    >
                      Reset All App Data
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reason Editor Modal */}
        {isEditorOpen && (
          <ReasonEditorModal
            reasons={reasons}
            onUpdateReason={onUpdateReason}
            onResetAllReasons={onResetAllReasons}
            onClose={() => setIsEditorOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
