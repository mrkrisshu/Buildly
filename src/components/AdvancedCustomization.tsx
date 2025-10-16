'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Palette, 
  Type, 
  Layout, 
  Crown,
  Check,
  RefreshCw
} from 'lucide-react';

interface AdvancedCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomization: (customization: CustomizationSettings) => void;
  isPro: boolean;
  onUpgrade: () => void;
}

export interface CustomizationSettings {
  colorScheme: string;
  fontFamily: string;
  layoutStyle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const colorSchemes = [
  { id: 'modern', name: 'Modern Dark', colors: ['#1e293b', '#3b82f6', '#06b6d4'] },
  { id: 'warm', name: 'Warm Sunset', colors: ['#fbbf24', '#f59e0b', '#dc2626'] },
  { id: 'nature', name: 'Nature Green', colors: ['#065f46', '#10b981', '#34d399'] },
  { id: 'purple', name: 'Purple Gradient', colors: ['#581c87', '#8b5cf6', '#a855f7'] },
  { id: 'ocean', name: 'Ocean Blue', colors: ['#0c4a6e', '#0284c7', '#0ea5e9'] },
  { id: 'monochrome', name: 'Monochrome', colors: ['#111827', '#6b7280', '#9ca3af'] }
];

const fontFamilies = [
  { id: 'inter', name: 'Inter', style: 'font-family: Inter, sans-serif' },
  { id: 'roboto', name: 'Roboto', style: 'font-family: Roboto, sans-serif' },
  { id: 'poppins', name: 'Poppins', style: 'font-family: Poppins, sans-serif' },
  { id: 'playfair', name: 'Playfair Display', style: 'font-family: "Playfair Display", serif' },
  { id: 'montserrat', name: 'Montserrat', style: 'font-family: Montserrat, sans-serif' },
  { id: 'lato', name: 'Lato', style: 'font-family: Lato, sans-serif' }
];

const layoutStyles = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple layout' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design with cards' },
  { id: 'classic', name: 'Classic', description: 'Traditional web layout' },
  { id: 'creative', name: 'Creative', description: 'Unique and artistic design' },
  { id: 'corporate', name: 'Corporate', description: 'Professional business style' },
  { id: 'portfolio', name: 'Portfolio', description: 'Showcase-focused layout' }
];

export default function AdvancedCustomization({
  isOpen,
  onClose,
  onApplyCustomization,
  isPro,
  onUpgrade
}: AdvancedCustomizationProps) {
  const [selectedColorScheme, setSelectedColorScheme] = useState('modern');
  const [selectedFont, setSelectedFont] = useState('inter');
  const [selectedLayout, setSelectedLayout] = useState('modern');
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#06b6d4',
    accent: '#8b5cf6'
  });

  const handleApply = () => {
    const customization: CustomizationSettings = {
      colorScheme: selectedColorScheme,
      fontFamily: selectedFont,
      layoutStyle: selectedLayout,
      primaryColor: customColors.primary,
      secondaryColor: customColors.secondary,
      accentColor: customColors.accent
    };
    onApplyCustomization(customization);
    onClose();
  };

  const resetToDefaults = () => {
    setSelectedColorScheme('modern');
    setSelectedFont('inter');
    setSelectedLayout('modern');
    setCustomColors({
      primary: '#3b82f6',
      secondary: '#06b6d4',
      accent: '#8b5cf6'
    });
  };

  if (!isPro) {
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
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Pro Feature
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Advanced customization options are available for Pro users. Upgrade to unlock color schemes, font selection, and layout options.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onUpgrade}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Upgrade to Pro
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

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
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Advanced Customization
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Customize your website's appearance
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetToDefaults}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  title="Reset to defaults"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-8">
                {/* Color Schemes */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Color Schemes
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {colorSchemes.map((scheme) => (
                      <motion.div
                        key={scheme.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedColorScheme(scheme.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedColorScheme === scheme.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex gap-2 mb-3">
                          {scheme.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {scheme.name}
                          </span>
                          {selectedColorScheme === scheme.id && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Custom Colors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customColors.primary}
                          onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                          className="w-12 h-10 rounded-lg border border-slate-300 dark:border-slate-600"
                        />
                        <input
                          type="text"
                          value={customColors.primary}
                          onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customColors.secondary}
                          onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                          className="w-12 h-10 rounded-lg border border-slate-300 dark:border-slate-600"
                        />
                        <input
                          type="text"
                          value={customColors.secondary}
                          onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customColors.accent}
                          onChange={(e) => setCustomColors(prev => ({ ...prev, accent: e.target.value }))}
                          className="w-12 h-10 rounded-lg border border-slate-300 dark:border-slate-600"
                        />
                        <input
                          type="text"
                          value={customColors.accent}
                          onChange={(e) => setCustomColors(prev => ({ ...prev, accent: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Font Families */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Font Family
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fontFamilies.map((font) => (
                      <motion.div
                        key={font.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFont(font.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedFont === font.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                              {font.name}
                            </div>
                            <div 
                              className="text-sm text-slate-600 dark:text-slate-400"
                              style={{ fontFamily: font.style.split(': ')[1] }}
                            >
                              The quick brown fox jumps
                            </div>
                          </div>
                          {selectedFont === font.id && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Layout Styles */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    Layout Style
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {layoutStyles.map((layout) => (
                      <motion.div
                        key={layout.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLayout(layout.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedLayout === layout.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {layout.name}
                          </span>
                          {selectedLayout === layout.id && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {layout.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Apply Customization
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}