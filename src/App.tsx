import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Services from './components/Services';
import VideoShowcase from './components/VideoShowcase';
import Workflow from './components/Workflow';
import Pricing from './components/Pricing';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden w-full">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <Services />
      <VideoShowcase />
      <Workflow />
      <Pricing />
      <Portfolio />
      <Contact />
      <Footer />
    </div>
  );
}

export default App
