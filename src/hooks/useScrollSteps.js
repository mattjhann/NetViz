import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

// Drives a "scroll-stepped" stage: a tall scroll track whose progress maps to a
// discrete active step (0 .. stepCount-1). Shared by every scroll-driven page
// (encapsulation, TLS handshake, and future visualizations).
//
// Usage:
//   const { containerRef, activeIndex } = useScrollSteps(steps.length);
//   <section ref={containerRef} style={{ height: `${(steps.length + 1) * 100}vh` }}>
//     <div className="...sticky stage...">{render(activeIndex)}</div>
//   </section>
export default function useScrollSteps(stepCount) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // True only while the stage is scrolled into view (pinned), so callers can
  // hide step-progress UI over the intro/hero and the outro/footer.
  const [engaged, setEngaged] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const idx = Math.min(stepCount - 1, Math.max(0, Math.floor(p * stepCount)));
    setActiveIndex(idx);
    setEngaged(p > 0.001 && p < 0.999);
  });

  // Reset to the first step if the number of steps changes (e.g. data swap).
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, stepCount - 1));
  }, [stepCount]);

  return { containerRef, activeIndex, engaged, scrollYProgress };
}
