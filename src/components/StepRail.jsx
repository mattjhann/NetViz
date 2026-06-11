// Fixed side rail acting as a live progress tracker for a scroll-stepped stage.
// Generic across visualizations: pass `items` (each `{ label, sublabel,
// accentColor }`), the `activeIndex`, and an accessible `label`.
export default function StepRail({ items, activeIndex, label = 'Progress' }) {
  return (
    <nav className="rail" aria-label={label}>
      <ol className="rail__list">
        {items.map((item, i) => {
          const state = i === activeIndex ? 'active' : i < activeIndex ? 'done' : 'todo';
          return (
            <li
              key={item.id ?? item.label ?? i}
              className={`rail__item is-${state}`}
              style={{ '--block-accent': item.accentColor }}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span className="rail__dot" />
              <span className="rail__text">
                <span className="rail__layer">{item.label}</span>
                {item.sublabel && <span className="rail__pdu">{item.sublabel}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
