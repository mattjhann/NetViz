import { motion, useReducedMotion } from 'framer-motion';
import ScrollDeck from '../components/ScrollDeck.jsx';
import TlsStage from '../components/TlsStage.jsx';
import { TLS_STEPS } from '../data/tlsHandshake.js';

export default function TlsHandshakePage() {
  const reducedMotion = useReducedMotion();
  const rise = (delay) => ({
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  });

  const hero = (
    <header className="hero">
      <motion.p className="hero__kicker" {...rise(0)}>
        TLS 1.3 · Establishing a secure channel
      </motion.p>
      <motion.h1 className="hero__title" {...rise(0.12)}>
        The <span className="hero__title-accent">TLS Handshake</span>
      </motion.h1>
      <motion.p className="hero__lede" {...rise(0.24)}>
        Before any encrypted data flows, the client and server negotiate keys and verify
        identity in a single round trip. Step through each message as it crosses between client
        and server — and hover any field to learn what it carries.
      </motion.p>
    </header>
  );

  const footer = (
    <footer className="footer">
      <p className="footer__recap">
        One round trip, and a private, authenticated channel is ready. Every byte that
        follows is sealed with keys that never crossed the wire in the clear.
      </p>
      <p className="footer__credit">NetViz · the TLS 1.3 handshake</p>
    </footer>
  );

  return (
    <ScrollDeck
      stepCount={TLS_STEPS.length}
      hero={hero}
      footer={footer}
      renderStage={(activeIndex, onSelectStep) => (
        <TlsStage activeIndex={activeIndex} onSelectStep={onSelectStep} />
      )}
    />
  );
}
