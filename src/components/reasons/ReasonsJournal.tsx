import React, { useState, useMemo } from 'react';
import { Search, Heart, Lock } from 'lucide-react';
import { Reason } from '../../types';
import { ReasonModal } from './ReasonModal';

interface ReasonsJournalProps {
  reasons: Reason[];
  isUnlocked: (day: number) => boolean;
  currentDay: number;
  journeyStartDate: string;
  onToggleFavorite: (day: number) => void;
  onSaveNote: (day: number, note: string) => void;
  senderName: string;
  notificationTime?: string;
}

export const ReasonsJournal: React.FC<ReasonsJournalProps> = ({
  reasons,
  isUnlocked,
  currentDay,
  journeyStartDate,
  onToggleFavorite,
  onSaveNote,
  senderName,
  notificationTime = '09:00',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'favorites'>('all');
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);
  const [lockedNoticeDay, setLockedNoticeDay] = useState<number | null>(null);

  // Filter reasons
  const filteredReasons = useMemo(() => {
    return reasons.filter((r) => {
      // Favorites filter
      if (filterTab === 'favorites' && !r.isFavorite) {
        return false;
      }

      // Search query (only search text in unlocked reasons, or search day number)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDay = String(r.day).includes(query);
        const unlocked = isUnlocked(r.day);
        const matchesText = unlocked && r.text.toLowerCase().includes(query);
        const matchesNote = unlocked && r.customNote && r.customNote.toLowerCase().includes(query);
        return matchesDay || matchesText || matchesNote;
      }

      return true;
    });
  }, [reasons, filterTab, searchQuery, isUnlocked]);

  // Calculate unlock date for locked cards
  const getUnlockDateString = (day: number) => {
    const [y, m, d] = journeyStartDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + (day - 1));
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const handleCardClick = (reason: Reason) => {
    if (isUnlocked(reason.day)) {
      setSelectedReason(reason);
    } else {
      setLockedNoticeDay(reason.day);
    }
  };

  const unlockedCount = reasons.filter((r) => isUnlocked(r.day)).length;
  const favoritesCount = reasons.filter((r) => r.isFavorite).length;

  return (
    <div className="space-y-5 pb-8">
      {/* Title & Stats */}
      <div className="text-center pt-2">
        <h2 className="font-serif text-2xl font-bold text-romantic-brown tracking-tight">
          Reasons Journal
        </h2>
        <p className="text-xs text-romantic-brown/70 mt-1">
          {unlockedCount} of 365 reasons unlocked • {favoritesCount} favorited
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-romantic-brown/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search unlocked reasons or day number..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-white/90 border border-romantic-pastel/80 placeholder:text-romantic-brown/40 focus:outline-hidden focus:ring-2 focus:ring-romantic-rose/30 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-romantic-brown/50 hover:text-romantic-brown"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs: All & Favorites */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
            filterTab === 'all'
              ? 'bg-romantic-rose text-white shadow-romantic-rose/30'
              : 'bg-white/80 text-romantic-brown/75 border border-romantic-pastel/70 hover:bg-romantic-pastel/50'
          }`}
        >
          All Days ({reasons.length})
        </button>

        <button
          onClick={() => setFilterTab('favorites')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-all shadow-xs ${
            filterTab === 'favorites'
              ? 'bg-romantic-rose text-white shadow-romantic-rose/30'
              : 'bg-white/80 text-romantic-brown/75 border border-romantic-pastel/70 hover:bg-romantic-pastel/50'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${filterTab === 'favorites' ? 'fill-white' : 'fill-romantic-rose/20 text-romantic-rose'}`} />
          <span>Favorites ({favoritesCount})</span>
        </button>
      </div>

      {/* Reasons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredReasons.map((reason) => {
          const unlocked = isUnlocked(reason.day);

          return (
            <div
              key={reason.day}
              onClick={() => handleCardClick(reason)}
              className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
                unlocked
                  ? 'bg-white/90 hover:bg-white hover:shadow-romantic border-romantic-pastel/70 shadow-xs'
                  : 'bg-romantic-pastel/20 border-romantic-pastel/40 opacity-70 hover:opacity-90'
              }`}
            >
              {/* Card Header: Day & Favorite Icon */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      unlocked
                        ? 'bg-romantic-pastel/80 text-romantic-deepRose'
                        : 'bg-romantic-lavender/60 text-romantic-brown/70'
                    }`}
                  >
                    Day #{reason.day}
                  </span>
                </div>

                {unlocked ? (
                  reason.isFavorite && (
                    <Heart className="w-3.5 h-3.5 fill-romantic-rose text-romantic-rose" />
                  )
                ) : (
                  <Lock className="w-3.5 h-3.5 text-romantic-brown/50" />
                )}
              </div>

              {/* Card Body */}
              {unlocked ? (
                <div>
                  <p className="font-serif text-sm text-romantic-brown line-clamp-2 italic leading-relaxed">
                    "{reason.text}"
                  </p>
                  {reason.customNote && (
                    <span className="inline-block mt-2 text-[10px] text-romantic-deepRose bg-romantic-cream px-2 py-0.5 rounded-full font-medium">
                      Has personal note
                    </span>
                  )}
                </div>
              ) : (
                <div className="py-2 flex items-center space-x-2 text-romantic-brown/60">
                  <Lock className="w-4 h-4 text-romantic-rose/60" />
                  <span className="text-xs font-medium">
                    {reason.day === currentDay
                      ? `Unlocks today at ${notificationTime}`
                      : `Unlocks on ${getUnlockDateString(reason.day)}`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredReasons.length === 0 && (
        <div className="text-center py-12 bg-white/60 rounded-3xl border border-romantic-pastel p-6">
          <Heart className="w-8 h-8 text-romantic-rose/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-romantic-brown">No reasons found</p>
          <p className="text-xs text-romantic-brown/60 mt-1">Try clearing your search or filter</p>
        </div>
      )}

      {/* Selected Reason Modal */}
      {selectedReason && (
        <ReasonModal
          reason={selectedReason}
          onClose={() => setSelectedReason(null)}
          onToggleFavorite={(day) => {
            onToggleFavorite(day);
            setSelectedReason((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
          }}
          onSaveNote={(day, note) => {
            onSaveNote(day, note);
            setSelectedReason((prev) => (prev ? { ...prev, customNote: note } : null));
          }}
          senderName={senderName}
        />
      )}

      {/* Locked Notice Dialog */}
      {lockedNoticeDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-romantic-pastel animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-romantic-pastel/60 text-romantic-deepRose flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-7 h-7 text-romantic-rose" />
            </div>
            <h3 className="font-serif text-lg font-bold text-romantic-brown">
              Patience, my love ❤️
            </h3>
            <p className="text-xs text-romantic-brown/75 mt-2 leading-relaxed">
              {lockedNoticeDay === currentDay ? (
                <>
                  Today's reason will unlock at{' '}
                  <strong className="text-romantic-deepRose">{notificationTime}</strong>! A notification
                  will be sent the moment it opens.
                </>
              ) : (
                <>
                  Reason #{lockedNoticeDay} is waiting for its special day and will unlock on{' '}
                  <strong className="text-romantic-deepRose">
                    {getUnlockDateString(lockedNoticeDay)}
                  </strong>
                  .
                </>
              )}
            </p>
            <p className="text-[11px] text-romantic-brown/60 mt-1 italic">
              Good things come to those who wait!
            </p>
            <button
              onClick={() => setLockedNoticeDay(null)}
              className="mt-5 w-full py-2.5 rounded-full bg-romantic-rose text-white text-xs font-semibold hover:bg-romantic-deepRose transition-colors shadow-sm"
            >
              I will wait patiently ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
