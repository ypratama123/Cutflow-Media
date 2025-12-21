import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ProblemSolution = () => {
  const problems = [
    "Tidak ada waktu untuk edit banyak clips",
    "Sulit track progress editing",
    "Revisi memakan waktu lama",
    "Kualitas tidak konsisten"
  ];

  const solutions = [
    "Tim editor profesional siap membantu",
    "Dashboard real-time tracking",
    "Unlimited revisions (paket Pro+)",
    "Quality assurance setiap project"
  ];

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
          >
            <div className="flex items-center mb-6">
              <AlertCircle className="text-red-500 mr-4" size={32} />
              <h3 className="card-title text-white">Masalah Content Creator</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((problem, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start text-gray-300"
                >
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  {problem}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
          >
            <div className="flex items-center mb-6">
              <CheckCircle className="text-green-500 mr-4" size={32} />
              <h3 className="card-title text-white">Solusi CUTFLOW</h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start text-gray-300"
                >
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                  {solution}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;