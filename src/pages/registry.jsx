import EncapsulationPage from './EncapsulationPage.jsx';
import TlsHandshakePage from './TlsHandshakePage.jsx';

// ===========================================================================
// PAGE REGISTRY — the single place that defines every visualization.
//
// The side menu, the router, and the home-screen cards are all generated from
// this array. To add a new visualization:
//   1. Create src/pages/<Name>Page.jsx (and optionally src/data/<name>.js).
//   2. Add one entry below.
// The menu, routes, and home cards update automatically. No other wiring needed.
//
// Each entry: { id, path, title, tagline, accent, icon, Component }
// ===========================================================================

const NestedIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" />
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="4" y="10.5" width="16" height="10" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const PAGES = [
  {
    id: 'encapsulation',
    path: '/encapsulation',
    title: 'Network Encapsulation',
    tagline: 'Watch data get wrapped layer by layer: Data → Segment → Packet → Frame → Bits.',
    accent: '#7c8cff',
    icon: <NestedIcon />,
    Component: EncapsulationPage,
  },
  {
    id: 'tls',
    path: '/tls',
    title: 'TLS 1.3 Handshake',
    tagline: 'Step through the messages that build a secure channel in a single round trip.',
    accent: '#42d6a4',
    icon: <LockIcon />,
    Component: TlsHandshakePage,
  },
];

export default PAGES;
