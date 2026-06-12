import { motion, useReducedMotion } from 'framer-motion';
import ScrollDeck from '../components/ScrollDeck.jsx';
import BgpStage from '../components/BgpStage.jsx';
import { BGP_STEPS } from '../data/bgpRouting.js';

export default function BgpRoutingPage() {
  const reducedMotion = useReducedMotion();
  const rise = (delay) => ({
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  });

  const hero = (
    <header className="hero">
      <motion.p className="hero__kicker" {...rise(0)}>
        BGP · The Internet's routing fabric
      </motion.p>
      <motion.h1 className="hero__title" {...rise(0.12)}>
        <span className="hero__title-accent">BGP</span> Routing
      </motion.h1>
      <motion.p className="hero__lede" {...rise(0.24)}>
        BGP stitches thousands of independent networks into one Internet, advertising which
        network can reach which addresses. Step through a route propagating between Autonomous
        Systems, a best path get chosen, a link fail — and BGP reroute around it.
      </motion.p>
    </header>
  );

  const footer = (
    <footer className="footer">
      <p className="footer__recap">
        No central controller, no human in the loop — just ASes exchanging reachability and
        agreeing on paths. That resilience is why a fibre cut on one side of the planet
        reroutes in seconds.
      </p>
      <p className="footer__credit">NetViz · BGP routing</p>
    </footer>
  );

  return (
    <ScrollDeck
      stepCount={BGP_STEPS.length}
      hero={hero}
      footer={footer}
      renderStage={(activeIndex, onSelectStep) => (
        <BgpStage activeIndex={activeIndex} onSelectStep={onSelectStep} />
      )}
    />
  );
}
