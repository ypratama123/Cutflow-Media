import { motion } from 'framer-motion';
import { Upload, Clock, Eye, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const Workflow = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: Upload,
      title: "UPLOADED",
      description: "Video diterima dari klien",
      color: "bg-blue-600",
      textColor: "text-blue-600",
      gradient: "from-blue-500 to-blue-700",
      details: "File video Anda langsung masuk ke sistem kami dan siap diproses"
    },
    {
      icon: Clock,
      title: "IN PROGRESS",
      description: "Sedang dikerjakan clipper",
      color: "bg-yellow-600",
      textColor: "text-yellow-600",
      gradient: "from-yellow-500 to-orange-600",
      details: "Tim editor profesional mulai mengerjakan clips sesuai brief Anda"
    },
    {
      icon: Eye,
      title: "REVIEW",
      description: "Menunggu penilaian",
      color: "bg-purple-600",
      textColor: "text-purple-600",
      gradient: "from-purple-500 to-purple-700",
      details: "Hasil editing siap untuk review dan feedback dari Anda"
    },
    {
      icon: RefreshCw,
      title: "REVISION",
      description: "Proses perbaikan",
      color: "bg-orange-600",
      textColor: "text-orange-600",
      gradient: "from-orange-500 to-red-600",
      details: "Perbaikan berdasarkan feedback untuk hasil yang sempurna"
    },
    {
      icon: CheckCircle,
      title: "COMPLETED",
      description: "Selesai & siap publish",
      color: "bg-green-600",
      textColor: "text-green-600",
      gradient: "from-green-500 to-emerald-600",
      details: "Video clips siap dipublish di platform media sosial Anda"
    }
  ];

  return (
    <section id="workflow" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="section-title">
            <span className="gradient-text">Track Progress Real-Time</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Dashboard sederhana untuk monitor setiap tahap editing
          </p>
        </motion.div>

        {/* Modern Interactive Workflow */}
        <div className="relative">
          {/* Desktop Layout - Curved Path */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Animated Background Path */}
              <svg className="absolute inset-0 w-full h-64" viewBox="0 0 1200 200" fill="none">
                <motion.path
                  d="M50 100 Q300 50 600 100 T1150 100"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  viewport={{ once: true }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Step Cards */}
              <div className="relative z-10 flex justify-between items-start pt-8">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  const isActive = activeStep === index;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="flex flex-col items-center max-w-48 cursor-pointer group"
                      onMouseEnter={() => setActiveStep(index)}
                    >
                      {/* Icon Circle */}
                      <motion.div
                        className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent className="text-white" size={28} />
                        
                        {/* Pulse Animation */}
                        <motion.div
                          className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.gradient} opacity-30`}
                          animate={isActive ? { scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      {/* Step Info Card */}
                      <motion.div
                        className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 text-center group-hover:border-slate-600 transition-all duration-300"
                        whileHover={{ y: -5 }}
                      >
                        <div className={`inline-block px-3 py-1 bg-gradient-to-r ${step.gradient} rounded-full text-white font-semibold text-xs mb-2`}>
                          {step.title}
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                        
                        {/* Expandable Details */}
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={isActive ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-400 text-xs leading-relaxed pt-2 border-t border-slate-700">
                            {step.details}
                          </p>
                        </motion.div>
                      </motion.div>

                      {/* Step Number */}
                      <div className="mt-3 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Layout - Vertical Timeline */}
          <div className="lg:hidden">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-600 via-purple-600 to-cyan-600 rounded-full"></div>
              
              <div className="space-y-8">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative flex items-start"
                    >
                      {/* Icon */}
                      <motion.div
                        className={`relative z-10 w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <IconComponent className="text-white" size={20} />
                      </motion.div>

                      {/* Content Card */}
                      <motion.div
                        className="ml-6 flex-1 bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700"
                        whileHover={{ x: 5 }}
                      >
                        <div className={`inline-block px-3 py-1 bg-gradient-to-r ${step.gradient} rounded-full text-white font-semibold text-xs mb-2`}>
                          {step.title}
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                        <p className="text-gray-400 text-xs">{step.details}</p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Progress Examples */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {/* Live Project Example */}
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold font-heading">Live Project</h4>
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full text-white text-xs font-semibold">
                IN PROGRESS
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Podcast Episode #123</span>
              <span className="text-yellow-500 font-semibold">65%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
              <motion.div 
                className="bg-gradient-to-r from-yellow-500 to-orange-600 h-3 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '65%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>
            <p className="text-gray-400 text-sm">Estimated completion: 2 hours</p>
          </div>

          {/* Completed Project Example */}
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold font-heading">Recent Completion</h4>
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white text-xs font-semibold">
                COMPLETED
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">YouTube Shorts Series</span>
              <span className="text-green-500 font-semibold">100%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
              <motion.div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                viewport={{ once: true }}
              />
            </div>
            <p className="text-gray-400 text-sm">Delivered 2 hours early ⚡</p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-6">
            Ingin melihat workflow ini bekerja untuk project Anda?
          </p>
          <button
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            Mulai Project <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Workflow;