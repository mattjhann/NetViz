import { AnimatePresence, motion } from 'framer-motion';

// The panel directly under the data rectangle. When the user hovers (or
// keyboard-focuses) a field, it explains what that field does. Otherwise it
// shows a gentle prompt. Generic across every visualization — pass the active
// `field` (or null) plus a fallback `prompt` string and an `accentColor`.
export default function FieldDetail({ field, prompt, accentColor, reducedMotion }) {
  const hasField = Boolean(field);
  const accent = field?.accentColor ?? accentColor;

  return (
    <div className="detail" style={{ '--block-accent': accent }} aria-live="polite">
      <AnimatePresence mode="wait">
        {hasField ? (
          <motion.div
            key={field.id}
            className="detail__card is-active"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.25, ease: 'easeOut' }}
          >
            <div className="detail__head">
              <span className="detail__name">{field.name}</span>
              {field.exampleValue != null && (
                <span className="detail__value">{field.exampleValue}</span>
              )}
              {(field.protocol || field.kind) && (
                <span className="detail__tag">
                  {[field.protocol, field.kind].filter(Boolean).join(' ')}
                </span>
              )}
            </div>
            <p className="detail__text">{field.detail}</p>
          </motion.div>
        ) : (
          <motion.div
            key="prompt"
            className="detail__card is-prompt"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.25, ease: 'easeOut' }}
          >
            <p className="detail__text">{prompt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
