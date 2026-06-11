import { Link } from 'react-router-dom';

// Fixed top bar: the NetViz wordmark (links home) and the menu toggle button.
export default function TopBar({ menuOpen, onToggleMenu }) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__menu-btn"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="side-menu"
        onClick={onToggleMenu}
      >
        <span className={`hamburger ${menuOpen ? 'is-open' : ''}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <Link to="/" className="topbar__brand">
        Net<span className="topbar__brand-accent">Viz</span>
      </Link>
    </header>
  );
}
