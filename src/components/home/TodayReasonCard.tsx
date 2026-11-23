import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Share2, Check, Bookmark, Mail, Lock, Clock } from 'lucide-react';
import { Reason } from '../../types';

interface TodayReasonCardProps {
  reason: Reason | undefined;
  isUnlocked: boolean;
  onReveal: (day: number) => void;
  onToggleFavorite: (day: number) => void;
  onOpenNotes?: (reason: Reason) => void;
  senderName: string;
  recipientName?: string;
  isFutureJourney?: boolean;
  daysUntilStart?: number;
  journeyStartDate?: string;
  isTodayTimeReached?: boolean;
  msUntilTodayUnlock?: number;
  notificationTime?: string;
}

export const TodayReasonCard: React.FC<TodayReasonCardProps> = ({
  reason,
  isUnlocked,
  onReveal,
  onToggleFavorite,
  onOpenNotes,
  senderName,
  recipientName = 'Cherry',
  isFutureJourney = false,
  daysUntilStart = 0,
  journeyStartDate = '2026-11-29',
  isTodayTimeReached = true,
  msUntilTodayUnlock = 0,
  notificationTime = '09:00',
}) => {
  const [copied, setCopied] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  // Helper to format remaining milliseconds into HH:MM:SS
  const formatCountdown = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    }
    return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  // 1. If the journey start date has not arrived yet (e.g. before Nov 29)
  if (isFutureJourney) {
    const [y, m, d] = journeyStartDate.split('-').map(Number);
    const startDateObj = new Date(y, m - 1, d);
    const formattedStartDate = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
    }).format(startDateObj);

    return (
      <div className="relative group">
        <div className="relative bg-white/95 rounded-3xl p-8 sm:p-12 border border-romantic-blush/40 shadow-romantic overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_31px,#F8DDE6_32px)] bg-[size:100%_32px] opacity-40 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3 py-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-romantic-rose/80 mb-1">
              <Mail className="w-9 h-9 stroke-[1.5]" />
            </div>

            <h3 className="font-cursive text-2xl sm:text-3xl text-romantic-rose tracking-wide">
              Something is waiting for you
            </h3>

            <div className="font-serif text-5xl sm:text-6xl font-bold text-romantic-brown my-1">
              {daysUntilStart}
            </div>

            <p className="font-serif italic text-base sm:text-lg text-romantic-brown/85">
              {daysUntilStart === 1 ? 'more sleep' : 'more sleeps'} until Day 1
            </p>

            <p className="text-xs sm:text-sm text-romantic-brown/70 pt-2 font-sans">
              The very first reason opens on {formattedStartDate}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. If it is today, but the clock has NOT reached preferred notification time (e.g. before 21:17)
  if (!isTodayTimeReached) {
    return (
      <div className="relative group">
        <div className="relative bg-white/95 rounded-3xl p-8 sm:p-10 border-2 border-romantic-blush/60 shadow-romantic overflow-hidden text-center">
          {/* Subtle stationary background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_31px,#F8DDE6_32px)] bg-[size:100%_32px] opacity-35 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-3 py-4">
            {/* Glowing Lock Ring */}
            <div className="relative mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-romantic-blush to-romantic-pastel flex items-center justify-center shadow-md border-2 border-white animate-pulse-subtle">
                <Lock className="w-8 h-8 text-romantic-rose stroke-[2]" />
              </div>
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-romantic-gold/90 text-white flex items-center justify-center shadow-xs">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="font-cursive text-2xl sm:text-3xl text-romantic-rose">
              A little patience, {recipientName} ❤️
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-romantic-brown">
              Today's Reason Unlocks at {notificationTime}
            </h3>

            {/* Live Ticking Countdown */}
            <div className="my-2 px-5 py-2 rounded-2xl bg-romantic-cream/80 border border-romantic-blush/50 inline-flex items-center space-x-2 shadow-inner">
              <Clock className="w-4 h-4 text-romantic-rose animate-spin" />
              <span className="font-mono text-base sm:text-lg font-bold text-romantic-deepRose tracking-wider">
                {formatCountdown(msUntilTodayUnlock)}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-romantic-brown/70 max-w-xs leading-relaxed pt-1">
              Your daily reason is locked until your chosen time of{' '}
              <strong className="text-romantic-rose">{notificationTime}</strong>.
              A notification will remind you the exact second it opens!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Today's reason is ready or revealed!
  if (!reason) {
    return (
      <div className="bg-white/80 rounded-3xl p-8 text-center border border-romantic-pastel shadow-romantic">
        <p className="text-romantic-brown/70 font-serif">Today's reason is loading...</p>
      </div>
    );
  }

  const isRevealed = !!reason.revealedAt;

  const handleRevealClick = () => {
    setIsRevealing(true);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F8DDE6', '#F3C6D5', '#C77D98', '#E9E2F5', '#E5B869'],
        shapes: ['circle'],
        scalar: 1.2,
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      onReveal(reason.day);
      setIsRevealing(false);
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Day ${reason.day}: "${reason.text}" — With all my love, ${senderName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {/* Delicate outer romantic glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-romantic-blush via-romantic-pastel to-romantic-lavender rounded-[32px] blur-sm opacity-60 group-hover:opacity-100 transition duration-500" />

      <div className="relative bg-white rounded-3xl p-6 sm:p-7 border border-romantic-blush/40 shadow-romantic overflow-hidden">
        {/* Header: Day Badge */}
        <div className="flex items-center justify-between border-b border-romantic-pastel/60 pb-3 mb-5">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-romantic-pastel/70 text-romantic-deepRose border border-romantic-blush/40">
              Reason #{reason.day}
            </span>
          </div>

          {/* Quick Actions (if revealed) */}
          {isRevealed && (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onToggleFavorite(reason.day)}
                title={reason.isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-romantic-softBg hover:bg-romantic-pastel/60 text-romantic-brown"
              >
                <Heart
                  className={`w-4 h-4 transition-transform duration-200 ${
                    reason.isFavorite
                      ? 'fill-romantic-rose text-romantic-rose scale-110'
                      : 'text-romantic-brown/60 hover:text-romantic-rose'
                  }`}
                />
              </button>

              <button
                onClick={handleCopy}
                title="Copy reason"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-romantic-softBg hover:bg-romantic-pastel/60 text-romantic-brown/70 hover:text-romantic-brown"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content Body: Hidden or Revealed */}
        {!isRevealed ? (
          /* Sealed State: Mystery Love Letter */
          <div className="py-8 sm:py-10 text-center flex flex-col items-center justify-center">
            {/* Animated Envelope Icon with Heart Seal */}
            <div className="relative mb-6 cursor-pointer" onClick={handleRevealClick}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-romantic-blush to-romantic-pastel flex items-center justify-center shadow-md border-2 border-white animate-pulse-subtle">
                <Heart className="w-10 h-10 fill-romantic-rose text-romantic-rose animate-heartbeat" />
              </div>
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-romantic-gold/90 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

            <h4 className="font-serif text-xl font-bold text-romantic-brown mb-2">
              Today's Reason is Waiting For You
            </h4>
            <p className="text-xs sm:text-sm text-romantic-brown/70 max-w-xs mb-6">
              A private thought straight from my heart to yours. Tap below to break the seal.
            </p>

            <button
              onClick={handleRevealClick}
              disabled={isRevealing}
              className="relative inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-romantic-rose to-romantic-deepRose hover:from-romantic-deepRose hover:to-romantic-rose shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 overflow-hidden group/btn"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-spin text-romantic-pastel" />
                <span>Reveal Today's Reason ✨</span>
              </span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        ) : (
          /* Revealed State: Romantic Typography Card */
          <div className="py-4">
            <div className="font-serif text-4xl text-romantic-blush leading-none select-none">
              “
            </div>

            <p className="font-serif text-lg sm:text-xl text-romantic-brown font-medium leading-relaxed italic px-2 my-2">
              {reason.text}
            </p>

            <div className="font-serif text-4xl text-romantic-blush leading-none text-right select-none">
              ”
            </div>

            {reason.customNote && (
              <div className="mt-4 p-3 bg-romantic-cream/80 rounded-2xl border border-romantic-blush/40 text-xs text-romantic-brown/85 italic">
                <span className="font-semibold not-italic text-romantic-rose block mb-0.5">
                  Her note to you:
                </span>
                {reason.customNote}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-romantic-pastel/50 text-xs text-romantic-brown/65">
              <span className="font-cursive text-base text-romantic-rose font-bold">
                Forever yours, {senderName}
              </span>

              {onOpenNotes && (
                <button
                  onClick={() => onOpenNotes(reason)}
                  className="inline-flex items-center space-x-1 text-romantic-rose hover:text-romantic-deepRose font-medium"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{reason.customNote ? 'Edit Note' : 'Add Note'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
