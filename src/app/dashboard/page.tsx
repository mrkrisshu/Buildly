'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';
import { 
  Sparkles, 
  Code, 
  Eye, 
  Download, 
  Settings, 
  LogOut, 
  User, 
  Wand2, 
  Loader2,
  FileText,
  Globe,
  Palette,
  Crown
} from 'lucide-react';
import PricingModal from '@/components/PricingModal';

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'preview'>('prompt');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const generateWebsite = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate website');
      }

      const data = await response.json();
      setGeneratedCode(data.code);
      setActiveTab('code');
    } catch (error) {
      console.error('Error generating website:', error);
      alert('Failed to generate website. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass border-b border-white/20 dark:border-slate-700/50 p-6"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold gradient-text"
            >
              Buildly
            </motion.div>
            <div className="text-slate-600 dark:text-slate-400">Dashboard</div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPricingModal(true)}
              className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
            >
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Upgrade</span>
            </motion.button>
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
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Prompt Input */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <Wand2 className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                AI Website Generator
              </h2>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Describe your website
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Create a modern portfolio website for a web developer with a dark theme, hero section, about me, projects gallery, and contact form..."
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateWebsite}
                disabled={!prompt.trim() || isGenerating}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Website
                  </>
                )}
              </motion.button>
            </div>

            {/* Quick Templates */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Quick Templates
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { icon: Globe, label: 'Business Landing', prompt: 'Create a professional business landing page with hero section, services, testimonials, and contact form' },
                  { icon: User, label: 'Portfolio Site', prompt: 'Build a creative portfolio website for a designer with project gallery, about section, and contact page' },
                  { icon: Palette, label: 'Creative Agency', prompt: 'Design a modern creative agency website with bold visuals, team section, and project showcase' }
                ].map((template, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setPrompt(template.prompt)}
                    className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-blue-500/10 transition-all duration-300 text-left"
                  >
                    <template.icon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {template.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Middle Panel - Tabs */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:col-span-2 glass-card flex flex-col"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {[
                { id: 'prompt', label: 'Instructions', icon: FileText },
                { id: 'code', label: 'Generated Code', icon: Code },
                { id: 'preview', label: 'Live Preview', icon: Eye }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6">
              {activeTab === 'prompt' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center text-center"
                >
                  <div>
                    <Wand2 className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Ready to Create?
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      Enter your website description and click "Generate Website" to get started.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'code' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col"
                >
                  {generatedCode ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          Generated HTML Code
                        </h3>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setGeneratedCode(generatedCode)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Code className="w-4 h-4" />
                            Apply Changes
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={downloadCode}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </motion.button>
                        </div>
                      </div>
                      <div className="flex-1 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <MonacoEditor
                          height="100%"
                          defaultLanguage="html"
                          value={generatedCode}
                          onChange={(value) => setGeneratedCode(value || '')}
                          theme={isDarkMode ? 'vs-dark' : 'light'}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                            folding: true,
                            lineDecorationsWidth: 10,
                            lineNumbersMinChars: 3,
                            glyphMargin: false,
                            contextmenu: true,
                            selectOnLineNumbers: true,
                            matchBrackets: 'always',
                            autoIndent: 'full',
                            formatOnPaste: true,
                            formatOnType: true
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <Code className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          No Code Generated Yet
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                          Generate a website first to see the code here.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'preview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col"
                >
                  {generatedCode ? (
                    <div className="flex-1 bg-white rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <iframe
                        srcDoc={generatedCode}
                        className="w-full h-full"
                        title="Website Preview"
                      />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <Eye className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          No Preview Available
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                          Generate a website first to see the preview here.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
    </div>
  );
}