import React from 'react';

interface SheepIconProps {
  className?: string;
  size?: number;
}

export const SheepLogo: React.FC<SheepIconProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <circle cx="24" cy="24" r="23" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
      {/* Sheep Ears / Horns */}
      <path
        d="M12 18C10 20 8.5 24 10 26.5C11.5 29 14.5 28 15 25C15.5 22 14 16 12 18Z"
        fill="#F8FAFC"
      />
      <path
        d="M36 18C38 20 39.5 24 38 26.5C36.5 29 33.5 28 33 25C32.5 22 34 16 36 18Z"
        fill="#F8FAFC"
      />
      {/* Sheep Wool Tuft on Top */}
      <circle cx="19" cy="15" r="4.5" fill="#FFFFFF" />
      <circle cx="24" cy="13.5" r="5" fill="#FFFFFF" />
      <circle cx="29" cy="15" r="4.5" fill="#FFFFFF" />
      {/* Face */}
      <path
        d="M17 19C17 19 15.5 25 17.5 30C19.5 35 23 37 24 37C25 37 28.5 35 30.5 30C32.5 25 31 19 31 19C31 19 28 20 24 20C20 20 17 19 17 19Z"
        fill="#FFFFFF"
      />
      {/* Eyes */}
      <circle cx="20.5" cy="24.5" r="1.5" fill="#0F172A" />
      <circle cx="27.5" cy="24.5" r="1.5" fill="#0F172A" />
      {/* Snout / Nose */}
      <path
        d="M22.5 30.5C23.2 31.2 24.8 31.2 25.5 30.5"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line x1="24" y1="28.5" x2="24" y2="30.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const SheepSilhouette: React.FC<SheepIconProps> = ({ className = 'w-5 h-5', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <circle cx="9" cy="8" r="3" />
      <circle cx="15" cy="8" r="3" />
      <circle cx="12" cy="6" r="3" />
      <rect x="7" y="9" width="10" height="7" rx="3" />
      <line x1="9" y1="16" x2="9" y2="20" />
      <line x1="15" y1="16" x2="15" y2="20" />
      <path d="M17 10C18.5 10 20 11 20 12.5C20 14 18.5 15 17 15" />
      <circle cx="18.5" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
};
