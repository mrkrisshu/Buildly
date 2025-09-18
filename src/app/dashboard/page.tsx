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
  Crown,
  Key,
  Layout
} from 'lucide-react';
import PricingModal from '@/components/PricingModal';
import TemplateLibrary from '@/components/TemplateLibrary';
import AdvancedCustomization, { CustomizationSettings } from '@/components/AdvancedCustomization';

export default function Dashboard() {
  const { user, signOut, loading, isPro, updateProStatus } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'preview'>('prompt');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizationSettings, setCustomizationSettings] = useState<CustomizationSettings | null>(null);
  const [isMultiPage, setIsMultiPage] = useState(false);
  const [multiPageData, setMultiPageData] = useState<any>(null);
  const [activeFile, setActiveFile] = useState<string>('');

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

    // Check for payment success
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      // Show pro member welcome message and update status
      updateProStatus(true);
      alert('🎉 Welcome to Pro! You now have unlimited access to all premium features. Enjoy creating unlimited websites with advanced customization options!');
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      alert('Payment was cancelled. You can upgrade to Pro anytime to unlock unlimited features.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'demo') {
      // Show pro member welcome message and update status for demo
      updateProStatus(true);
      alert('🎉 Welcome to Pro! You now have unlimited access to all premium features. (Demo mode - Stripe not configured)');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const generateWebsite = async () => {
    if (!prompt.trim()) return;
    
    if (!geminiApiKey.trim()) {
      alert('Please enter your Gemini API key first.');
      setShowApiKeyInput(true);
      return;
    }
    
    setIsGenerating(true);
    try {
      let enhancedPrompt = prompt;
      
      // Apply customization settings to the prompt
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
      
      if (data.isMultiPage && data.multiPageData && data.multiPageData.pages) {
        setMultiPageData(data.multiPageData);
        setGeneratedCode(''); // Clear single page code
        // Set the first file as active
        const firstFile = Object.keys(data.multiPageData.pages)[0];
        setActiveFile(firstFile);
      } else {
        setGeneratedCode(data.code);
        setMultiPageData(null); // Clear multi-page data
        setActiveFile(''); // Clear active file
      }
      
      setActiveTab('code');
      
      // Show message if fallback key was used
      if (data.usingFallbackKey) {
        alert(data.message || 'Generated using fallback API key');
      }
    } catch (error) {
      console.error('Error generating website:', error);
      alert('Failed to generate website. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCode = () => {
    if (multiPageData) {
      // Create ZIP file for multi-page websites
      import('jszip').then(({ default: JSZip }) => {
        const zip = new JSZip();
        
        // Add all files to the ZIP
        Object.entries(multiPageData.pages).forEach(([filename, content]) => {
          zip.file(filename, content as string);
        });
        
        // Generate and download ZIP
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
      // Single HTML file download
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

  const deployToVercel = () => {
    if (multiPageData) {
      // For multi-page, create a GitHub repository and deploy
      alert('Multi-page deployment: Please download the ZIP file and upload it to a GitHub repository, then connect it to Vercel for deployment.');
    } else {
      // For single page, use Vercel's direct deployment
      const encodedHtml = encodeURIComponent(generatedCode);
      const vercelUrl = `https://vercel.com/new/clone?repository-url=data:text/html,${encodedHtml}`;
      window.open(vercelUrl, '_blank');
    }
  };

  const deployToNetlify = () => {
    if (multiPageData) {
      // For multi-page, create a ZIP and use Netlify Drop
      import('jszip').then(({ default: JSZip }) => {
        const zip = new JSZip();
        
        // Add all files to the ZIP
        Object.entries(multiPageData.pages).forEach(([filename, content]) => {
          zip.file(filename, content as string);
        });
        
        // Generate ZIP and open Netlify Drop
        zip.generateAsync({ type: 'blob' }).then((content) => {
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'netlify-deploy.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // Open Netlify Drop
          setTimeout(() => {
            window.open('https://app.netlify.com/drop', '_blank');
            alert('ZIP file downloaded! Drag and drop it to the Netlify Drop page that just opened.');
          }, 1000);
        });
      });
    } else {
      // For single page, create a simple deployment
      const blob = new Blob([generatedCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Open Netlify Drop
      setTimeout(() => {
        window.open('https://app.netlify.com/drop', '_blank');
        alert('HTML file downloaded! Drag and drop it to the Netlify Drop page that just opened.');
      }, 1000);
    }
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
              onClick={() => setShowTemplateLibrary(true)}
              className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-500/20 transition-all duration-300"
            >
              <Layout className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Templates</span>
            </motion.button>
            {isPro && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCustomization(true)}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-purple-500/20 transition-all duration-300"
              >
                <Palette className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Customize</span>
              </motion.button>
            )}
            {!isPro ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPricingModal(true)}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
              >
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Upgrade</span>
              </motion.button>
            ) : (
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Pro</span>
              </div>
            )}
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
              {/* Gemini API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Gemini API Key
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
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
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 mb-3"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Get your API key from{' '}
                      <a 
                        href="https://makersuite.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 underline"
                      >
                        Google AI Studio
                      </a>
                    </p>
                  </motion.div>
                )}
              </div>
              
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
              
              {/* Multi-page Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Multi-page Website
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMultiPage(!isMultiPage)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isMultiPage ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: isMultiPage ? 24 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </motion.button>
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
                  {generatedCode || multiPageData ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {multiPageData ? 'Multi-page Website Files' : 'Generated HTML Code'}
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
                            Download {multiPageData ? 'ZIP' : 'HTML'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deployToVercel()}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 19.777h20L12 2z"/>
                            </svg>
                            Deploy to Vercel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deployToNetlify()}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.965 1.404-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017 0z"/>
                            </svg>
                            Deploy to Netlify
                          </motion.button>
                        </div>
                      </div>
                      
                      {multiPageData ? (
                        <div className="flex-1 flex flex-col">
                          {/* File tabs for multi-page */}
                          <div className="flex gap-1 mb-4 overflow-x-auto">
                            {Object.keys(multiPageData.pages).map((filename) => (
                              <motion.button
                                key={filename}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveFile(filename)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                  activeFile === filename
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                              >
                                {filename}
                              </motion.button>
                            ))}
                          </div>
                          
                          {/* Code editor for selected file */}
                          <div className="flex-1 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                            <MonacoEditor
                              height="100%"
                              defaultLanguage={activeFile?.endsWith('.css') ? 'css' : activeFile?.endsWith('.js') ? 'javascript' : 'html'}
                              value={multiPageData.pages[activeFile] || ''}
                              onChange={(value) => {
                                if (multiPageData && activeFile) {
                                  setMultiPageData({
                                    ...multiPageData,
                                    pages: {
                                      ...multiPageData.pages,
                                      [activeFile]: value || ''
                                    }
                                  });
                                }
                              }}
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
                        </div>
                      ) : (
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
                      )}
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
                  {generatedCode || multiPageData ? (
                    <div className="flex-1 bg-white rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                      {multiPageData ? (
                        <div className="h-full flex flex-col">
                          {/* Page selector for multi-page preview */}
                          <div className="flex gap-1 p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            {Object.keys(multiPageData.pages).filter(filename => filename.endsWith('.html')).map((filename) => (
                              <motion.button
                                key={filename}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveFile(filename)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  activeFile === filename
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                                }`}
                              >
                                {filename.replace('.html', '')}
                              </motion.button>
                            ))}
                          </div>
                          
                          {/* Preview iframe */}
                          <div className="flex-1">
                            <iframe
                              srcDoc={multiPageData.pages[activeFile] || multiPageData.pages['index.html'] || Object.values(multiPageData.pages)[0]}
                              className="w-full h-full"
                              title="Website Preview"
                            />
                          </div>
                        </div>
                      ) : (
                        <iframe
                          srcDoc={generatedCode}
                          className="w-full h-full"
                          title="Website Preview"
                        />
                      )}
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

      {/* Template Library Modal */}
      <TemplateLibrary 
        isOpen={showTemplateLibrary} 
        onClose={() => setShowTemplateLibrary(false)}
        onSelectTemplate={(template) => {
          setPrompt(template.prompt);
          setShowTemplateLibrary(false);
        }}
        isPro={isPro}
        onUpgrade={() => {
          setShowTemplateLibrary(false);
          setShowPricingModal(true);
        }}
      />

      {/* Advanced Customization Modal */}
      <AdvancedCustomization 
        isOpen={showCustomization} 
        onClose={() => setShowCustomization(false)}
        onApplyCustomization={(settings) => {
          setCustomizationSettings(settings);
        }}
        isPro={isPro}
        onUpgrade={() => {
          setShowCustomization(false);
          setShowPricingModal(true);
        }}
      />
    </div>
  );
}