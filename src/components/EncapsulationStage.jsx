import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { LAYERS } from '../data/layers.js';
import useScrollSteps from '../hooks/useScrollSteps.js';
import PacketAssembly from './PacketAssembly.jsx';
import FieldDetail from './FieldDetail.jsx';
import StepRail from './StepRail.jsx';
import SnapCells from './SnapCells.jsx';
import LayerCaption from './LayerCaption.jsx';

const N = LAYERS.length;

// Rail items derived from the layer data.
const RAIL_ITEMS = LAYERS.map((l) => ({
  id: l.id,
  label: l.layerName,
  sublabel: l.pduName,
  accentColor: l.accentColor,
}));

export default function EncapsulationStage() {
  const reducedMotion = useReducedMotion();
  const { containerRef, activeIndex, engaged } = useScrollSteps(N);
  // The header/trailer field the user is currently inspecting (hover or focus).
  const [hoveredField, setHoveredField] = useState(null);

  // Whenever the layer changes, drop any field we were inspecting.
  useEffect(() => {
    setHoveredField(null);
  }, [activeIndex]);

  const activeLayer = LAYERS[activeIndex];
  const prompt =
    activeLayer.headerFields.length > 0 || activeLayer.trailerFields.length > 0
      ? 'Hover or tab through a field above to learn what it does.'
      : activeLayer.scrollHint;

  return (
    <section
      ref={containerRef}
      className="encap-track"
      aria-label="Network encapsulation walkthrough"
    >
      <div className="encap-stage">
        <StepRail items={RAIL_ITEMS} activeIndex={activeIndex} label="Encapsulation progress" hidden={!engaged} />

        <div className="encap-stage__inner">
          <LayerCaption layer={activeLayer} index={activeIndex} reducedMotion={reducedMotion} />

          <div
            className="encap-canvas"
            role="img"
            aria-label={`${activeLayer.layerName} layer producing a ${activeLayer.pduName}`}
          >
            <PacketAssembly
              activeIndex={activeIndex}
              hoveredField={hoveredField}
              onInspect={setHoveredField}
              reducedMotion={reducedMotion}
            />
          </div>

          <FieldDetail
            field={hoveredField}
            prompt={prompt}
            accentColor={activeLayer.accentColor}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
      <SnapCells count={N} />
    </section>
  );
}
