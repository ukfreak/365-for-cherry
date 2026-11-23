import React from 'react';
import { Calendar } from 'lucide-react';
import { JourneyStats } from '../../hooks/useJourney';
import { FloralWreath } from '../common/FloralWreath';

interface GreetingHeaderProps {
  stats: JourneyStats;
  recipientName: string;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({ stats, recipientName }) => {
  return (
    <div className="pt-2 pb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Text Column */}
        <div className="flex-1 text-center md:text-left space-y-3">
          {/* Cursive Greeting */}
          <div className="font-cursive text-2xl sm:text-3xl md:text-4xl text-romantic-rose tracking-wide">
            {stats.greeting}
          </div>

          {/* Main Title */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-romantic-brown tracking-tight leading-tight">
            365 Reasons{' '}
            <span className="italic font-serif font-normal text-romantic-rose/90">
              to Love
            </span>{' '}
            You
          </h2>

          {/* Subtitle */}
          <p className="text-romantic-brown/75 text-sm sm:text-base font-sans leading-relaxed max-w-md">
            A little reminder that you're loved, every single day.
          </p>

          {/* Date Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-romantic-pastel/30 text-romantic-brown/85 text-xs font-medium border border-romantic-blush/40 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-romantic-rose" />
            <span>{stats.startDateFormatted}</span>
          </div>
        </div>

        {/* Right Illustration Column */}
        <div className="shrink-0 flex items-center justify-center">
          <FloralWreath className="w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64" />
        </div>
      </div>
    </div>
  );
};
