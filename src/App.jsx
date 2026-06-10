import Hero from './components/Hero.jsx';
import EncapsulationStage from './components/EncapsulationStage.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="app">
      <div className="backdrop" aria-hidden="true" />
      <Hero />
      <EncapsulationStage />
      <Footer />
    </div>
  );
}
