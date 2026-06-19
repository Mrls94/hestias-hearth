import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useAppState } from './context/AppState';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import BottomNav from './components/BottomNav';
import FloatingActionButton from './components/FloatingActionButton';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Shopping from './pages/Shopping';
import Planner from './pages/Planner';
import Pantry from './pages/Pantry';
import Login from './pages/Login';
import HouseholdSetup from './pages/HouseholdSetup';
import './App.css';

function LoadingScreen() {
  return (
    <div className="loading-root">
      <div className="loading-flame">🔥</div>
      <div className="loading-spinner" />
    </div>
  );
}

function AppShell() {
  const { loading, needsHousehold, completeHouseholdSetup } = useAppState();
  if (loading) return <LoadingScreen />;
  if (needsHousehold) return <HouseholdSetup onComplete={completeHouseholdSetup} />;
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main" id="main">
        <Topbar />
        <div className="content">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/recipes"  element={<Recipes />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/planner"  element={<Planner />} />
            <Route path="/pantry"   element={<Pantry />} />
          </Routes>
        </div>
      </div>
      <BottomNav />
      <FloatingActionButton />
    </div>
  );
}

export default function App() {
  const { authState } = useAuth();
  if (authState === 'loading') return <LoadingScreen />;
  if (authState !== 'authenticated') return <Login />;
  return <AppShell />;
}
