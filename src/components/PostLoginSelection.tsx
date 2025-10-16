'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, X, Sparkles, Presentation } from 'lucide-react';

interface PostLoginSelectionProps {
  onClose: () => void;
}

export function PostLoginSelection({ onClose }: PostLoginSelectionProps) {
  const router = useRouter();

  const handleSelection = (path: string) => {
    onClose();
    router.push(path);
  };

  const options = [
    {
      id: 'website-builder',
      title: 'AI Website Builder',
      description: 'Create stunning, responsive websites with AI-powered design and development',
      icon: Globe,
      path: '/dashboard',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Multi-page websites',
        'Responsive design',
        'Custom components',
        'SEO optimized'
      ]
    },
    {
      id: 'ppt-maker',
      title: 'PPT Maker',
      description: 'Generate professional presentations with intelligent slide creation and design',
      icon: Presentation,
      path: '/ppt-generator',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Smart slide generation',
        'Professional themes',
        'Auto image selection',
        'Export to PowerPoint'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Welcome to Buildly</span>
          </motion.div>
          
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
          >
            What would you like to create?
          </motion.h2>
          
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Choose your creative tool and start building amazing content with AI
          </motion.p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => handleSelection(option.path)}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 rounded-2xl p-8 cursor-pointer transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${option.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <option.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {option.title}
                </h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 mb-6 transition-colors">
                  {option.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.color} mr-3`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-400 transition-colors">
                    Click to start
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 pt-6 border-t border-gray-700/50"
        >
          <p className="text-sm text-gray-400">
            You can always switch between tools from your dashboard
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}