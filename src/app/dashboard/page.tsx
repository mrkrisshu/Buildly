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
  Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { HeroWave } from '@/components/ai-input-hero';
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

export default function Dashboard() {
  const { user, signOut, isPro } = useAuth();
  const router = useRouter();
  
  // UI State
  const [mode, setMode] = useState<Mode>('input');
  const [activeResultTab, setActiveResultTab] = useState<ResultTab>('preview');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [copied, setCopied] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
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

  const generateWebsite = async (prompt: string) => {
    if (!prompt.trim()) return;
    
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated content
      const mockHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated Website</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .container { max-width: 1200px; margin: 0 auto; }
            h1 { font-size: 3rem; text-align: center; margin-bottom: 2rem; }
            .content { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 10px; backdrop-filter: blur(10px); }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Your AI Generated Website</h1>
            <div class="content">
              <p>This is a beautiful website generated based on your prompt: "${prompt}"</p>
              <p>The website includes modern styling, responsive design, and engaging content.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      setGeneratedCode(mockHtml);
      
      if (isMultiPage) {
        setMultiPageData({
          pages: {
            'index.html': mockHtml,
            'about.html': mockHtml.replace('Your AI Generated Website', 'About Us'),
            'contact.html': mockHtml.replace('Your AI Generated Website', 'Contact Us'),
          },
          navigation: ['Home', 'About', 'Contact']
        });
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

  const downloadCode = () => {
    if (multiPageData) {
      // Create a zip file with multiple pages (simplified)
      Object.keys(multiPageData.pages).forEach(filename => {
        const element = document.createElement('a');
        const file = new Blob([multiPageData.pages[filename]], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });
    } else {
      const element = document.createElement('a');
      const file = new Blob([generatedCode], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = 'website.html';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
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
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter Gemini API Key"
                  className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 w-64"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={saveApiKey}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowApiKeyInput(false)}
                  className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  ×
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowApiKeyInput(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  geminiApiKey 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                    : 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                }`}
              >
                <Key className="w-4 h-4" />
                <span className="text-sm">
                  {geminiApiKey ? 'API Key Set' : 'Set API Key'}
                </span>
              </motion.button>
            )}
          </div>

          {/* Multi-page Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsMultiPage(!isMultiPage)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isMultiPage 
                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' 
                : 'bg-white/10 border border-white/20 text-white/60 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">Multi-page Website</span>
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowCustomization(true)}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* Sign Out */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSignOut}
            className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {/* Input Mode */}
        {mode === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pt-20"
          >
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-4xl mx-auto px-6">
                <HeroWave 
                  onPromptSubmit={generateWebsite}
                  className="w-full"
                />
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
                                onClick={() => {}}
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
        <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
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