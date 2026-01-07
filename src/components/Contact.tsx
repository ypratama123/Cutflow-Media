import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, Instagram, Twitter, Linkedin, Send } from 'lucide-react';
import { contactService } from '../services/contactService';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
  budget: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    message: '',
    budget: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const projectTypes = [
    'Podcast',
    'Brand Content',
    'Creator Content',
    'Other'
  ];

  const budgetRanges = [
    'Under Rp 1.000.000',
    'Rp 1.000.000 - Rp 5.000.000',
    'Rp 5.000.000 - Rp 10.000.000',
    'Above Rp 10.000.000'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message || formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await contactService.submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        project_type: formData.projectType || null,
        budget_range: formData.budget || null,
        message: formData.message,
        status: 'new'
      });

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        message: '',
        budget: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (isSuccess) {
    return (
      <section id="contact" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-slate-800/50 backdrop-blur-sm p-12 rounded-xl border border-slate-700 max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="text-white" size={32} />
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text mb-4 font-heading">Pesan Terkirim!</h3>
            <p className="text-gray-300 mb-6">
              Terima kasih telah menghubungi kami. Tim kami akan segera merespons dalam 24 jam.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="btn-primary"
            >
              Kirim Pesan Lain
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="section-title">
            <span className="gradient-text">Hubungi Kami</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Siap memulai project Anda? Mari diskusikan kebutuhan Anda
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-heading font-semibold mb-2 text-base md:text-lg">
                    Nama *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-600 ${errors.name ? 'border-red-500' : 'border-slate-600'
                      }`}
                    placeholder="Nama lengkap"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-600 ${errors.email ? 'border-red-500' : 'border-slate-600'
                      }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="+62 812-3456-7890"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="Nama perusahaan"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Project Type
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
                  >
                    <option value="">Pilih tipe project</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
                  >
                    <option value="">Pilih budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-600 resize-none ${errors.message ? 'border-red-500' : 'border-slate-600'
                    }`}
                  placeholder="Ceritakan tentang project Anda..."
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>

              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="text-pink-600 mr-4" size={24} />
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-300">hello@cutflowmedia.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="text-pink-600 mr-4" size={24} />
                  <div>
                    <p className="text-white font-semibold">WhatsApp</p>
                    <p className="text-gray-300">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="text-pink-600 mr-4" size={24} />
                  <div>
                    <p className="text-white font-semibold">Working Hours</p>
                    <p className="text-gray-300">Senin-Jumat, 09:00-18:00 WIB</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-700">
                <p className="text-white font-semibold mb-4">Follow Us</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-pink-600 transition-colors">
                    <Instagram size={24} />
                  </a>
                  <a href="#" className="text-gray-300 hover:text-pink-600 transition-colors">
                    <Twitter size={24} />
                  </a>
                  <a href="#" className="text-gray-300 hover:text-pink-600 transition-colors">
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Response Promise */}
            <div className="bg-gradient-to-r from-pink-600/20 to-cyan-600/20 p-6 rounded-xl border border-pink-600/30">
              <h4 className="text-white font-semibold mb-2">Quick Response Guarantee</h4>
              <p className="text-gray-300 text-sm">
                Kami berkomitmen merespons setiap inquiry dalam 24 jam.
                Untuk urgent project, hubungi langsung via WhatsApp.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;