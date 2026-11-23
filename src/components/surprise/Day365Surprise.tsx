import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Lock, Gift, Camera, Edit3, Check, Stars } from 'lucide-react';
import { AppSettings } from '../../types';

interface Day365SurpriseProps {
  currentDay: number;
  isUnlocked: boolean; // true if currentDay >= 365 or previewMode is on
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const Day365Surprise: React.FC<Day365SurpriseProps> = ({
  currentDay,
  isUnlocked,
  settings,
  onUpdateSettings,
}) => {
  const [isLetterOpened, setIsLetterOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableMessage, setEditableMessage] = useState(settings.finalMessage);
  const [finalPhotoUrl, setFinalPhotoUrl] = useState(settings.finalPhotoDataUrl);

  const daysRemaining = Math.max(0, 365 - currentDay);

  // Trigger romantic celebration confetti
  const triggerConfetti = () => {
    try {
      const duration = 3.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#F8DDE6', '#F3C6D5', '#C77D98', '#E5B869', '#E9E2F5'],
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#F8DDE6', '#F3C6D5', '#C77D98', '#E5B869', '#E9E2F5'],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (e) {
      // ignore
    }
  };

  const handleOpenEnvelope = () => {
    setIsLetterOpened(true);
    triggerConfetti();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setFinalPhotoUrl(url);
          onUpdateSettings({ finalPhotoDataUrl: url });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMessage = () => {
    onUpdateSettings({ finalMessage: editableMessage });
    setIsEditing(false);
  };

  // Locked View (before Day 365)
  if (!isUnlocked) {
    return (
      <div className="py-10 px-4 text-center pb-20">
        <div className="max-w-sm mx-auto bg-white/90 rounded-3xl p-8 border border-romantic-pastel shadow-romantic relative overflow-hidden">
          {/* Subtle glowing lock icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-romantic-blush to-romantic-pastel text-romantic-rose flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-white">
            <Lock className="w-10 h-10 text-romantic-rose" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-romantic-rose bg-romantic-pastel/60 px-3 py-1 rounded-full">
            Day 365 Finale
          </span>

          <h2 className="font-serif text-2xl font-bold text-romantic-brown mt-3 mb-2">
            A Grand Surprise Awaits
          </h2>

          <p className="text-xs sm:text-sm text-romantic-brown/75 leading-relaxed mb-6">
            This special surprise is locked until Day 365. It holds our final anniversary letter, a celebration of all 365 days of love, and a personal gift prepared just for you.
          </p>

          {/* Countdown card */}
          <div className="bg-romantic-cream/80 rounded-2xl p-4 border border-romantic-blush/40 mb-6">
            <div className="font-serif text-3xl font-bold text-romantic-rose">
              {daysRemaining}
            </div>
            <div className="text-xs font-medium text-romantic-brown/70 mt-0.5">
              {daysRemaining === 1 ? 'day remaining' : 'days remaining until unlock'}
            </div>
          </div>

          <p className="text-[11px] text-romantic-brown/60 italic">
            "Every day brings us one step closer to our forever."
          </p>
        </div>
      </div>
    );
  }

  // Unlocked State: Envelope Not Yet Opened
  if (!isLetterOpened) {
    return (
      <div className="py-12 px-4 text-center pb-20">
        <div className="max-w-md mx-auto bg-gradient-to-b from-white via-romantic-cream/90 to-romantic-pastel/30 rounded-3xl p-8 border-2 border-romantic-rose/40 shadow-romantic-lg relative overflow-hidden animate-fade-in">
          <div className="inline-flex items-center space-x-1 text-romantic-gold text-xs font-bold uppercase tracking-widest mb-3">
            <Stars className="w-4 h-4" />
            <span>Day 365 Celebration</span>
            <Stars className="w-4 h-4" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-romantic-brown tracking-tight mb-2">
            You Made It to Day 365
          </h2>
          <p className="text-xs sm:text-sm text-romantic-brown/75 max-w-xs mx-auto mb-8 leading-relaxed">
            365 days of love, laughter, memories, and reasons. Your final anniversary letter is ready.
          </p>

          {/* Golden Sealed Envelope */}
          <div
            onClick={handleOpenEnvelope}
            className="cursor-pointer group relative w-48 h-36 mx-auto bg-gradient-to-tr from-romantic-blush to-romantic-cream rounded-2xl border-2 border-romantic-rose/50 shadow-polaroid hover:shadow-glow transition-all duration-300 transform hover:scale-105 flex items-center justify-center mb-8"
          >
            {/* Envelope Flap lines */}
            <div className="absolute inset-0 bg-romantic-rose/10 clip-envelope pointer-events-none" />

            {/* Glowing Wax Seal */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-romantic-rose to-romantic-deepRose text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 fill-white animate-heartbeat" />
            </div>

            <span className="absolute -bottom-3 px-3 py-1 bg-white text-[10px] font-bold text-romantic-deepRose rounded-full shadow-sm border border-romantic-rose/30">
              Break the Seal ✨
            </span>
          </div>

          <button
            onClick={handleOpenEnvelope}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-romantic-rose to-romantic-deepRose text-white text-sm font-semibold hover:from-romantic-deepRose hover:to-romantic-rose shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 inline-flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Final Anniversary Letter ✨</span>
          </button>
        </div>
      </div>
    );
  }

  // Unlocked State: Letter Revealed!
  return (
    <div className="py-6 px-3 sm:px-4 pb-20 space-y-6 animate-fade-in">
      {/* Celebration Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-romantic-gold/20 text-romantic-brown text-xs font-bold border border-romantic-gold/40 shadow-xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-romantic-gold animate-spin" />
          <span>Day 365 of 365 • Our Forever Begins</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-romantic-brown tracking-tight">
          To {settings.recipientName}, With All My Heart
        </h2>
      </div>

      {/* Romantic Parchment Letter Card */}
      <div className="relative max-w-lg mx-auto bg-gradient-to-b from-[#FFFDF9] to-[#FFF6F0] rounded-3xl p-6 sm:p-9 shadow-2xl border-2 border-romantic-blush/60 overflow-hidden">
        {/* Floating Delicate Heart Corner Decorations */}
        <div className="absolute top-3 left-3 w-8 h-8 text-romantic-rose/25">
          <Heart className="w-full h-full fill-current" />
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 text-romantic-rose/25">
          <Heart className="w-full h-full fill-current" />
        </div>

        {/* Anniversary Celebration Photo */}
        <div className="relative mb-6">
          {finalPhotoUrl ? (
            <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-polaroid group">
              <img
                src={finalPhotoUrl}
                alt="Our Anniversary Photo"
                className="w-full h-64 object-cover"
              />
              <label className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <label className="border-2 border-dashed border-romantic-rose/40 hover:border-romantic-rose rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-romantic-pastel/20 hover:bg-romantic-pastel/30 transition-colors">
              <Camera className="w-8 h-8 text-romantic-rose mb-1.5" />
              <span className="text-xs font-semibold text-romantic-brown">
                Upload Our Special Couple's Photo
              </span>
              <span className="text-[10px] text-romantic-brown/60">
                A photo of the two of us to commemorate Day 365
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* The Exact Final Message (User Prompt Requirement) */}
        <div className="my-6 p-5 sm:p-6 bg-romantic-cream/90 rounded-2xl border border-romantic-blush/50 shadow-inner">
          <div className="font-serif text-3xl text-romantic-rose leading-none select-none">“</div>
          <p className="font-serif text-lg sm:text-xl text-romantic-brown font-medium leading-relaxed italic text-center px-1 my-2">
            365 days. 365 reasons. And somehow, I still haven't run out of reasons to love you. This was never just about counting days. It was about reminding you, every single day, how special you are to me. And if I had another 365 days, I'd choose you all over again.
          </p>
          <div className="font-serif text-3xl text-romantic-rose leading-none text-right select-none">”</div>
        </div>

        {/* Longer Personal Message */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-serif text-base font-bold text-romantic-brown">
              My Personal Letter To You:
            </h4>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-romantic-rose hover:text-romantic-deepRose font-medium flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Personalize Letter</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editableMessage}
                onChange={(e) => setEditableMessage(e.target.value)}
                rows={6}
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-white"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 text-xs rounded-full text-romantic-brown hover:bg-romantic-pastel/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMessage}
                  className="px-4 py-1.5 text-xs rounded-full bg-romantic-rose text-white font-medium hover:bg-romantic-deepRose flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Letter</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="font-sans text-xs sm:text-sm text-romantic-brown/85 leading-relaxed whitespace-pre-line bg-white/70 p-4 rounded-2xl border border-romantic-pastel/60">
              {settings.finalMessage}
            </p>
          )}
        </div>

        {/* Romantic Hand-written Signature */}
        <div className="text-right pt-6 mt-6 border-t border-romantic-pastel/60">
          <p className="text-xs text-romantic-brown/60">With endless love,</p>
          <p className="font-cursive text-2xl sm:text-3xl font-bold text-romantic-rose mt-1">
            Forever Yours, {settings.senderName}
          </p>
        </div>
      </div>

      {/* Action Buttons: Replay Confetti */}
      <div className="flex items-center justify-center space-x-3 pt-2">
        <button
          onClick={triggerConfetti}
          className="px-6 py-2.5 rounded-full bg-romantic-pastel hover:bg-romantic-blush text-romantic-deepRose text-xs font-semibold shadow-sm transition-transform active:scale-95 inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-romantic-rose" />
          <span>Shower Confetti & Hearts 🎉</span>
        </button>
      </div>
    </div>
  );
};
