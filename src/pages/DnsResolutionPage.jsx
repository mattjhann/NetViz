import { motion, useReducedMotion } from 'framer-motion';
import DnsStage from '../components/DnsStage.jsx';

export default function DnsResolutionPage() {
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
          DNS · Turning a name into an address
        </motion.p>
        <motion.h1 className="hero__title" {...rise(0.12)}>
          <span className="hero__title-accent">DNS</span> Resolution
        </motion.h1>
        <motion.p className="hero__lede" {...rise(0.24)}>
          Before your browser can connect to a site, it has to turn a name like
          www.example.com into an IP address. Scroll to follow a query as it walks the
          DNS hierarchy — root to TLD to authoritative — and hover any field to see what
          it carries.
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

      <DnsStage />

      <footer className="footer">
        <p className="footer__recap">
          A name becomes an address in a handful of hops — and thanks to caching, the next
          lookup skips the journey entirely. Now the real connection can begin.
        </p>
        <p className="footer__credit">NetViz · DNS resolution</p>
      </footer>
    </>
  );
}
