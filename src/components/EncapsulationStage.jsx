import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { LAYERS } from '../data/layers.js';
import PacketAssembly from './PacketAssembly.jsx';
import FieldDetail from './FieldDetail.jsx';
import LayerRail from './LayerRail.jsx';
import LayerCaption from './LayerCaption.jsx';

const N = LAYERS.length;

export default function EncapsulationStage() {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  // The header/trailer field the user is currently inspecting (hover or focus).
  const [hoveredField, setHoveredField] = useState(null);

  // Drive the active layer from scroll progress over the tall container.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
    setActiveIndex(idx);
  });

  // Whenever the layer changes, drop any field we were inspecting.
  useEffect(() => {
    setHoveredField(null);
  }, [activeIndex]);

  const activeLayer = LAYERS[activeIndex];

  return (
    <section
      ref={containerRef}
      className="encap-track"
      style={{ height: `${(N + 1) * 100}vh` }}
      aria-label="Network encapsulation walkthrough"
    >
      <div className="encap-stage">
        <LayerRail activeIndex={activeIndex} />

        <div className="encap-stage__inner">
          <LayerCaption layer={activeLayer} index={activeIndex} reducedMotion={reducedMotion} />

          <div className="encap-canvas" role="img" aria-label={`${activeLayer.layerName} layer producing a ${activeLayer.pduName}`}>
            <PacketAssembly
              activeIndex={activeIndex}
              hoveredField={hoveredField}
              onInspect={setHoveredField}
              reducedMotion={reducedMotion}
            />
          </div>

          <FieldDetail
            field={hoveredField}
            layer={activeLayer}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </section>
  );
}
