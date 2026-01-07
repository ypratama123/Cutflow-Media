import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: "STARTER",
      price: "Rp 500.000",
      period: "/bulan",
      clips: "10 clips/bulan",
      turnaround: "3-5 hari kerja",
      revisions: "2x revision",
      features: [
        "Basic editing",
        "Subtitle Indonesia/English",
        "Background music",
        "Format landscape/portrait"
      ],
      buttonText: "Pilih Paket",
      buttonStyle: "btn-secondary",
      popular: false
    },
    {
      name: "GROWTH",
      price: "Rp 900.000",
      period: "/bulan",
      clips: "30 clips/bulan",
      turnaround: "2-3 hari kerja",
      revisions: "Unlimited revision",
      features: [
        "Advanced editing + effects",
        "Subtitle + Sound FX",
        "Custom thumbnail design",
        "Multi-platform optimization",
        "Priority support",
        "Dashboard access"
      ],
      buttonText: "Pilih Paket",
      buttonStyle: "btn-secondary",
      popular: true
    },
    {
      name: "PRO",
      price: "Rp 1.500.000",
      period: "/bulan",
      clips: "Unlimited clips",
      turnaround: "1-2 hari kerja",
      revisions: "Unlimited revision",
      features: [
        "Full production service",
        "Dedicated project manager",
        "API integration",
        "White-label option",
        "24/7 support",
        "Custom SLA"
      ],
      buttonText: "Pilih Paket",
      buttonStyle: "btn-secondary",
      popular: false
    }
  ];

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="section-title">
            <span className="gradient-text">Pilih Paket yang Sesuai</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Paket fleksibel untuk berbagai kebutuhan content creator
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border ${plan.popular
                ? 'border-pink-600 shadow-2xl shadow-pink-600/20 scale-105'
                : 'border-slate-700'
                } card-hover`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="card-title text-white font-heading font-black tracking-wide">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text font-heading">{plan.price}</span>
                  <span className="text-gray-300 text-base md:text-lg">{plan.period}</span>
                </div>
                <div className="space-y-2 text-gray-300 font-medium">
                  <p className="font-semibold text-base md:text-lg">{plan.clips}</p>
                  <p className="text-sm md:text-base">{plan.turnaround}</p>
                  <p className="text-sm md:text-base">{plan.revisions}</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <Check className="text-green-500 mr-3 flex-shrink-0" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={`/dashboard/checkout?pkg=${plan.name.toLowerCase()}`}
                className={`w-full ${plan.buttonStyle} inline-block text-center py-3 rounded-lg font-semibold transition-all duration-300`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-4">
            Butuh paket custom atau ada pertanyaan?
          </p>
          <button
            onClick={scrollToContact}
            className="btn-secondary"
          >
            Konsultasi Gratis
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;