import React from 'react';
import { useLocation } from 'react-router-dom';

const ROUTES = ['/recipes', '/pantry'];

export default function FloatingActionButton() {
  const { pathname } = useLocation();
  if (!ROUTES.includes(pathname)) return null;

  const handleClick = () => {
    if (pathname === '/recipes') {
      window.dispatchEvent(new Event('open-recipe-creator'));
    } else {
      document.querySelector('.pantry-add-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button className="add-fab" aria-label="Add" onClick={handleClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>
  );
}
