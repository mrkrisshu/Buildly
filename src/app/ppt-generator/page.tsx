'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Presentation, Download, Sparkles, FileText, Wand2, Palette } from 'lucide-react';
import PptxGenJS from 'pptxgenjs';
import { useAuth } from '@/contexts/AuthProvider';
import PricingModal from '@/components/PricingModal';

interface Slide {
  title: string;
  content: string[];
  notes?: string;
  image?: {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    photographer_id: number;
    avg_color: string;
    src: {
      original: string;
      large2x: string;
      large: string;
      medium: string;
      small: string;
      portrait: string;
      landscape: string;
      tiny: string;
    };
    liked: boolean;
    alt: string;
  };
}

interface PPTData {
  title: string;
  slides: Slide[];
}

interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const colorThemes: ColorTheme[] = [
  {
    name: 'Professional Blue',
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#3b82f6',
    background: '#ffffff',
    text: '#1f2937'
  },
  {
    name: 'Modern Purple',
    primary: '#7c3aed',
    secondary: '#5b21b6',
    accent: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937'
  },
  {
    name: 'Corporate Green',
    primary: '#059669',
    secondary: '#047857',
    accent: '#10b981',
    background: '#ffffff',
    text: '#1f2937'
  },
  {
    name: 'Elegant Red',
    primary: '#dc2626',
    secondary: '#b91c1c',
    accent: '#ef4444',
    background: '#ffffff',
    text: '#1f2937'
  },
  {
    name: 'Dark Theme',
    primary: '#3b82f6',
    secondary: '#2563eb',
    accent: '#60a5fa',
    background: '#1f2937',
    text: '#f9fafb'
  }
];

export default function PPTGenerator() {
  const { user, isPro } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pptData, setPptData] = useState<PPTData | null>(null);
  const [error, setError] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(colorThemes[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [imageError, setImageError] = useState<string>('');
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Check for system dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleGenerate = async () => {
    if (!user) {
      setError('Please sign in to use the PPT generator.');
      return;
    }

    if (!isPro) {
      setShowPricingModal(true);
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a topic or description for your presentation');
      return;
    }

    setIsGenerating(true);
    setError('');
    setImageError('');
    setPptData(null);

    try {
      const response = await fetch('/api/generate-ppt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          apiKey: apiKey.trim() || undefined,
          colorTheme: selectedTheme,
          isDarkMode,
          includeImages: true
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate presentation');
      }

      setPptData(data.pptData);
      
      // Check for image-related warnings
      if (data.pptData.slides.some((slide: Slide) => slide.image === undefined)) {
        const slidesWithoutImages = data.pptData.slides.filter((slide: Slide, index: number) => 
          index > 0 && !slide.title.toLowerCase().includes('introduction') && 
          !slide.title.toLowerCase().includes('welcome') && 
          !slide.title.toLowerCase().includes('agenda') && 
          slide.image === undefined
        ).length;
        
        if (slidesWithoutImages > 0) {
          setImageError(`Note: ${slidesWithoutImages} slide(s) could not be enhanced with images. This may be due to API limits or content restrictions.`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the presentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPPT = async () => {
    if (!pptData) return;

    try {
      // Create a new presentation
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'PPT Generator';
      pptx.company = 'AI Generated';
      pptx.title = pptData.title;
      
      // Apply theme colors
      const theme = isDarkMode ? colorThemes[4] : selectedTheme; // Use dark theme if dark mode is on
      
      // Title slide
      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: theme.background };
      
      titleSlide.addText(pptData.title, {
        x: 0.5,
        y: 2,
        w: 9,
        h: 2,
        fontSize: 44,
        color: theme.primary,
        bold: true,
        align: 'center',
        fontFace: 'Arial'
      });
      
      titleSlide.addText('Generated with AI', {
        x: 0.5,
        y: 4.5,
        w: 9,
        h: 1,
        fontSize: 24,
        color: theme.secondary,
        align: 'center',
        fontFace: 'Arial'
      });
      
      // Content slides
      pptData.slides.forEach((slide, index) => {
        const contentSlide = pptx.addSlide();
        contentSlide.background = { color: theme.background };
        
        // Slide title
        contentSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          fontSize: 32,
          color: theme.primary,
          bold: true,
          fontFace: 'Arial'
        });
        
        // Add image if available
        if (slide.image) {
          try {
            contentSlide.addImage({
              path: slide.image.src.large,
              x: 5.5,
              y: 1.5,
              w: 4,
              h: 3,
              sizing: { type: 'contain', w: 4, h: 3 }
            });
          } catch (error) {
            console.error('Error adding image to slide:', error);
          }
        }
        
        // Content bullets - adjust position if image is present
        const bulletText = slide.content.map(point => `• ${point}`).join('\n');
        contentSlide.addText(bulletText, {
          x: 0.5,
          y: 1.8,
          w: slide.image ? 4.5 : 9, // Reduce width if image is present
          h: 5,
          fontSize: 18,
          color: theme.text,
          fontFace: 'Arial',
          lineSpacing: 24
        });
        
        // Speaker notes
        if (slide.notes) {
          contentSlide.addNotes(slide.notes);
        }
        
        // Add slide number
        contentSlide.addText(`${index + 1}`, {
          x: 9.2,
          y: 6.8,
          w: 0.5,
          h: 0.3,
          fontSize: 12,
          color: theme.secondary,
          align: 'center',
          fontFace: 'Arial'
        });
      });
      
      // Save the presentation
      const fileName = `${pptData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`;
      await pptx.writeFile({ fileName });
      
    } catch (error) {
      console.error('Error generating PPTX:', error);
      setError('Failed to generate PPTX file. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Web3 Background with grid and gradients */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/5 rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
            >
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              PPT Generator
            </h1>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            </motion.div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto px-4"
          >
            Create professional presentations instantly using AI. Just describe your topic and get a complete slide deck.
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </motion.div>
                Generate Presentation
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Presentation Topic
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your presentation topic... e.g., 'Introduction to Machine Learning for beginners' or 'Marketing strategies for small businesses'"
                    className="w-full h-24 sm:h-32 px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 text-sm sm:text-base"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Gemini API Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key (optional)"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    disabled={isGenerating}
                  />
                  <p className="text-xs mt-1 text-white/60">
                    Leave empty to use the default API key
                  </p>
                </div>

                {/* Color Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    <Palette className="w-4 h-4 inline mr-1" />
                    Color Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {colorThemes.slice(0, 4).map((theme, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTheme(theme)}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                          selectedTheme.name === theme.name
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-white/20 hover:border-white/30'
                        }`}
                        disabled={isGenerating}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: theme.primary }}
                          ></div>
                          <span className="text-xs sm:text-sm text-white/80 truncate">
                            {theme.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className={`p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-red-900/20 border-red-800 text-red-300' 
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {imageError && (
                  <div className={`p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-yellow-900/20 border-yellow-800 text-yellow-300' 
                      : 'bg-yellow-50 border-yellow-200 text-yellow-600'
                  }`}>
                    <p className="text-sm">{imageError}</p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                    isGenerating || !prompt.trim()
                      ? isDarkMode 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Presentation
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </motion.div>
                Preview
              </h2>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-start gap-2 sm:gap-3"
                >
                  <span className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5">⚠</span>
                  <span className="text-sm sm:text-base">{error}</span>
                </motion.div>
              )}

              {imageError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 flex items-start gap-2 sm:gap-3"
                >
                  <span className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5">⚠</span>
                  <span className="text-sm sm:text-base">{imageError}</span>
                </motion.div>
              )}

              {isGenerating ? (
                <div className="flex items-center justify-center h-48 sm:h-64">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-3 sm:mb-4"
                    />
                    <p className="text-slate-300 text-sm sm:text-base">Creating your presentation...</p>
                  </div>
                </div>
              ) : pptData ? (
                <div className="space-y-4 sm:space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"
                  >
                    <h3 className="text-lg sm:text-2xl font-bold text-blue-400 mb-1 sm:mb-2">{pptData.title}</h3>
                    <p className="text-slate-300 text-sm sm:text-base">{pptData.slides.length} slides generated</p>
                  </motion.div>

                  <div className="max-h-80 sm:max-h-96 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2">
                    {pptData.slides.map((slide, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/30 transition-all duration-300"
                      >
                        <h4 className="font-semibold text-base sm:text-lg text-blue-300 mb-2 sm:mb-3">
                          Slide {index + 1}: {slide.title}
                        </h4>
                        
                        {slide.image && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-3 sm:mb-4"
                          >
                            <Image
                              src={slide.image.src.small}
                              alt={slide.image.alt}
                              width={300}
                              height={128}
                              className="w-full h-24 sm:h-32 object-cover rounded-lg border border-white/20"
                              onError={(e) => {
                                console.error('Failed to load image:', slide.image?.src.small);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <p className="text-xs text-slate-400 mt-1 sm:mt-2">
                              Photo by {slide.image.photographer}
                            </p>
                          </motion.div>
                        )}
                        
                        <ul className="space-y-1 sm:space-y-2">
                          {slide.content.map((point, pointIndex) => (
                            <motion.li
                              key={pointIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * pointIndex }}
                              className="text-slate-300 flex items-start gap-2 text-sm sm:text-base"
                            >
                              <span className="text-blue-400 mt-1 text-xs sm:text-sm">•</span>
                              {point}
                            </motion.li>
                          ))}
                        </ul>
                        {slide.notes && (
                          <div className="mt-2 p-2 bg-white/5 rounded text-xs text-slate-400">
                            <strong>Notes:</strong> {slide.notes}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadPPT}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 shadow-lg transition-all duration-300"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Download PowerPoint
                  </motion.button>
                </div>
              ) : (
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center py-8 sm:py-12 text-slate-400"
                >
                  <Presentation className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                  <p className="text-sm sm:text-base">Enter a topic above to generate your presentation</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 sm:mt-16 text-center py-6 sm:py-8 border-t border-white/10"
      >
        <p className="text-slate-400 text-xs sm:text-sm">
          Developed by <span className="text-blue-400 font-semibold">Krishna</span>
        </p>
      </motion.footer>
      
      {showPricingModal && (
        <PricingModal 
          isOpen={showPricingModal} 
          onClose={() => setShowPricingModal(false)} 
        />
      )}
    </div>
  );
}