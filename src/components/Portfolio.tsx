import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Portfolio = () => {
  const testimonials = [
    {
      name: "John Doe",
      role: "Podcast Host",
      company: "Tech Talk Indonesia",
      quote: "CUTFLOW menghemat 15 jam kerja editing per minggu! Dashboard tracking-nya sangat membantu untuk monitor progress semua episode.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Jane Smith",
      role: "Content Creator",
      company: "Beauty & Lifestyle",
      quote: "Dashboard sangat membantu track semua project. Tim editor profesional dan hasil selalu memuaskan. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Mike Johnson",
      role: "YouTuber",
      company: "Gaming Channel",
      quote: "Kualitas editing professional dengan harga terjangkau. Unlimited revision di paket Pro sangat membantu untuk hasil yang perfect.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5
    }
  ];

  return (
    <section id="portfolio" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="section-title">
            <span className="gradient-text">Dipercaya Oleh</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Testimoni dari content creator yang sudah merasakan layanan kami
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 card-hover"
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-500 fill-current" size={20} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-300 mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=ec4899&color=fff&size=48`;
                    }}
                  />
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <h4 className="text-white font-semibold text-base">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Client Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-8">Trusted by 100+ Content Creators</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for client logos */}
            <div className="bg-slate-700 px-6 py-3 rounded-lg">
              <span className="text-gray-300 font-semibold">Podcast Network</span>
            </div>
            <div className="bg-slate-700 px-6 py-3 rounded-lg">
              <span className="text-gray-300 font-semibold">Creator Studio</span>
            </div>
            <div className="bg-slate-700 px-6 py-3 rounded-lg">
              <span className="text-gray-300 font-semibold">Media House</span>
            </div>
            <div className="bg-slate-700 px-6 py-3 rounded-lg">
              <span className="text-gray-300 font-semibold">Digital Agency</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;