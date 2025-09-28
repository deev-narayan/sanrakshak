import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 240"
      className={cn("w-full", className)}
      aria-label="Sanrakshak Logo"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#E6C9B3', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#C48A62', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#A1663F', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Tree and Circle */}
      <g fill="url(#logo-gradient)">
        {/* Circle */}
        <path
          d="M100 10a90 90 0 1 1 0 180a90 90 0 0 1 0-180zm0 8a82 82 0 1 0 0 164a82 82 0 0 0 0-164z"
          fillRule="evenodd"
        />
        
        {/* Trunk and Main Branches */}
        <path d="m100 165-3-50m3 50 2-35m-2 35-1-20M97 115s-2-20 12-30c14-10 25-5 25-5m-14 35s-20 2-30-15c-10-17 0-35 0-35m-2 20s-10-5-15-15c-5-10 2-25 2-25m15 15-8-20m30 35 10-25" stroke="url(#logo-gradient)" strokeWidth="4" strokeLinecap="round" />

        {/* Leaves (simplified representation) */}
        {/* Branch 1 */}
        <circle cx="132" cy="78" r="5" />
        <circle cx="145" cy="85" r="4" />
        <circle cx="125" cy="95" r="6" />

        {/* Branch 2 */}
        <circle cx="75" cy="70" r="5" />
        <circle cx="65" cy="85" r="6" />
        <circle cx="80" cy="90" r="4" />

        {/* Center Leaves */}
        <circle cx="100" cy="65" r="7" />
        <circle cx="112" cy="60" r="6" />
        <circle cx="88" cy="60" r="6" />
        <circle cx="100" cy="80" r="8" />
        <circle cx="115" cy="98" r="5" />
        <circle cx="85" cy="98" r="5" />

         {/* More leaves for fullness */}
        <circle cx="120" cy="88" r="4" />
        <circle cx="80" cy="78" r="4" />
        <circle cx="95" cy="90" r="5" />
        <circle cx="105" cy="90" r="5" />
        <circle cx="110" cy="75" r="4" />
        <circle cx="90" cy="75" r="4" />
        <circle cx="128" cy="105" r="5" />
        <circle cx="72" cy="105" r="5" />
      </g>
      
      {/* Text */}
      <text
        x="100"
        y="225"
        fontFamily="serif"
        fontSize="36"
        fill="url(#logo-gradient)"
        textAnchor="middle"
        fontWeight="bold"
      >
        Sanrakshak
      </text>
    </svg>
  );
}
