'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';
import { 
  Code, 
  Eye, 
  Download, 
  LogOut, 
  User, 
  Wand2, 
  Loader2,
  FileText,
  Globe,
  Palette,
  Crown,
  Key,
  Layout,
  Presentation,
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { HeroWave } from '@/components/ai-input-hero';
import PricingModal from '@/components/PricingModal';
import TemplateLibrary from '@/components/TemplateLibrary';
import AdvancedCustomization, { CustomizationSettings } from '@/components/AdvancedCustomization';

type DashboardMode = 'input' | 'generating' | 'results';
type ViewMode = 'desktop' | 'tablet' | 'mobile';
type ResultTab = 'preview' | 'code' | 'files';

export default function Dashboard() {
  const { user, signOut, loading, isPro, updateProStatus } = useAuth();
  const router = useRouter();
  
  // Core state
  const [mode, setMode] = useState<DashboardMode>('input');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // UI state
  const [activeResultTab, setActiveResultTab] = useState<ResultTab>('preview');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Settings
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizationSettings, setCustomizationSettings] = useState<CustomizationSettings | null>(null);
  const [isMultiPage, setIsMultiPage] = useState(false);
  const [multiPageData, setMultiPageData] = useState<any>(null);
  const [activeFile, setActiveFile] = useState<string>('');

  useEffect(() => {
    // Check for payment success
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      updateProStatus(true);
      alert('🎉 Welcome to Pro! You now have unlimited access to all premium features. Enjoy creating unlimited websites with advanced customization options!');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      alert('Payment was cancelled. You can upgrade to Pro anytime to unlock unlimited features.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'demo') {
      updateProStatus(true);
      alert('🎉 Welcome to Pro! You now have unlimited access to all premium features. (Demo mode - Stripe not configured)');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [updateProStatus]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const generateWebsite = async (inputPrompt: string) => {
    if (!inputPrompt.trim()) return;
    
    if (!geminiApiKey.trim()) {
      alert('Please enter your Gemini API key first.');
      setShowApiKeyInput(true);
      return;
    }
    
    setMode('generating');
    setIsGenerating(true);
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
      let enhancedPrompt = inputPrompt;
      
      if (customizationSettings) {
        enhancedPrompt += `\n\nCustomization Requirements:
        - Color Scheme: ${customizationSettings.colorScheme}
        - Font Family: ${customizationSettings.fontFamily}
        - Layout Style: ${customizationSettings.layoutStyle}
        - Primary Color: ${customizationSettings.primaryColor}
        - Secondary Color: ${customizationSettings.secondaryColor}
        - Accent Color: ${customizationSettings.accentColor}
        
        Please incorporate these design preferences into the website generation.`;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: enhancedPrompt,
          apiKey: geminiApiKey,
          isMultiPage: isMultiPage,
          customizationSettings: customizationSettings
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate website');
      }

      const data = await response.json();
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        if (data.isMultiPage && data.multiPageData && data.multiPageData.pages) {
          setMultiPageData(data.multiPageData);
          setGeneratedCode('');
          const firstFile = Object.keys(data.multiPageData.pages)[0];
          setActiveFile(firstFile);
        } else {
          setGeneratedCode(data.code);
          setMultiPageData(null);
          setActiveFile('');
        }
        
        setMode('results');
        setActiveResultTab('preview');
        
        if (data.usingFallbackKey) {
          alert(data.message || 'Generated using fallback API key');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error generating website:', error);
      alert('Failed to generate website. Please check your API key and try again.');
      setMode('input');
      clearInterval(progressInterval);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCode = () => {
    if (multiPageData) {
      import('jszip').then(({ default: JSZip }) => {
        const zip = new JSZip();
        Object.entries(multiPageData.pages).forEach(([filename, content]) => {
          zip.file(filename, content as string);
        });
        zip.generateAsync({ type: 'blob' }).then((content) => {
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'multi-page-website.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      });
    } else {
      const blob = new Blob([generatedCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-website.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'mobile': return { width: '375px', height: '667px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      default: return { width: '100%', height: '100%' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-50 p-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {mode !== 'input' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode('input')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Input
              </motion.button>
            )}
            <h1 className="text-2xl font-bold text-white">
              AI Website Generator
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {isPro && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-black text-sm font-medium">
                <Crown className="w-4 h-4" />
                Pro
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {/* Input Mode - Full Screen HeroWave */}
        {mode === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <div className="h-full flex flex-col">
              {/* Full Screen HeroWave */}
              <div className="flex-1 relative">
                <HeroWave
                  className="w-full h-full"
                  style={{ minHeight: '100vh' }}
                  title="AI Website Generator"
                  subtitle="Describe your vision and watch it come to life"
                  placeholder="Create a modern portfolio website for a web developer..."
                  buttonText={isGenerating ? "Generating..." : "Generate Website"}
                  onPromptSubmit={(value) => {
                    setPrompt(value);
                    generateWebsite(value);
                  }}
                />
                
                {/* Settings Panel */}
                <motion.div
                  initial={{ x: -400 }}
                  animate={{ x: 0 }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-80 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-6"
                >
                  {/* API Key Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white/80">
                        Gemini API Key
                      </label>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Key className="w-3 h-3" />
                        {showApiKeyInput ? 'Hide' : 'Show'}
                      </motion.button>
                    </div>
                    {showApiKeyInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <input
                          type="password"
                          value={geminiApiKey}
                          onChange={(e) => setGeminiApiKey(e.target.value)}
                          placeholder="Enter your Gemini API key..."
                          className="w-full p-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 mb-3"
                        />
                        <p className="text-xs text-white/60">
                          Get your API key from{' '}
                          <a 
                            href="https://makersuite.google.com/app/apikey" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Google AI Studio
                          </a>
                        </p>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Multi-page Toggle */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-white/60" />
                      <span className="text-sm font-medium text-white/80">
                        Multi-page Website
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsMultiPage(!isMultiPage)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        isMultiPage ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        animate={{ x: isMultiPage ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </motion.button>
                  </div>

                  {/* Quick Templates */}
                  <div>
                    <h3 className="text-sm font-medium text-white/80 mb-3">
                      Quick Templates
                    </h3>
                    <div className="space-y-2">
                      {[
                        { icon: Globe, label: 'Business Landing', prompt: 'Create a professional business landing page with hero section, services, testimonials, and contact form' },
                        { icon: User, label: 'Portfolio Site', prompt: 'Build a creative portfolio website for a designer with project gallery, about section, and contact page' },
                        { icon: Palette, label: 'Creative Agency', prompt: 'Design a modern creative agency website with bold visuals, team section, and project showcase' }
                      ].map((template, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => generateWebsite(template.prompt)}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500/10 transition-all duration-300 text-left w-full"
                        >
                          <template.icon className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-white/80">
                            {template.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
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
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
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
            className="absolute inset-0 pt-20"
          >
            <div className="h-full flex flex-col">
              {/* Tab Navigation */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-1">
                  {[
                    { id: 'preview', label: 'Live Preview', icon: Eye },
                    { id: 'code', label: 'Generated Code', icon: Code },
                    { id: 'files', label: 'Files', icon: FileText }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
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
                      className="h-full"
                    >
                      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 h-full flex flex-col">
                        {/* Preview Controls */}
                        <div className="flex justify-between items-center p-4 border-b border-white/20">
                          <div className="flex items-center gap-2">
                            {[
                              { mode: 'desktop', icon: Monitor, label: 'Desktop' },
                              { mode: 'tablet', icon: Tablet, label: 'Tablet' },
                              { mode: 'mobile', icon: Smartphone, label: 'Mobile' }
                            ].map((device) => (
                              <motion.button
                                key={device.mode}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setViewMode(device.mode as ViewMode)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                                  viewMode === device.mode
                                    ? 'bg-blue-500 text-white'
                                    : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                                }`}
                              >
                                <device.icon className="w-4 h-4" />
                                <span className="text-sm">{device.label}</span>
                              </motion.button>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={downloadCode}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* Preview Frame */}
                        <div className="flex-1 p-4 flex items-center justify-center">
                          <motion.div
                            animate={getViewportDimensions()}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg shadow-2xl overflow-hidden"
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%',
                              aspectRatio: viewMode === 'mobile' ? '9/16' : viewMode === 'tablet' ? '3/4' : 'auto'
                            }}
                          >
                            <iframe
                              srcDoc={generatedCode}
                              className="w-full h-full border-0"
                              title="Website Preview"
                            />
                          </motion.div>
                        </div>
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
                      className="h-full"
                    >
                      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 h-full flex flex-col">
                        {/* Code Controls */}
                        <div className="flex justify-between items-center p-4 border-b border-white/20">
                          <h3 className="text-lg font-semibold text-white">
                            Generated Code
                          </h3>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Code'}
                          </motion.button>
                        </div>
                        
                        {/* Code Editor */}
                        <div className="flex-1">
                          <MonacoEditor
                            height="100%"
                            language="html"
                            value={generatedCode}
                            onChange={(value) => setGeneratedCode(value || '')}
                            theme="vs-dark"
                            options={{
                              minimap: { enabled: false },
                              fontSize: 14,
                              wordWrap: 'on',
                              automaticLayout: true,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Files Tab */}
                  {activeResultTab === 'files' && (
                    <motion.div
                      key="files"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full"
                    >
                      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 h-full p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Project Files
                        </h3>
                        {multiPageData ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.keys(multiPageData.pages).map((filename) => (
                              <motion.div
                                key={filename}
                                whileHover={{ scale: 1.02 }}
                                className="p-4 bg-white/5 rounded-lg border border-white/20 cursor-pointer hover:bg-white/10 transition-all"
                                onClick={() => setActiveFile(filename)}
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-blue-400" />
                                  <span className="text-white font-medium">{filename}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-white/60">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Single HTML file generated</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showPricingModal && (
        <PricingModal onClose={() => setShowPricingModal(false)} />
      )}
      
      {showTemplateLibrary && (
        <TemplateLibrary 
          onClose={() => setShowTemplateLibrary(false)}
          onSelectTemplate={(template) => {
            setPrompt(template.prompt);
            setShowTemplateLibrary(false);
          }}
        />
      )}
      
      {showCustomization && (
        <AdvancedCustomization
          onClose={() => setShowCustomization(false)}
          onSave={(settings) => {
            setCustomizationSettings(settings);
            setShowCustomization(false);
          }}
          currentSettings={customizationSettings}
        />
      )}
    </div>
  );
}