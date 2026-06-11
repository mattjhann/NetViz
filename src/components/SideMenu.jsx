import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PAGES } from '../pages/registry.jsx';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v10h14V10" />
  </svg>
);

// Menu entries: Home plus every registered page. New pages appear automatically.
const ITEMS = [
  { id: 'home', path: '/', title: 'Home', tagline: 'All visualizations', accent: '#9d7bff', icon: <HomeIcon />, end: true },
  ...PAGES.map((p) => ({
    id: p.id,
    path: p.path,
    title: p.title,
    tagline: p.tagline,
    accent: p.accent,
    icon: p.icon,
  })),
];

// Left pop-out navigation drawer with a dimmed overlay.
export default function SideMenu({ open, onClose }) {
  const reducedMotion = useReducedMotion();

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="menu-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.nav
            id="side-menu"
            className="menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            initial={reducedMotion ? { opacity: 0 } : { x: '-100%' }}
            animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <p className="menu-drawer__heading">NetViz</p>
            <ul className="menu-list">
              {ITEMS.map((item) => (
                <li key={item.id} style={{ '--block-accent': item.accent }}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) => `menu-link ${isActive ? 'is-active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="menu-link__icon">{item.icon}</span>
                    <span className="menu-link__text">
                      <span className="menu-link__title">{item.title}</span>
                      <span className="menu-link__tagline">{item.tagline}</span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
