'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      } else if (mode === 'register') {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Check your email to confirm your account!');
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Password reset email sent!');
        }
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">
                {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {mode === 'login' 
                  ? 'Sign in to your account' 
                  : mode === 'register' 
                  ? 'Join Buildly today' 
                  : 'Enter your email to reset password'
                }
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4"
              >
                <p className="text-red-500 text-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4"
              >
                <p className="text-green-500 text-sm">{success}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-500"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-500"
                  required
                />
              </div>

              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Email'}
              </motion.button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {mode === 'login' && (
                <>
                  <button
                    onClick={() => setMode('forgot')}
                    className="text-blue-500 hover:text-blue-400 text-sm transition-colors"
                  >
                    Forgot your password?
                  </button>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('register')}
                      className="text-blue-500 hover:text-blue-400 font-semibold transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </>
              )}

              {mode === 'register' && (
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-blue-500 hover:text-blue-400 font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              )}

              {mode === 'forgot' && (
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-500 hover:text-blue-400 text-sm transition-colors"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}