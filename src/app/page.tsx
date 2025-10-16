'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ArrowRight, 
  LogOut, 
  User,
  Globe,
  FileText,
  Sparkles,
  Zap,
  Star,
  Check,
  Twitter,
  Github,
  Linkedin,
  Mail,
  X
} from 'lucide-react';
import { AuthUI } from '@/components/auth-fuse';
import { useRouter } from 'next/navigation';
import { PostLoginSelection } from '@/components/PostLoginSelection';
export default function Home() {
  const { user, signOut, loading, signIn, signUp } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [showPostLoginSelection, setShowPostLoginSelection] = useState(false);
  const router = useRouter();

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthClick = () => {
    setAuthModalOpen(true);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Custom Web3 Hero Section with integrated auth */}
      <section className="relative isolate h-screen overflow-hidden bg-black text-white">
        {/* ================== BACKGROUND ================== */}
        {/* Luminous elliptical gradients to emulate the red→violet band and right cool rim */}
        <div
          aria-hidden
          className="absolute inset-0 -z-30"
          style={{
            backgroundImage: [
              // Main central dome/band (slightly below center)
              "radial-gradient(80% 55% at 50% 52%, rgba(252,166,154,0.45) 0%, rgba(214,76,82,0.46) 27%, rgba(61,36,47,0.38) 47%, rgba(39,38,67,0.45) 60%, rgba(8,8,12,0.92) 78%, rgba(0,0,0,1) 88%)",
              // Warm sweep from top-left
              "radial-gradient(85% 60% at 14% 0%, rgba(255,193,171,0.65) 0%, rgba(233,109,99,0.58) 30%, rgba(48,24,28,0.0) 64%)",
              // Cool rim on top-right
              "radial-gradient(70% 50% at 86% 22%, rgba(88,112,255,0.40) 0%, rgba(16,18,28,0.0) 55%)",
              // Soft top vignette
              "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 40%)",
            ].join(","),
            backgroundColor: "#000",
          }}
        />

        {/* Vignette corners for extra contrast */}
        <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(140%_120%_at_50%_0%,transparent_60%,rgba(0,0,0,0.85))]" />

        {/* Grid overlay: vertical columns + subtle curved horizontal arcs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen opacity-30"
          style={{
            backgroundImage: [
              // Vertical grid lines (major & minor)
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 96px)",
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 24px)",
              // Curved horizontal arcs via repeating elliptical radial gradient
              "repeating-radial-gradient(80% 55% at 50% 52%, rgba(255,255,255,0.08) 0 1px, transparent 1px 120px)"
            ].join(","),
            backgroundBlendMode: "screen",
          }}
        />

        {/* ================== NAV WITH AUTH ================== */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-50"
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="h-6 w-6 rounded-full bg-white" />
              <span className="text-lg font-semibold tracking-tight">Buildy</span>
            </motion.div>

            <nav className="hidden items-center gap-8 text-sm/6 text-white/80 md:flex">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <User className="w-4 h-4" />
                        <span className="text-sm" suppressHydrationWarning>
                          {user.user_metadata?.full_name || user.email}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/dashboard')}
                        className="bg-white text-black px-4 py-2 rounded-full font-medium transition-all hover:bg-white/90"
                      >
                        Dashboard
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={signOut}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAuthClick}
                        className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full"
                      >
                        Sign in
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAuthClick}
                        className="bg-white text-black px-4 py-2 rounded-full font-medium transition-all hover:bg-white/90"
                      >
                        Get Started
                      </motion.button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.header>

        {/* ================== HERO CONTENT ================== */}
        <div className="relative z-10 mx-auto grid w-full max-w-5xl place-items-center px-6 py-16 md:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70 ring-1 ring-white/10 backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" /> AI-POWERED CREATION
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 text-4xl font-bold tracking-tight md:text-6xl"
            >
              Create stunning websites and presentations with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                AI magic
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto mt-5 max-w-2xl text-balance text-white/80 md:text-lg"
            >
              Transform your ideas into professional websites and PowerPoint presentations in seconds. 
              No design skills required—just describe what you want and watch AI bring it to life.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow transition hover:bg-white/90"
                >
                  Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAuthClick}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow transition hover:bg-white/90"
                >
                  Start Creating Free <ArrowRight className="ml-2 w-4 h-4" />
                </motion.button>
              )}
              <a href="#features" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:border-white/40">
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* ================== PARTNERS ================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 mx-auto mt-10 w-full max-w-6xl px-6 pb-24"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
            <div className="text-xs uppercase tracking-wider text-white/70">Trusted by creators worldwide</div>
          </div>
        </motion.div>

        {/* ================== FOREGROUND PILLARS ================== */}
        {/* Center-bottom rectangular glow with pulse animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="pointer-events-none absolute bottom-[128px] left-1/2 z-0 h-36 w-28 -translate-x-1/2 rounded-md bg-gradient-to-b from-white/75 via-rose-100/60 to-transparent"
          style={{ animation: 'subtlePulse 6s ease-in-out infinite' }}
        />

        {/* Stepped pillars silhouette */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[54vh]">
          {/* dark fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          {/* bars */}
          <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-px px-[2px]">
            {[92, 84, 78, 70, 62, 54, 46, 34, 18, 34, 46, 54, 62, 70, 78, 84, 92].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: '0%' }}
                animate={{ height: `${h}%` }}
                transition={{
                  duration: 1,
                  delay: 1 + Math.abs(i - 8) * 0.06,
                  ease: 'easeInOut'
                }}
                className="flex-1 bg-black"
              />
            ))}
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes subtlePulse {
            0%, 100% {
              opacity: 0.8;
              transform: translateX(-50%) scale(1);
            }
            50% {
              opacity: 1;
              transform: translateX(-50%) scale(1.03);
            }
          }
        `}</style>
      </section>



      {/* Features Section */}
      <section id="features" className="py-24 px-8 relative">
        {/* Background graphics */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-1/3 w-40 h-40 bg-pink-500/5 rounded-full blur-2xl"></div>
        </div>
      
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
      
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                {" "}Modern Creation
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to create stunning websites and presentations with the power of AI
            </p>
          </motion.div>
      
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Instant Website Builder",
                description: "Create professional websites in seconds with AI-powered design and content generation.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: FileText,
                title: "AI-powered PPT Generator",
                description: "Transform your ideas into stunning presentations with intelligent slide creation.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Sparkles,
                title: "Custom Templates & Themes",
                description: "Choose from hundreds of professionally designed templates and customize them to your brand.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Seamless Export & Share",
                description: "Export your creations in multiple formats and share them instantly with your audience.",
                color: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1
                }}
                viewport={{ once: true }}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 overflow-hidden"
              >
                {/* Animated background particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 1,
                        repeat: Infinity,
                        delay: Math.random() * 1,
                      }}
                    />
                  ))}
                </div>
      
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:shadow-lg group-hover:shadow-${feature.color.split(' ')[1]}/20 transition-all duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-8 bg-gray-900/30 relative overflow-hidden">
        {/* Background graphics */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/2 rounded-full blur-3xl"></div>
        </div>
      
        {/* Animated connection lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <motion.path
              d="M 200 400 Q 400 200 600 400 Q 800 600 1000 400"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: true }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              How It
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                {" "}Works
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three simple steps to transform your ideas into reality
            </p>
          </motion.div>
      
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Enter Your Idea",
                description: "Simply describe what you want to create. Our AI understands natural language and your creative vision.",
                icon: "💡",
                color: "from-blue-500 to-cyan-500",
                illustration: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20illustration%20lightbulb%20idea%20concept%20dark%20background%20blue%20glow&image_size=square"
              },
              {
                step: "02", 
                title: "AI Generates Content",
                description: "Watch as our advanced AI creates your website or presentation with professional design and compelling content.",
                icon: "🤖",
                color: "from-purple-500 to-pink-500",
                illustration: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20robot%20generating%20content%20digital%20art%20dark%20theme%20purple%20glow&image_size=square"
              },
              {
                step: "03",
                title: "Customize & Export",
                description: "Fine-tune your creation with our intuitive editor, then export and share your masterpiece with the world.",
                icon: "🚀",
                color: "from-green-500 to-emerald-500",
                illustration: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=rocket%20launch%20export%20sharing%20concept%20dark%20background%20green%20glow&image_size=square"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2
                }}
                viewport={{ once: true }}
                className="group relative text-center bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-all duration-300"
              >
                {/* Connection line */}
                {index < 2 && (
                  <motion.div 
                    className="hidden md:block absolute top-16 left-full w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-x-6"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: index * 0.3 + 0.5 }}
                    viewport={{ once: true }}
                  />
                )}
      
                {/* Floating background particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-3xl">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 1,
                        repeat: Infinity,
                        delay: Math.random() * 1,
                      }}
                    />
                  ))}
                </div>
      
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />
                 
                <div className="relative z-10">
                  {/* Step illustration */}
                  <motion.div 
                    className="relative mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                      <Image 
                        src={step.illustration}
                        alt={step.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 rounded-2xl`} />
                    </div>
                    <div className="text-4xl mb-2">{step.icon}</div>
                  </motion.div>
      
                  <div className={`inline-flex px-4 py-2 rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-mono mb-4`}>
                    {step.step}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-600 transition-all duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
      
                  {/* Progress indicator */}
                  <motion.div 
                    className="mt-6 w-full h-1 bg-gray-800 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className={`h-full bg-gradient-to-r ${step.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: index * 0.2 + 1.2 }}
                      viewport={{ once: true }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo/Showcase Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              See It In
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                {" "}Action
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover what's possible with our AI-powered creation tools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "E-commerce Store",
                type: "Website",
                image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20ecommerce%20website%20design%20dark%20theme%20professional%20clean%20layout&image_size=landscape_4_3"
              },
              {
                title: "Business Presentation",
                type: "PowerPoint",
                image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20presentation%20slides%20dark%20theme%20modern%20design&image_size=landscape_4_3"
              },
              {
                title: "Portfolio Site",
                type: "Website", 
                image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20portfolio%20website%20dark%20theme%20minimalist%20design%20professional&image_size=landscape_4_3"
              },
              {
                title: "Startup Pitch Deck",
                type: "PowerPoint",
                image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=startup%20pitch%20deck%20presentation%20modern%20design%20dark%20theme%20professional&image_size=landscape_4_3"
              },
              {
                title: "Restaurant Website",
                type: "Website",
                image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=restaurant%20website%20design%20dark%20theme%20elegant%20food%20photography&image_size=landscape_4_3"
              },
              {
                title: "Marketing Report",
                type: "PowerPoint",
                image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=marketing%20report%20presentation%20charts%20graphs%20dark%20theme%20professional&image_size=landscape_4_3"
              }
            ].map((demo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1
                }}
                viewport={{ once: true }}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image 
                    src={demo.image}
                    alt={demo.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{demo.title}</h3>
                    <span className="text-xs px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30">
                      {demo.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Created in seconds with AI-powered generation
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-8 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              What Our Users
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                {" "}Say
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of creators who trust Buildy for their projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Marketing Director",
                avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20headshot%20grayscale%20business%20portrait&image_size=square",
                quote: "Buildy transformed how we create presentations. What used to take hours now takes minutes, and the quality is incredible.",
                rating: 5
              },
              {
                name: "Marcus Rodriguez", 
                role: "Startup Founder",
                avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20headshot%20grayscale%20business%20portrait&image_size=square",
                quote: "I launched my company website in under 30 minutes. The AI understood exactly what I needed for my tech startup.",
                rating: 5
              },
              {
                name: "Emily Johnson",
                role: "Freelance Designer", 
                avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20woman%20headshot%20grayscale%20artistic%20portrait&image_size=square",
                quote: "As a designer, I was skeptical, but Buildy's AI creates beautiful foundations that I can customize. It's a game-changer.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2
                }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <Image 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full grayscale mr-4"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA/Pricing Section */}
      <section id="pricing" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Simple
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                {" "}Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the plan that fits your creative needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "forever",
                description: "Perfect for trying out Buildy",
                features: [
                  "3 websites per month",
                  "5 presentations per month", 
                  "Basic templates",
                  "Standard export formats"
                ],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Pro",
                price: "₹299",
                period: "per month",
                description: "For professionals and growing teams",
                features: [
                  "Unlimited websites",
                  "Unlimited presentations",
                  "Premium templates",
                  "Advanced customization",
                  "Priority support",
                  "Custom branding"
                ],
                cta: "Start Free Trial",
                popular: true
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1
                }}
                viewport={{ once: true }}
                className={`relative bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAuthClick}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                      : 'border-2 border-gray-600 hover:border-blue-500 text-white'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Buildy</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your ideas into stunning websites and presentations with the power of AI. 
                Create, customize, and share in minutes, not hours.
              </p>
              
              {/* Newsletter Signup */}
              <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 Buildly developed by Krishna
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "#", label: "Email" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white bg-black/50 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <AuthUI
              onSignIn={async (email: string, password: string) => {
                try {
                  const { error } = await signIn(email, password);
                  if (error) {
                    console.error('Sign in error:', error.message);
                  } else {
                    setAuthModalOpen(false);
                    setShowPostLoginSelection(true);
                  }
                } catch (error) {
                  console.error('Sign in error:', error);
                }
              }}
              onSignUp={async (email: string, password: string, fullName: string) => {
                try {
                  const { error } = await signUp(email, password, fullName);
                  if (error) {
                    console.error('Sign up error:', error.message);
                  } else {
                    setAuthModalOpen(false);
                    setShowPostLoginSelection(true);
                  }
                } catch (error) {
                  console.error('Sign up error:', error);
                }
              }}
              onGoogleAuth={async () => {
                try {
                  // Handle Google auth here - placeholder for now
                  console.log('Google auth not implemented yet');
                  setAuthModalOpen(false);
                  setShowPostLoginSelection(true);
                } catch (error) {
                  console.error('Google auth error:', error);
                }
              }}
              onClose={() => setAuthModalOpen(false)}
              loading={loading}
              className="rounded-2xl overflow-hidden"
            />
          </div>
        </div>
      )}

      {/* Post-Login Selection Modal */}
      <AnimatePresence>
        {showPostLoginSelection && (
          <PostLoginSelection 
            onClose={() => setShowPostLoginSelection(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
