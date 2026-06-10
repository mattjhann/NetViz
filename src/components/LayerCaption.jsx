import { AnimatePresence, motion } from 'framer-motion';

// The explanatory header above the packet: which layer we're on and what it does.
export default function LayerCaption({ layer, index, reducedMotion }) {
  return (
    <div className="caption">
      <AnimatePresence mode="wait">
        <motion.div
          key={layer.id}
          className="caption__inner"
          style={{ '--block-accent': layer.accentColor }}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.35, ease: 'easeOut' }}
        >
          <div className="caption__eyebrow">
            <span className="caption__step">Step {index + 1} / 5</span>
            <span className="caption__layernum">{layer.layerNumber}</span>
          </div>
          <h2 className="caption__title">
            {layer.layerName}
            <span className="caption__protocol">{layer.protocol}</span>
          </h2>
          <p className="caption__pdu">
            produces a <strong>{layer.pduName}</strong>
          </p>
          <p className="caption__desc">{layer.description}</p>
          <p className="caption__hint">{layer.scrollHint}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
