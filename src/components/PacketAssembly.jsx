import { AnimatePresence, motion } from 'framer-motion';
import { LAYERS } from '../data/layers.js';
import PacketBlock from './PacketBlock.jsx';

// Short label for a nested (already-wrapped) header.
const abbrev = (layer) => (layer.id === 'datalink' ? 'Eth' : layer.protocol);

// Build the inspect payload handed to the detail panel when a field is hovered.
const makeField = (layer, field, kind) => ({
  id: `${layer.id}-${kind}-${field.name}`,
  name: field.name,
  exampleValue: field.exampleValue,
  detail: field.detail,
  kind,
  accentColor: layer.accentColor,
  layerName: layer.layerName,
  protocol: layer.protocol,
});

export default function PacketAssembly({ activeIndex, hoveredField, onInspect, reducedMotion }) {
  // Recursively render the encapsulation: outermost box = current layer,
  // each inner box = the PDU handed down from the layer above.
  function renderNode(index) {
    const layer = LAYERS[index];
    const isCurrent = index === activeIndex;

    // Application layer: the raw payload everything wraps around.
    if (index === 0) {
      return (
        <PacketBlock
          key="app-data"
          variant="data"
          accentColor={layer.accentColor}
          label={isCurrent ? layer.payload.label : 'Data'}
          value={isCurrent ? layer.payload.exampleValue : null}
          highlighted={isCurrent}
          muted={!isCurrent}
          reducedMotion={reducedMotion}
        />
      );
    }

    // Physical layer: the whole frame is serialized into a bit/signal stream.
    if (layer.id === 'physical') {
      return (
        <PacketBlock
          key="bits"
          variant="bits"
          accentColor={layer.accentColor}
          label={layer.payload.label}
          value={layer.payload.exampleValue}
          highlighted
          reducedMotion={reducedMotion}
        />
      );
    }

    // Transport / Network / Data Link: wrap the inner PDU with a header
    // (and, for Data Link, a trailer).
    const inner = renderNode(index - 1);

    return (
      <motion.div
        key={`pdu-${layer.id}`}
        layout={!reducedMotion}
        className={`pdu ${isCurrent ? 'is-current' : 'is-nested'}`}
        style={{ '--block-accent': layer.accentColor }}
      >
        <span className="pdu__tag">{layer.pduName}</span>

        <div className="pdu__row">
          {/* Header */}
          {isCurrent ? (
            <div className="header-group" aria-label={`${layer.protocol} header`}>
              <span className="header-group__title">{layer.protocol} Header</span>
              <div className="header-group__fields">
                {layer.headerFields.map((f) => {
                  const field = makeField(layer, f, 'header');
                  return (
                    <PacketBlock
                      key={field.id}
                      variant="header"
                      interactive
                      accentColor={layer.accentColor}
                      label={f.name}
                      value={f.exampleValue}
                      field={field}
                      isHovered={hoveredField?.id === field.id}
                      onInspect={onInspect}
                      highlighted
                      reducedMotion={reducedMotion}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <PacketBlock
              variant="header"
              accentColor={layer.accentColor}
              label={`${abbrev(layer)} Hdr`}
              muted
              reducedMotion={reducedMotion}
            />
          )}

          {/* Nested payload */}
          <div className="pdu__payload">{inner}</div>

          {/* Trailer (Data Link only) */}
          {layer.trailerFields.length > 0 &&
            (isCurrent ? (
              <div className="header-group header-group--trailer" aria-label={`${layer.protocol} trailer`}>
                <span className="header-group__title">Trailer</span>
                <div className="header-group__fields">
                  {layer.trailerFields.map((f) => {
                    const field = makeField(layer, f, 'trailer');
                    return (
                      <PacketBlock
                        key={field.id}
                        variant="trailer"
                        interactive
                        accentColor={layer.accentColor}
                        label={f.name}
                        value={f.exampleValue}
                        field={field}
                        isHovered={hoveredField?.id === field.id}
                        onInspect={onInspect}
                        highlighted
                        reducedMotion={reducedMotion}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <PacketBlock variant="trailer" accentColor={layer.accentColor} label="FCS" muted reducedMotion={reducedMotion} />
            ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="assembly">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={LAYERS[activeIndex].id}
          className="assembly__inner"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: 'easeOut' }}
        >
          {renderNode(activeIndex)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
