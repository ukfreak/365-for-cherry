import React from 'react';

export const FloralWreath: React.FC<{ className?: string }> = ({ className = 'w-64 h-64' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Soft Watercolor Heart Gradient */}
          <radialGradient id="heartWatercolor" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#FFF0F5" />
            <stop offset="40%" stop-color="#FCD2DF" />
            <stop offset="85%" stop-color="#F3B3C8" />
            <stop offset="100%" stop-color="#EAA1B8" />
          </radialGradient>

          {/* Rose Gradient */}
          <radialGradient id="roseGrad1" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#FFE4EC" />
            <stop offset="50%" stop-color="#F6AEC5" />
            <stop offset="100%" stop-color="#D97799" />
          </radialGradient>

          <radialGradient id="roseGrad2" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#FFF5F7" />
            <stop offset="60%" stop-color="#F9CAD7" />
            <stop offset="100%" stop-color="#E59BB2" />
          </radialGradient>

          {/* Lavender Gradient */}
          <linearGradient id="lavenderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C5B4E3" />
            <stop offset="50%" stop-color="#9E88CA" />
            <stop offset="100%" stop-color="#7C65A8" />
          </linearGradient>

          {/* Soft Sage Leaf Gradient */}
          <linearGradient id="sageLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D6E5D3" />
            <stop offset="60%" stop-color="#A8C3A4" />
            <stop offset="100%" stop-color="#7B9976" />
          </linearGradient>

          {/* Soft Shadow */}
          <filter id="softGlowWreath" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Blushing Watercolor Heart */}
        <g filter="url(#softGlowWreath)">
          <path
            d="M200 270 C200 270 95 195 75 125 C58 65 130 35 190 92 C196 98 204 98 210 92 C270 35 342 65 325 125 C305 195 200 270 200 270 Z"
            fill="url(#heartWatercolor)"
            opacity="0.92"
          />
        </g>

        {/* Inner Heart Watercolor Highlight */}
        <path
          d="M195 240 C195 240 115 175 100 125 C88 80 140 58 185 105"
          stroke="#FFFFFF"
          stroke-width="10"
          stroke-linecap="round"
          opacity="0.45"
          filter="blur(3px)"
        />

        {/* --- Surrounding Floral Garland / Wreath --- */}

        {/* Left Side Foliage & Leaves */}
        <path d="M120 70 Q90 100 70 140 Q60 170 70 200 Q85 240 120 275" stroke="#8EA88B" stroke-width="2.5" stroke-dasharray="1 1" fill="none" opacity="0.6"/>
        
        {/* Sage Leaves Left */}
        <path d="M72 130 C55 125 45 135 52 145 C60 155 75 142 72 130 Z" fill="url(#sageLeafGrad)" opacity="0.85" />
        <path d="M65 175 C45 175 42 190 52 198 C62 205 72 190 65 175 Z" fill="url(#sageLeafGrad)" opacity="0.85" />
        <path d="M88 230 C72 238 75 252 86 256 C97 260 100 242 88 230 Z" fill="url(#sageLeafGrad)" opacity="0.85" />
        <path d="M105 85 C90 75 80 85 88 95 C96 105 110 95 105 85 Z" fill="url(#sageLeafGrad)" opacity="0.8" />

        {/* Right Side Foliage & Leaves */}
        <path d="M280 70 Q310 100 330 140 Q340 170 330 200 Q315 240 280 275" stroke="#8EA88B" stroke-width="2.5" stroke-dasharray="1 1" fill="none" opacity="0.6"/>
        
        {/* Sage Leaves Right */}
        <path d="M328 130 C345 125 355 135 348 145 C340 155 325 142 328 130 Z" fill="url(#sageLeafGrad)" opacity="0.85" />
        <path d="M335 175 C355 175 358 190 348 198 C338 205 328 190 335 175 Z" fill="url(#sageLeafGrad)" opacity="0.85" />
        <path d="M312 230 C328 238 325 252 314 256 C303 260 300 242 312 230 Z" fill="url(#sageLeafGrad)" opacity="0.85" />
        <path d="M295 85 C310 75 320 85 312 95 C304 105 290 95 295 85 Z" fill="url(#sageLeafGrad)" opacity="0.8" />

        {/* --- Lavender Sprigs (Purple buds) --- */}
        {/* Left Lavender */}
        <g opacity="0.9">
          <path d="M60 110 Q50 80 48 60" stroke="#7B9976" stroke-width="2" fill="none"/>
          <ellipse cx="48" cy="62" rx="4" ry="7" fill="url(#lavenderGrad)" transform="rotate(-15 48 62)"/>
          <ellipse cx="53" cy="72" rx="4" ry="6" fill="url(#lavenderGrad)" transform="rotate(20 53 72)"/>
          <ellipse cx="45" cy="80" rx="4" ry="6" fill="url(#lavenderGrad)" transform="rotate(-20 45 80)"/>
          <ellipse cx="55" cy="90" rx="4" ry="6" fill="url(#lavenderGrad)" transform="rotate(15 55 90)"/>
          <ellipse cx="48" cy="100" rx="4" ry="6" fill="url(#lavenderGrad)" transform="rotate(-15 48 100)"/>
        </g>

        {/* Right Lavender */}
        <g opacity="0.9">
          <path d="M340 110 Q350 80 352 60" stroke="#7B9976" stroke-width="2" fill="none"/>
          <ellipse cx="352" cy="62" rx="4" ry="7" fill="url(#lavenderGrad)" transform="rotate(15 352 62)"/>
          <ellipse cx="347" cy="72" rx="4" ry="6" fill="url(#lavenderGrad)" transform="rotate(-20 347 72)"/>
          <ellipse cx="355" cy="80" rx="4" ry="6" fill="url(#lavenderGrad)" transform="rotate(20 355 80)"/>
          <ellipse cx="345" cy="90" rx="4" ry="6" fill="url(#lavenderGrad)" transform="rotate(-15 345 90)"/>
          <ellipse cx="352" cy="100" rx="4" ry="6" fill="url(#lavenderGrad)" transform="rotate(15 352 100)"/>
        </g>

        {/* Bottom Lavender sprigs */}
        <g opacity="0.85">
          <ellipse cx="140" cy="275" rx="3.5" ry="6" fill="url(#lavenderGrad)" transform="rotate(-40 140 275)"/>
          <ellipse cx="155" cy="285" rx="3.5" ry="5.5" fill="url(#lavenderGrad)" transform="rotate(-30 155 285)"/>
          <ellipse cx="260" cy="275" rx="3.5" ry="6" fill="url(#lavenderGrad)" transform="rotate(40 260 275)"/>
          <ellipse cx="245" cy="285" rx="3.5" ry="5.5" fill="url(#lavenderGrad)" transform="rotate(30 245 285)"/>
        </g>

        {/* --- Blooming Watercolor Roses --- */}

        {/* Main Rose Left */}
        <g transform="translate(65, 145)">
          <circle cx="20" cy="20" r="22" fill="url(#roseGrad1)" />
          <path d="M12 18 C12 10 28 10 28 18 C28 25 12 25 12 18 Z" fill="#D97799" opacity="0.65" />
          <path d="M8 20 C6 30 34 30 32 20" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.5" />
          <path d="M14 14 C18 6 26 8 28 14" stroke="#D97799" stroke-width="2" fill="none" opacity="0.7" />
          <path d="M6 18 C4 10 16 6 22 8" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity="0.6" />
        </g>

        {/* Main Rose Right */}
        <g transform="translate(295, 145)">
          <circle cx="20" cy="20" r="22" fill="url(#roseGrad1)" />
          <path d="M12 18 C12 10 28 10 28 18 C28 25 12 25 12 18 Z" fill="#D97799" opacity="0.65" />
          <path d="M8 20 C6 30 34 30 32 20" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.5" />
          <path d="M14 14 C18 6 26 8 28 14" stroke="#D97799" stroke-width="2" fill="none" opacity="0.7" />
          <path d="M6 18 C4 10 16 6 22 8" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity="0.6" />
        </g>

        {/* Top Petite Rose Left */}
        <g transform="translate(110, 65)">
          <circle cx="14" cy="14" r="14" fill="url(#roseGrad2)" />
          <circle cx="14" cy="14" r="7" fill="#D97799" opacity="0.5" />
        </g>

        {/* Top Petite Rose Right */}
        <g transform="translate(262, 65)">
          <circle cx="14" cy="14" r="14" fill="url(#roseGrad2)" />
          <circle cx="14" cy="14" r="7" fill="#D97799" opacity="0.5" />
        </g>

        {/* Delicate Golden Sparkles / Floral Pollen */}
        <circle cx="95" cy="115" r="2.5" fill="#E5B869" opacity="0.8" />
        <circle cx="305" cy="115" r="2.5" fill="#E5B869" opacity="0.8" />
        <circle cx="180" cy="285" r="2" fill="#E5B869" opacity="0.7" />
        <circle cx="220" cy="285" r="2" fill="#E5B869" opacity="0.7" />
        <circle cx="200" cy="45" r="3" fill="#F3B3C8" opacity="0.6" />
      </svg>
    </div>
  );
};
