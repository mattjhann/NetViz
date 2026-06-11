import { motion, useReducedMotion } from 'framer-motion';
import TlsStage from '../components/TlsStage.jsx';

export default function TlsHandshakePage() {
  const reducedMotion = useReducedMotion();
  const rise = (delay) => ({
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  });

  return (
    <>
      <header className="hero">
        <motion.p className="hero__kicker" {...rise(0)}>
          TLS 1.3 · Establishing a secure channel
        </motion.p>
        <motion.h1 className="hero__title" {...rise(0.12)}>
          The <span className="hero__title-accent">TLS Handshake</span>
        </motion.h1>
        <motion.p className="hero__lede" {...rise(0.24)}>
          Before any encrypted data flows, the client and server negotiate keys and verify
          identity in a single round trip. Scroll to watch each message cross between client
          and server — and hover any field to learn what it carries.
        </motion.p>
        <motion.div className="hero__cue" {...rise(0.4)} aria-hidden="true">
          <span className="hero__cue-label">Scroll to begin</span>
          <motion.span
            className="hero__cue-arrow"
            animate={reducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
        </motion.div>
      </header>

      <TlsStage />

      <footer className="footer">
        <p className="footer__recap">
          One round trip, and a private, authenticated channel is ready. Every byte that
          follows is sealed with keys that never crossed the wire in the clear.
        </p>
        <p className="footer__credit">NetViz · the TLS 1.3 handshake</p>
      </footer>
    </>
  );
}
