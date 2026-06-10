import { LAYERS } from '../data/layers.js';

// Fixed side rail acting as a live progress tracker through the five layers.
export default function LayerRail({ activeIndex }) {
  return (
    <nav className="rail" aria-label="Encapsulation progress">
      <ol className="rail__list">
        {LAYERS.map((layer, i) => {
          const state = i === activeIndex ? 'active' : i < activeIndex ? 'done' : 'todo';
          return (
            <li
              key={layer.id}
              className={`rail__item is-${state}`}
              style={{ '--block-accent': layer.accentColor }}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span className="rail__dot" />
              <span className="rail__text">
                <span className="rail__layer">{layer.layerName}</span>
                <span className="rail__pdu">{layer.pduName}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
