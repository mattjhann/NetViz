import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { PAGES } from './registry.jsx';

export default function HomePage() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="home">
      <section className="home__hero">
        <motion.p
          className="hero__kicker"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Interactive networking, visualized
        </motion.p>
        <motion.h1
          className="home__title"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Net<span className="hero__title-accent">Viz</span>
        </motion.h1>
        <motion.p
          className="hero__lede"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Scroll-driven, hands-on explanations of how networks really work. Pick a
          visualization to begin — or open the menu any time to jump between them.
        </motion.p>
      </section>

      <section className="home__grid" aria-label="Visualizations">
        {PAGES.map((page, i) => (
          <motion.div
            key={page.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
          >
            <Link to={page.path} className="card" style={{ '--block-accent': page.accent }}>
              <span className="card__icon">{page.icon}</span>
              <span className="card__body">
                <span className="card__title">{page.title}</span>
                <span className="card__tagline">{page.tagline}</span>
              </span>
              <span className="card__cta" aria-hidden="true">
                Explore →
              </span>
            </Link>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
