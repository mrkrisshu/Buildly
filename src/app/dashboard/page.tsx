'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Settings, 
  Download, 
  Copy, 
  Check, 
  Eye, 
  Code, 
  FileText, 
  Monitor, 
  Tablet, 
  Smartphone,
  LogOut,
  Key,
  Globe,
  Save,
  Zap,
  Sparkles,
  Building2,
  User,
  ShoppingCart,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import MonacoEditor from '@monaco-editor/react';
import PricingModal from '@/components/PricingModal';
import TemplateLibrary from '@/components/TemplateLibrary';
import AdvancedCustomization from '@/components/AdvancedCustomization';

type ViewMode = 'desktop' | 'tablet' | 'mobile';
type ResultTab = 'preview' | 'code' | 'files';
type Mode = 'input' | 'generating' | 'results';

interface MultiPageData {
  pages: Record<string, string>;
  navigation: string[];
}

interface QuickTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  category: string;
}

const quickTemplates: QuickTemplate[] = [
  {
    id: 'business-landing',
    name: 'Business Landing',
    description: 'Professional business website',
    icon: <Building2 className="w-6 h-6" />,
    prompt: 'Create a professional business landing page with hero section, services, testimonials, and contact form',
    category: 'business'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Personal portfolio website',
    icon: <User className="w-6 h-6" />,
    prompt: 'Design a creative portfolio website with project gallery, about section, and contact information',
    category: 'portfolio'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Online store website',
    icon: <ShoppingCart className="w-6 h-6" />,
    prompt: 'Build an e-commerce website with product catalog, shopping cart, and checkout process',
    category: 'ecommerce'
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Personal or company blog',
    icon: <FileText className="w-6 h-6" />,
    prompt: 'Create a modern blog website with article listings, categories, and reading experience',
    category: 'blog'
  }
];

export default function Dashboard() {
  const { user, signOut, isPro } = useAuth();
  const router = useRouter();
  
  // UI State
  const [mode, setMode] = useState<Mode>('input');
  const [activeResultTab, setActiveResultTab] = useState<ResultTab>('preview');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [copied, setCopied] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Input State
  const [prompt, setPrompt] = useState('');
  
  // Settings State
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isMultiPage, setIsMultiPage] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  
  // Generated Content
  const [generatedCode, setGeneratedCode] = useState('');
  const [multiPageData, setMultiPageData] = useState<MultiPageData | null>(null);
  
  // Modal States
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);

  // Load saved API key on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('geminiApiKey');
      if (savedApiKey) {
        setGeminiApiKey(savedApiKey);
        setApiKeySaved(true);
      }
    }
  }, []);

  // Save API key to localStorage
  const saveApiKey = () => {
    if (typeof window !== 'undefined' && geminiApiKey.trim()) {
      localStorage.setItem('geminiApiKey', geminiApiKey.trim());
      setApiKeySaved(true);
      setShowApiKeyInput(false);
      setTimeout(() => setApiKeySaved(false), 3000);
    }
  };

  const generateWebsite = async (promptText: string) => {
    if (!promptText.trim()) return;
    
    if (!geminiApiKey.trim()) {
      setShowApiKeyInput(true);
      return;
    }

    setMode('generating');
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          geminiApiKey: geminiApiKey.trim(),
          isMultiPage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate website');
      }

      if (data.isMultiPage && data.website) {
        setMultiPageData(data.website);
        setGeneratedCode(data.website.pages['index.html'] || Object.values(data.website.pages)[0] as string);
      } else {
        setGeneratedCode(data.code);
      }

      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setMode('results');
      }, 1000);

    } catch (error) {
      console.error('Generation error:', error);
      clearInterval(progressInterval);
      setMode('input');
    }
  };

  const handleTemplateSelect = (template: QuickTemplate) => {
    setPrompt(template.prompt);
    generateWebsite(template.prompt);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateWebsite(prompt);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '1200px', height: '800px' };
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 flex justify-between items-center p-6 bg-black/20 backdrop-blur-xl border-b border-white/20"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Buildly Dashboard</h1>
          {user && (
            <span className="text-white/60 text-sm">Welcome, {user.email}</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* API Key Section */}
          <div className="flex items-center gap-2">
            {apiKeySaved && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg"
              >
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">API Key Saved</span>
              </motion.div>
            )}
            
            {showApiKeyInput ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <input
                  type="password"
                  placeholder="Enter Gemini API Key"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={saveApiKey}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <Key className="w-4 h-4" />
                API Key
              </button>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowCustomization(true)}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {/* Input Mode */}
          {mode === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-6 py-12"
            >
              <div className="max-w-6xl mx-auto">
                {/* Welcome Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Create Your Website with AI
                  </h2>
                  <p className="text-xl text-white/60 max-w-2xl mx-auto">
                    Choose from our quick templates or describe your vision in your own words
                  </p>
                </motion.div>

                {/* Quick Templates */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-12"
                >
                  <h3 className="text-2xl font-semibold text-white mb-6">Quick Start Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickTemplates.map((template, index) => (
                      <motion.button
                        key={template.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTemplateSelect(template)}
                        className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-left group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                            {template.icon}
                          </div>
                          <h4 className="font-semibold text-white">{template.name}</h4>
                        </div>
                        <p className="text-white/60 text-sm">{template.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Custom Prompt Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                    Or Describe Your Own Vision
                  </h3>
                  <form onSubmit={handleCustomPromptSubmit} className="space-y-6">
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the website you want to create... (e.g., 'A modern restaurant website with menu, reservations, and contact info')"
                        className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all resize-none"
                      />
                    </div>
                    
                    <div className="flex items-center justify-center gap-4">
                      <label className="flex items-center gap-2 text-white/70">
                        <input
                          type="checkbox"
                          checked={isMultiPage}
                          onChange={(e) => setIsMultiPage(e.target.checked)}
                          className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                        />
                        Multi-page website
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => setShowTemplateLibrary(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Browse Templates
                      </button>
                    </div>

                    <div className="text-center">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!prompt.trim()}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto"
                      >
                        <Wand2 className="w-5 h-5" />
                        Generate Website
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Generating Mode */}
          {mode === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-6"
                >
                  <Wand2 className="w-full h-full text-blue-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Generating Your Website
                </h2>
                <p className="text-white/60 mb-8 max-w-md">
                  Our AI is crafting your perfect website based on your description...
                </p>
                
                {/* Progress Bar */}
                <div className="w-80 mx-auto">
                  <div className="flex justify-between text-sm text-white/60 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(generationProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${generationProgress}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Mode */}
          {mode === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Results Header */}
              <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-xl border-b border-white/20">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMode('input')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Website
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'preview', label: 'Preview', icon: Eye },
                      { id: 'code', label: 'Code', icon: Code },
                      ...(multiPageData ? [{ id: 'files', label: 'Files', icon: FileText }] : [])
                    ].map((tab) => (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveResultTab(tab.id as ResultTab)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                          activeResultTab === tab.id
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'text-white/60 hover:text-white/80'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Viewport Controls */}
                  {activeResultTab === 'preview' && (
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                      {[
                        { mode: 'desktop', icon: Monitor },
                        { mode: 'tablet', icon: Tablet },
                        { mode: 'mobile', icon: Smartphone }
                      ].map((device) => (
                        <button
                          key={device.mode}
                          onClick={() => setViewMode(device.mode as ViewMode)}
                          className={`p-2 rounded transition-colors ${
                            viewMode === device.mode
                              ? 'bg-blue-500 text-white'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          <device.icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 px-6 pb-6">
                <AnimatePresence mode="wait">
                  {/* Preview Tab */}
                  {activeResultTab === 'preview' && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full flex items-center justify-center py-6"
                    >
                      <div 
                        className="bg-white rounded-lg shadow-2xl overflow-hidden"
                        style={getViewportDimensions()}
                      >
                        <iframe
                          srcDoc={generatedCode}
                          className="w-full h-full border-0"
                          title="Generated Website Preview"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Code Tab */}
                  {activeResultTab === 'code' && (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full py-6"
                    >
                      <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
                        <MonacoEditor
                          height="100%"
                          defaultLanguage="html"
                          value={generatedCode}
                          theme="vs-dark"
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on'
                          }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Files Tab */}
                  {activeResultTab === 'files' && multiPageData && (
                    <motion.div
                      key="files"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full py-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                        {/* File List */}
                        <div className="lg:col-span-1 bg-white/10 rounded-lg p-4">
                          <h3 className="text-white font-semibold mb-4">Files</h3>
                          <div className="space-y-2">
                            {Object.keys(multiPageData.pages).map((filename) => (
                              <button
                                key={filename}
                                onClick={() => {}}
                                className="w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                              >
                                {filename}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* File Content */}
                        <div className="lg:col-span-3 bg-gray-900 rounded-lg overflow-hidden">
                          <MonacoEditor
                            height="100%"
                            defaultLanguage="html"
                            value={generatedCode}
                            theme="vs-dark"
                            options={{
                              readOnly: true,
                              minimap: { enabled: false },
                              scrollBeyondLastLine: false,
                              wordWrap: 'on'
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      {showPricingModal && (
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
        />
      )}

      {showTemplateLibrary && (
        <TemplateLibrary
          isOpen={showTemplateLibrary}
          isPro={isPro}
          onClose={() => setShowTemplateLibrary(false)}
          onSelectTemplate={() => {
            setShowTemplateLibrary(false);
          }}
        />
      )}
      
      {showCustomization && (
        <AdvancedCustomization
          isOpen={showCustomization}
          onClose={() => setShowCustomization(false)}
          onApplyCustomization={() => {
            setShowCustomization(false);
          }}
          isPro={isPro}
          onUpgrade={() => setShowPricingModal(true)}
        />
      )}
    </div>
  );
}