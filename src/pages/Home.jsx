import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpenIcon, HeartIcon, UserGroupIcon, ShieldCheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Multimedia from '../components/Multimedia';
import Connectfamilytree from '../components/Connectfamilytree';
import Testimonial from '../components/Testimonial';
import { MapPinIcon, PhoneIcon } from 'lucide-react';


const features = [
  {
    icon: <BookOpenIcon className="h-8 w-8" />,
    title: 'Create Memory Vaults',
    description: 'Store and organize your precious memories in beautifully crafted digital vaults.'
  },
  {
    icon: <HeartIcon className="h-8 w-8" />,
    title: 'Share with Loved Ones',
    description: 'Invite family and friends to contribute and relive memories together.'
  },
  {
    icon: <UserGroupIcon className="h-8 w-8" />,
    title: 'Collaborative Stories',
    description: 'Build a collective narrative with shared photos, videos, and audio memories.'
  },
  {
    icon: <ShieldCheckIcon className="h-8 w-8" />,
    title: 'Secure & Private',
    description: 'Your memories are protected with state-of-the-art security measures.'
  }
];

function Home() {
  return (
    <div className="min-h-screen bg-vintage-50 ">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <motion.div
          initial={{ opacity: 0, z: 20 }}
          animate={{ opacity: 1, z: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-br from-vintage-900 via-sepia-900 to-vintage-800">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sepia-200 via-transparent to-transparent" />
        </motion.div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-vintage font-bold text-white mb-6">
              Preserve Your Legacy,
              <br />
              <span className="text-sepia-200">One Memory at a Time</span>
            </h1>
            <p className="text-xl text-vintage-100 mb-8 leading-relaxed">
              Create beautiful digital vaults to store, share, and cherish your most precious memories
              with family and friends. Build your legacy today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3"
              >
                Start Your Legacy
              </Link>
              <Link
                to="/login"
                className="btn-secondary bg-white/10 hover:bg-white/20 text-white text-lg px-8 py-3"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="vintage-title text-4xl mb-4">Why Choose LegacyVault?</h2>
            <p className="handwritten-text text-2xl text-vintage-600">
              The perfect place for your memories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-block p-3 rounded-full bg-sepia-100 text-sepia-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-vintage font-semibold text-vintage-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-vintage-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <Multimedia></Multimedia>
      <Connectfamilytree></Connectfamilytree>
      <Testimonial></Testimonial>
      {/* CTA Section */}
      <section className="py-20 bg-sepia-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="vintage-title text-4xl mb-4">
              Start Preserving Your Memories Today
            </h2>
            <p className="text-xl text-vintage-600 mb-8">
              Join thousands of families who trust LegacyVault to preserve their precious memories
              for generations to come.
            </p>
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3"
            >
              Create Your Free Account
            </Link>
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      {/* Footer */}
      <footer className="bg-vintage-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="flex items-center space-x-2 mb-4">
                <BookOpenIcon className="h-8 w-8 text-sepia-400" />
                <span className="font-vintage text-2xl">LegacyVault</span>
              </div>
              <p className="text-vintage-300 text-center md:text-left mb-4">
                Preserving your family's legacy for generations to come.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-vintage-300 hover:text-sepia-300 transition-colors"
                    aria-label={social}
                  >
                    <div className="h-8 w-8 rounded-full bg-vintage-800 flex items-center justify-center">
                      <span className="text-sm">{social.charAt(0)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-vintage text-lg font-semibold mb-4 text-sepia-300">Quick Links</h3>
              <ul className="space-y-2">
                {['About Us', 'Features', 'Pricing', 'Testimonials', 'Blog'].map((link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase().replace(' ', '-')}`}
                      className="text-vintage-300 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-vintage text-lg font-semibold mb-4 text-sepia-300">Resources</h3>
              <ul className="space-y-2">
                {['Help Center', 'Memory Tips', 'Family History Guide', 'Privacy Policy', 'Terms of Service'].map((link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase().replace(' ', '-')}`}
                      className="text-vintage-300 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="font-vintage text-lg font-semibold mb-4 text-sepia-300">Contact Us</h3>
              <ul className="space-y-3 text-vintage-300">
                <li className="flex items-start">
                  <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 text-sepia-400" />
                  <span>123 Memory Lane, Heritage City</span>
                </li>
                <li className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-sepia-400" />
                  <a href="mailto:hello@legacyvault.com" className="hover:text-white">hello@legacyvault.com</a>
                </li>
                <li className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-sepia-400" />
                  <a href="tel:+11234567890" className="hover:text-white">+1 (123) 456-7890</a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-vintage-800 mb-8"></div>

          {/* Copyright and Legal */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-center text-vintage-400 text-sm"
          >
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} LegacyVault. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 