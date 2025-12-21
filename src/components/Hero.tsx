import { motion } from 'framer-motion';

const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden w-full">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden w-full">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-full"
            style={{
              left: `${Math.random() * 95}%`, // Reduced from 100% to 95% to prevent overflow
              top: `${Math.random() * 95}%`,  // Reduced from 100% to 95% to prevent overflow
              animation: `particle-float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 md:w-96 md:h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 md:w-96 md:h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <img 
            src="https://i.imgur.com/y2qccQU.png" 
            alt="CUTFLOW MEDIA Logo" 
            className="h-16 md:h-20 lg:h-24 w-auto mx-auto mb-6 floating-element"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-title mb-6"
        >
          <span className="gradient-text block">
            Transform Your
          </span>
          <span className="gradient-text block">
            Long-Form Content
          </span>
          <span className="text-white block">Into Viral Clips</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl lg:text-3xl gradient-text font-heading font-bold mb-4 tracking-wide"
        >
          Where Clips Meet Workflow
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Professional video clipping service dengan dashboard management system. 
          <br className="hidden sm:block" />
          Hemat waktu, maksimalkan reach dengan kualitas premium.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
        >
          <button
            onClick={() => scrollToSection('#contact')}
            className="btn-primary relative z-10"
          >
            <span className="relative z-10">Mulai Sekarang</span>
          </button>
          <button
            onClick={() => scrollToSection('#pricing')}
            className="btn-secondary"
          >
            Lihat Pricing
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;