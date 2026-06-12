import ScrollDeck from '../components/ScrollDeck.jsx';
import Hero from '../components/Hero.jsx';
import EncapsulationStage from '../components/EncapsulationStage.jsx';
import Footer from '../components/Footer.jsx';
import { LAYERS } from '../data/layers.js';

export default function EncapsulationPage() {
  return (
    <ScrollDeck
      stepCount={LAYERS.length}
      hero={<Hero />}
      footer={<Footer />}
      renderStage={(activeIndex, onSelectStep) => (
        <EncapsulationStage activeIndex={activeIndex} onSelectStep={onSelectStep} />
      )}
    />
  );
}
