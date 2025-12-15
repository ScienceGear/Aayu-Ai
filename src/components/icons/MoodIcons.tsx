import React from 'react';

interface IconProps {
  className?: string;
}

export const MoodGreat = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5"/>
    <ellipse cx="16" cy="19" rx="2.5" ry="3" fill="currentColor"/>
    <ellipse cx="32" cy="19" rx="2.5" ry="3" fill="currentColor"/>
    <path d="M14 28C14 28 18 34 24 34C30 34 34 28 34 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="12" cy="24" r="3" fill="currentColor" fillOpacity="0.2"/>
    <circle cx="36" cy="24" r="3" fill="currentColor" fillOpacity="0.2"/>
  </svg>
);

export const MoodOkay = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5"/>
    <ellipse cx="16" cy="20" rx="2.5" ry="3" fill="currentColor"/>
    <ellipse cx="32" cy="20" rx="2.5" ry="3" fill="currentColor"/>
    <path d="M16 30H32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const MoodSad = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5"/>
    <ellipse cx="16" cy="20" rx="2.5" ry="3" fill="currentColor"/>
    <ellipse cx="32" cy="20" rx="2.5" ry="3" fill="currentColor"/>
    <path d="M16 33C16 33 19 28 24 28C29 28 32 33 32 33" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M14 15L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M34 15L30 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MoodUpset = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5"/>
    <ellipse cx="16" cy="20" rx="2.5" ry="3" fill="currentColor"/>
    <ellipse cx="32" cy="20" rx="2.5" ry="3" fill="currentColor"/>
    <path d="M15 32C15 32 18 28 24 28C30 28 33 32 33 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M12 14L19 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M36 14L29 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const MoodTired = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M12 20C12 20 14 22 17 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M31 20C31 20 33 22 36 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <ellipse cx="24" cy="32" rx="4" ry="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2"/>
    <path d="M36 8L40 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M40 8L44 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M44 8L48 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
