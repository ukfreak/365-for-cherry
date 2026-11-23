import React from 'react';
import { JourneyStats } from '../../hooks/useJourney';

interface JourneyProgressProps {
  stats: JourneyStats;
}

export const JourneyProgress: React.FC<JourneyProgressProps> = ({ stats }) => {
  return (
    <div className="bg-white/95 rounded-3xl p-6 sm:p-7 border border-romantic-blush/40 shadow-romantic transition-all">
      {/* Top Header matching reference image: OUR JOURNEY on left, Day 000 of 365 on right */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-romantic-brown/80">
          Our Journey
        </span>
        <span className="font-serif italic text-sm text-romantic-brown/80">
          {stats.formattedDay}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-romantic-softBg rounded-full overflow-hidden p-0.5 border border-romantic-blush/30 my-4">
        <div
          className="h-full bg-gradient-to-r from-romantic-blush to-romantic-rose rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${stats.isFutureJourney ? 0 : Math.max(2, stats.progressPercent)}%` }}
        />
      </div>

      {/* 3 Metric Columns: DAYS COMPLETED, DAYS REMAINING, OF THE JOURNEY */}
      <div className="grid grid-cols-3 gap-2 text-center pt-2 mt-2">
        <div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-romantic-rose">
            {stats.daysCompleted}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-romantic-brown/70 mt-1">
            Days Completed
          </div>
        </div>

        <div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-romantic-rose">
            {stats.daysRemaining}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-romantic-brown/70 mt-1">
            Days Remaining
          </div>
        </div>

        <div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-romantic-rose">
            {stats.progressPercent}%
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-romantic-brown/70 mt-1">
            Of The Journey
          </div>
        </div>
      </div>
    </div>
  );
};
