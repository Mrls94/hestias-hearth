import { useId } from 'react';

export default function MeanderDivider({ className = '' }) {
  const id = useId();
  const patId = `meander-${id}`.replace(/:/g, '');
  return (
    <div className={`meander-divider ${className}`} aria-hidden="true">
      <svg width="100%" height="16" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patId} x="0" y="0" width="32" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M0,8 L4,8 L4,1 L28,1 L28,15 L8,15 L8,8 L32,8"
              fill="none"
              stroke="var(--terracotta)"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </pattern>
        </defs>
        <rect width="100%" height="16" fill={`url(#${patId})`} />
      </svg>
    </div>
  );
}
