import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import useDeck from '../hooks/useDeck.js';

// A fixed, full-viewport deck of sections: an intro (hero), one section per
// step, and an outro (footer). useDeck turns each discrete input gesture into a
// one-section move, so it's deterministic on desktop and mobile alike.
//
// Within the step range the same stage stays mounted and animates its own
// content as `activeIndex` changes; only the hero↔stage and stage↔footer
// boundaries slide as whole sections.
export default function ScrollDeck({ stepCount, hero, footer, renderStage }) {
  const total = stepCount + 2; // hero + steps + footer
  const { pos, dir, jump } = useDeck(total);
  const reducedMotion = useReducedMotion();

  // Lock the document while the deck owns the screen (nothing else scrolls).
  useEffect(() => {
    document.documentElement.classList.add('deck-mode');
    return () => document.documentElement.classList.remove('deck-mode');
  }, []);

  const zone = pos === 0 ? 'hero' : pos === total - 1 ? 'footer' : 'stage';
  const activeIndex = pos - 1;

  const variants = reducedMotion
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (d) => ({ y: d > 0 ? '100%' : '-100%' }),
        center: { y: 0 },
        exit: (d) => ({ y: d > 0 ? '-100%' : '100%' }),
      };

  return (
    <div className="deck">
      <AnimatePresence custom={dir} initial={false} mode="sync">
        <motion.div
          key={zone}
          className="deck__section"
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reducedMotion ? 0.2 : 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {zone === 'hero' ? hero : zone === 'footer' ? footer : renderStage(activeIndex, (i) => jump(i + 1))}
        </motion.div>
      </AnimatePresence>

      {zone === 'stage' && (
        <button
          type="button"
          className="deck-hint"
          onClick={() => jump(pos + 1)}
          aria-label="Next section"
        >
          <span className="deck-hint__label">{`${activeIndex + 1} / ${stepCount}`}</span>
          <motion.span
            className="deck-hint__chevron"
            aria-hidden="true"
            animate={reducedMotion ? {} : { y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ⌄
          </motion.span>
        </button>
      )}
    </div>
  );
}
