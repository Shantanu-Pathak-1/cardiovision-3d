import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { ThemeProvider } from './lib/theme';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { WorkspacePage } from './pages/WorkspacePage';

function RouteLoading() {
  return (
    <main className="route-loading">
      <span><Activity size={24} className="animate-pulse text-sky-400"/></span>
      <b>OPENING CARDIOVISION STUDIO</b>
      <small>Loading clinical interface…</small>
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
