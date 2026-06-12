import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DNS_STEPS, ACTORS } from '../data/dnsResolution.js';
import PacketBlock from './PacketBlock.jsx';
import FieldDetail from './FieldDetail.jsx';
import StepRail from './StepRail.jsx';

const N = DNS_STEPS.length;
const actorIndex = (id) => ACTORS.findIndex((a) => a.id === id);

const RAIL_ITEMS = DNS_STEPS.map((s) => ({
  id: s.id,
  label: s.title,
  sublabel: `${ACTORS[actorIndex(s.from)].label} → ${ACTORS[actorIndex(s.to)].label}`,
  accentColor: s.accentColor,
}));

const makeField = (step, f) => ({
  id: `${step.id}-${f.name}`,
  name: f.name,
  exampleValue: f.exampleValue,
  detail: f.detail,
  accentColor: step.accentColor,
  protocol: 'DNS',
  kind: step.direction === 'query' ? 'query' : 'response',
});

export default function DnsStage({ activeIndex, onSelectStep }) {
  const reducedMotion = useReducedMotion();
  const [hoveredField, setHoveredField] = useState(null);

  useEffect(() => {
    setHoveredField(null);
  }, [activeIndex]);

  const step = DNS_STEPS[activeIndex];
  const fromIdx = actorIndex(step.from);
  const toIdx = actorIndex(step.to);
  const goingRight = toIdx > fromIdx; // deeper into the hierarchy
  const arrow = goingRight ? '▶' : '◀';

  return (
    <div className="encap-stage" aria-label="DNS resolution walkthrough">
        <StepRail items={RAIL_ITEMS} activeIndex={activeIndex} label="Resolution progress" onSelect={onSelectStep} />

        <div className="encap-stage__inner">
          {/* Caption */}
          <div className="caption">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                className="caption__inner"
                style={{ '--block-accent': step.accentColor }}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: reducedMotion ? 0.2 : 0.35, ease: 'easeOut' }}
              >
                <div className="caption__eyebrow">
                  <span className="caption__step">Step {activeIndex + 1} / {N}</span>
                  <span className="caption__layernum">
                    {ACTORS[fromIdx].label} → {ACTORS[toIdx].label}
                  </span>
                </div>
                <h2 className="caption__title">
                  {step.title}
                  <span className="caption__protocol">{step.direction}</span>
                </h2>
                <p className="caption__desc">{step.summary}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Journey strip across the DNS hierarchy */}
          <div className="dns-journey" role="img" aria-label={`Querying from ${ACTORS[fromIdx].label} to ${ACTORS[toIdx].label}`}>
            {ACTORS.map((actor, i) => {
              const role =
                i === fromIdx ? 'from' : i === toIdx ? 'to' : 'idle';
              return (
                <div key={actor.id} className={`dns-actor is-${role}`}>
                  <span className="dns-actor__dot" />
                  <span className="dns-actor__label">{actor.label}</span>
                  <span className="dns-actor__sub">{actor.sublabel}</span>
                </div>
              );
            })}
          </div>

          {/* DNS message */}
          <div className="dns-msg-wrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                className="dns-msg"
                style={{ '--block-accent': step.accentColor }}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: goingRight ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: goingRight ? 40 : -40 }}
                transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: 'easeOut' }}
              >
                <div className="dns-msg__head">
                  <span className="dns-msg__arrow" aria-hidden="true">{arrow}</span>
                  <span className="dns-msg__title">
                    {step.direction === 'query' ? 'Query' : step.direction === 'referral' ? 'Referral' : 'Answer'}
                  </span>
                </div>
                <div className="dns-msg__fields">
                  {step.fields.map((f) => {
                    const field = makeField(step, f);
                    return (
                      <PacketBlock
                        key={field.id}
                        variant="header"
                        interactive
                        highlighted
                        accentColor={step.accentColor}
                        label={f.name}
                        value={f.exampleValue}
                        field={field}
                        isHovered={hoveredField?.id === field.id}
                        onInspect={setHoveredField}
                        reducedMotion={reducedMotion}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <FieldDetail
            field={hoveredField}
            prompt="Hover or tab through a field above to learn what it does."
            accentColor={step.accentColor}
            reducedMotion={reducedMotion}
          />
        </div>
    </div>
  );
}
