'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown, Sparkles } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userId?: string;
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out our AI website builder',
    features: [
      '3 website generations per month',
      'Basic templates',
      'Standard support',
      'Download HTML/CSS'
    ],
    priceId: null,
    popular: false,
    color: 'from-slate-500 to-slate-600'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹299',
    period: '/month',
    description: 'For professionals who need more power',
    features: [
      'Unlimited website generations',
      'Premium templates',
      'Advanced customization',
      'Priority support',
      'Custom domains',
      'SEO optimization'
    ],
    priceId: 'price_pro_monthly',
    popular: true,
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'White-label solutions',
      'API access',
      'Custom integrations',
      'Dedicated support'
    ],
    priceId: 'price_enterprise_monthly',
    popular: false,
    color: 'from-purple-500 to-pink-600'
  }
];

export default function PricingModal({ isOpen, onClose, userEmail, userId }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      // Free plan - just close modal
      onClose();
      return;
    }

    setLoading(priceId);

    try {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        // Demo mode
        alert(`${planName} plan selected! (Demo mode - Stripe not configured)`);
        onClose();
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Choose Your Plan
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Unlock the full potential of AI website generation
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-2xl p-6 border-2 transition-all duration-300 ${
                      plan.popular
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                        {plan.id === 'free' && <Sparkles className="w-6 h-6 text-white" />}
                        {plan.id === 'pro' && <Zap className="w-6 h-6 text-white" />}
                        {plan.id === 'enterprise' && <Crown className="w-6 h-6 text-white" />}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {plan.description}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubscribe(plan.priceId, plan.name)}
                      disabled={loading === plan.priceId}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === plan.priceId ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : plan.id === 'free' ? (
                        'Current Plan'
                      ) : (
                        'Subscribe Now'
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}