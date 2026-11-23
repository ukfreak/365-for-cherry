import React from 'react';

export const FloatingElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Gentle pastel gradients */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-romantic-pastel/40 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-romantic-lavender/40 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-romantic-blush/30 blur-3xl" />

      {/* Floating Delicate Heart 1 */}
      <svg
        className="absolute top-20 left-6 w-5 h-5 text-romantic-blush/40 animate-float"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDuration: '7s' }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* Floating Delicate Heart 2 */}
      <svg
        className="absolute top-44 right-8 w-6 h-6 text-romantic-rose/25 animate-float-slow"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDuration: '9s', animationDelay: '1.5s' }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* Floating Flower Petal 3 */}
      <svg
        className="absolute bottom-48 left-10 w-4 h-4 text-romantic-lavender/50 animate-float"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDuration: '8s', animationDelay: '3s' }}
      >
        <circle cx="12" cy="12" r="5" />
      </svg>

      {/* Floating Sparkle 4 */}
      <div
        className="absolute top-80 left-3/4 w-2 h-2 rounded-full bg-romantic-gold/40 animate-pulse"
        style={{ animationDuration: '4s' }}
      />
    </div>
  );
};
