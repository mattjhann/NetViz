import { motion } from 'framer-motion';

// A single labeled rectangle inside the data packet.
//
// Two flavours:
//  - interactive: a header/trailer field of the CURRENT layer. It is hoverable
//    and keyboard-focusable; pointing at it surfaces its explanation below.
//  - static: a payload, muted (nested) header, or the bit-stream block.
export default function PacketBlock({
  label,
  value,
  accentColor,
  variant = 'payload', // 'payload' | 'header' | 'trailer' | 'bits' | 'data'
  highlighted = false,
  muted = false,
  interactive = false,
  isHovered = false,
  field = null,
  onInspect,
  reducedMotion = false,
}) {
  const className = [
    'block',
    `block--${variant}`,
    highlighted ? 'is-highlighted' : '',
    muted ? 'is-muted' : '',
    interactive ? 'is-interactive' : '',
    isHovered ? 'is-hovered' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style = accentColor
    ? {
        '--block-accent': accentColor,
      }
    : undefined;

  const enterFrom = reducedMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.7, y: -14 };

  const inspect = () => {
    if (interactive && onInspect && field) onInspect(field);
  };

  const common = {
    layout: true,
    className,
    style,
    initial: enterFrom,
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: reducedMotion
      ? { duration: 0.2 }
      : { type: 'spring', stiffness: 320, damping: 26 },
  };

  if (interactive) {
    return (
      <motion.button
        type="button"
        {...common}
        onMouseEnter={inspect}
        onFocus={inspect}
        aria-label={`${label}${value ? `, value ${value}` : ''}`}
      >
        <span className="block__label">{label}</span>
        {value != null && <span className="block__value">{value}</span>}
      </motion.button>
    );
  }

  return (
    <motion.div {...common}>
      <span className="block__label">{label}</span>
      {value != null && <span className="block__value">{value}</span>}
    </motion.div>
  );
}
