'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeProvider';
import { useAuth } from '@/contexts/AuthProvider';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Palette, ArrowRight, Moon, Sun, LogOut, User } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import AuthModal from '@/components/AuthModal';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const router = useRouter();

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-bold gradient-text gradient-animate"
        >
          Buildly
        </motion.div>
        
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={signOut}
                    className="glass p-3 rounded-full hover:bg-red-500/10 transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAuthClick('login')}
                    className="glass px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500/10 transition-all duration-300"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAuthClick('register')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Sign Up
                  </motion.button>
                </div>
              )}
            </>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="glass p-4 rounded-full hover:scale-105 transition-all duration-300 pulse-glow"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-blue-600" />
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-6xl mx-auto z-10"
      >
        <motion.div variants={itemVariants} className="glass-card p-16 mb-12 shimmer">
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="mb-8"
          >
            <Sparkles className="w-16 h-16 mx-auto text-blue-500 mb-6" />
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-7xl font-bold mb-8 gradient-text gradient-animate"
          >
            Build Websites with AI
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-2xl text-slate-700 dark:text-slate-200 mb-12 leading-relaxed max-w-4xl mx-auto"
          >
            Transform your wildest ideas into stunning, functional websites using
            cutting-edge artificial intelligence. No coding experience required.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex gap-6 justify-center flex-wrap"
          >
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 gradient-animate"
              >
                Start Building <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAuthClick('register')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 gradient-animate"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 text-slate-800 dark:text-slate-100"
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card p-8 hover:shadow-2xl transition-all duration-300"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="mb-6"
            >
              <Sparkles className="w-12 h-12 mx-auto text-blue-500" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              AI-Powered
            </h3>
            <p className="text-slate-700 dark:text-slate-200 text-lg">
              Advanced AI generates clean, modern code tailored perfectly to your vision and requirements.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card p-8 hover:shadow-2xl transition-all duration-300"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="mb-6"
            >
              <Zap className="w-12 h-12 mx-auto text-yellow-500" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              Lightning Fast
            </h3>
            <p className="text-slate-700 dark:text-slate-200 text-lg">
              Generate complete, production-ready websites in seconds, not hours or days.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card p-8 hover:shadow-2xl transition-all duration-300"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="mb-6"
            >
              <Palette className="w-12 h-12 mx-auto text-purple-500" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              Beautiful Design
            </h3>
            <p className="text-slate-700 dark:text-slate-200 text-lg">
              Stunning, responsive designs that captivate users on any device or screen size.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-12 mt-16 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-4xl font-bold gradient-text mb-2"
            >
              10,000+
            </motion.div>
            <p className="text-slate-700 dark:text-slate-200">Websites Created</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-4xl font-bold gradient-text mb-2"
            >
              99.9%
            </motion.div>
            <p className="text-slate-700 dark:text-slate-200">Uptime</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="text-4xl font-bold gradient-text mb-2"
            >
              &lt;30s
            </motion.div>
            <p className="text-slate-700 dark:text-slate-200">Average Build Time</p>
          </div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 p-6 text-center text-slate-500 dark:text-slate-400 z-10"
      >
        <p>&copy; 2024 Buildly. Powered by AI. Built with ❤️</p>
      </motion.footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
