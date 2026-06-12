import { useCallback, useEffect, useRef, useState } from 'react';

// Drives a "deck": a fixed, full-viewport sequence of sections where each
// discrete input gesture moves exactly one section. No native scrolling, no
// scroll-snap, no viewport-unit math — so it behaves identically on desktop and
// mobile (the URL-bar/`vh` problems simply don't apply because nothing scrolls).
//
// Inputs handled:
//  - wheel / trackpad: one step per gesture; momentum is absorbed by an
//    idle-reset lock so a single flick can't skip multiple sections.
//  - touch: a swipe past a threshold steps once.
//  - keyboard: Arrow/Page/Space step; held keys repeat at a steady rate;
//    Home/End jump to the ends.
export default function useDeck(total) {
  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (d) => {
      setPos((p) => {
        const next = Math.max(0, Math.min(total - 1, p + d));
        if (next !== p) setDir(d > 0 ? 1 : -1);
        return next;
      });
    },
    [total],
  );

  const jump = useCallback(
    (target) => {
      setPos((p) => {
        const next = Math.max(0, Math.min(total - 1, target));
        if (next !== p) setDir(next > p ? 1 : -1);
        return next;
      });
    },
    [total],
  );

  const lock = useRef(false);
  const unlockTimer = useRef(null);
  const kbLast = useRef(0);

  useEffect(() => {
    const IDLE = 500; // ms of input silence before another wheel/touch step
    const WHEEL_THRESHOLD = 6;
    const SWIPE_THRESHOLD = 42; // px
    const KEY_REPEAT = 380; // ms between steps while a key is held

    const scheduleUnlock = () => {
      clearTimeout(unlockTimer.current);
      unlockTimer.current = setTimeout(() => {
        lock.current = false;
      }, IDLE);
    };

    // Let an open menu/overlay handle its own scrolling instead of stepping.
    const overModal = (e) =>
      e.target instanceof Element && e.target.closest('.menu-drawer, .menu-overlay');

    const onWheel = (e) => {
      if (overModal(e)) return;
      e.preventDefault();
      scheduleUnlock(); // keep extending the lock while momentum continues
      if (lock.current || Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      lock.current = true;
      go(e.deltaY > 0 ? 1 : -1);
    };

    let touchStartY = null;
    const onTouchStart = (e) => {
      touchStartY = overModal(e) ? null : e.touches[0]?.clientY ?? null;
    };
    const onTouchEnd = (e) => {
      if (touchStartY == null) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - endY;
      touchStartY = null;
      if (Math.abs(dy) < SWIPE_THRESHOLD || lock.current) return;
      lock.current = true;
      scheduleUnlock();
      go(dy > 0 ? 1 : -1);
    };

    const DOWN = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar']);
    const UP = new Set(['ArrowUp', 'PageUp']);
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      let d = 0;
      if (e.key === 'Home') {
        e.preventDefault();
        return jump(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        return jump(total - 1);
      }
      if (UP.has(e.key) || (e.key === ' ' && e.shiftKey)) d = -1;
      else if (DOWN.has(e.key)) d = 1;
      else return;
      e.preventDefault();
      const now = Date.now();
      if (e.repeat && now - kbLast.current < KEY_REPEAT) return;
      kbLast.current = now;
      go(d);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      clearTimeout(unlockTimer.current);
    };
  }, [go, jump, total]);

  return { pos, dir, go, jump };
}
