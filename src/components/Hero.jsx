import { motion, useReducedMotion } from 'framer-motion';

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const rise = (delay) => ({
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  });

  return (
    <header className="hero">
      <motion.p className="hero__kicker" {...rise(0)}>
        TCP/IP · The journey of your data
      </motion.p>
      <motion.h1 className="hero__title" {...rise(0.12)}>
        Network <span className="hero__title-accent">Encapsulation</span>
      </motion.h1>
      <motion.p className="hero__lede" {...rise(0.24)}>
        Every message your computer sends is wrapped, layer by layer, before it ever
        touches the wire. Scroll to watch a single piece of data get encapsulated —
        Data → Segment → Packet → Frame → Bits — and hover any header field to learn
        what it does.
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
  );
}
