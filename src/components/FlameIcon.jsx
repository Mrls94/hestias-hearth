import React from 'react';

export default function FlameIcon({ width = 28, height = 40, className = '' }) {
  return (
    <svg
      viewBox="0 0 28 40"
      width={width}
      height={height}
      className={`flame-icon${className ? ` ${className}` : ''}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Outer body */}
      <path
        d="M14 2C20 8 25 18 24 28C23 36 20 40 14 40C8 40 5 36 4 28C3 18 8 8 14 2Z"
        fill="var(--terracotta)"
      />
      {/* Inner flame */}
      <path
        className="flame-mid"
        d="M14 13C18 18 22 24 21 32C20 37 17 39 14 39C11 39 8 37 7 32C6 24 10 18 14 13Z"
        fill="var(--ochre)"
      />
      {/* Hot core */}
      <path
        className="flame-core"
        d="M14 26C16 29 18 33 17.5 36C17 38 15.5 38.5 14 38.5C12.5 38.5 11 38 10.5 36C10 33 12 29 14 26Z"
        fill="var(--ochre-light)"
      />
    </svg>
  );
}
