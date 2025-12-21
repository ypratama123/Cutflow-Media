import { motion } from 'framer-motion';
import { Scissors, Video, Sparkles } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Scissors,
      title: "Podcast Clipping",
      description: "Potong episode podcast jadi clips viral",
      features: ["Timestamping", "Subtitle", "Thumbnail"]
    },
    {
      icon: Video,
      title: "Social Media Content",
      description: "Optimasi video untuk Instagram, TikTok, YouTube Shorts",
      features: ["Format optimization", "Captions", "Trending sounds"]
    },
    {
      icon: Sparkles,
      title: "Custom Solutions",
      description: "Butuh solusi khusus? Kami siap!",
      features: ["API integration", "Bulk processing", "Priority support"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="section-title">
            <span className="gradient-text">Layanan Kami</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Solusi lengkap untuk kebutuhan video clipping Anda
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 card-hover group"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="text-white" size={32} />
                  </div>
                  
                  <h3 className="card-title text-white">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-400 flex items-center justify-center">
                        <span className="w-2 h-2 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;