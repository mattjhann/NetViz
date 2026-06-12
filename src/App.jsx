import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar.jsx';
import SideMenu from './components/SideMenu.jsx';
import HomePage from './pages/HomePage.jsx';
import { PAGES } from './pages/registry.jsx';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the menu and jump to the top whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Enable section-to-section scroll snapping only on the visualization pages
  // (every registered page; the home route scrolls freely).
  useEffect(() => {
    const isStage = PAGES.some((p) => p.path === location.pathname);
    document.documentElement.classList.toggle('snap-on', isStage);
    return () => document.documentElement.classList.remove('snap-on');
  }, [location.pathname]);

  return (
    <div className="app">
      <div className="backdrop" aria-hidden="true" />

      <TopBar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        {PAGES.map(({ id, path, Component }) => (
          <Route key={id} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
