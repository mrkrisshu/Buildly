'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  ShoppingCart, 
  FileText, 
  Palette, 
  Code, 
  X,
  Crown
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'business' | 'portfolio' | 'ecommerce' | 'blog';
  description: string;
  icon: React.ReactNode;
  preview: string;
  isPro: boolean;
  prompt: string;
}

const templates: Template[] = [
  {
    id: 'business-corporate',
    name: 'Corporate Business',
    category: 'business',
    description: 'Professional corporate website with services and contact sections',
    icon: <Building2 className="w-6 h-6" />,
    preview: 'Modern corporate layout with hero section, services grid, and contact form',
    isPro: false,
    prompt: 'Create a professional corporate business website with a modern hero section, services grid showcasing our consulting services, team section with professional photos, testimonials from clients, and a contact form. Use a blue and white color scheme with clean typography.'
  },
  {
    id: 'business-startup',
    name: 'Startup Landing',
    category: 'business',
    description: 'Modern startup landing page with product showcase',
    icon: <Building2 className="w-6 h-6" />,
    preview: 'Startup-focused design with product features and pricing',
    isPro: true,
    prompt: 'Design a modern startup landing page with an attention-grabbing hero section, product feature highlights, pricing tiers, customer testimonials, and a call-to-action for sign-ups. Use a gradient color scheme with modern animations and clean design.'
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    category: 'portfolio',
    description: 'Artistic portfolio for designers and creatives',
    icon: <User className="w-6 h-6" />,
    preview: 'Creative layout with project gallery and artistic flair',
    isPro: false,
    prompt: 'Create a creative portfolio website for a graphic designer with a striking hero section, project gallery with hover effects, about section with personal story, skills showcase, and contact information. Use a dark theme with colorful accents and modern typography.'
  },
  {
    id: 'portfolio-developer',
    name: 'Developer Portfolio',
    category: 'portfolio',
    description: 'Technical portfolio for software developers',
    icon: <Code className="w-6 h-6" />,
    preview: 'Code-focused design with project showcases and tech stack',
    isPro: true,
    prompt: 'Build a developer portfolio website with a professional hero section, projects showcase with GitHub links, technical skills section, coding experience timeline, blog section for technical articles, and contact form. Use a modern dark theme with syntax highlighting colors.'
  },
  {
    id: 'ecommerce-fashion',
    name: 'Fashion Store',
    category: 'ecommerce',
    description: 'Stylish e-commerce site for fashion brands',
    icon: <ShoppingCart className="w-6 h-6" />,
    preview: 'Fashion-forward design with product grids and shopping features',
    isPro: true,
    prompt: 'Create a fashion e-commerce website with a stylish hero banner, featured products grid, category navigation, product detail sections, shopping cart interface, customer reviews, and newsletter signup. Use an elegant color palette with high-quality product imagery placeholders.'
  },
  {
    id: 'ecommerce-tech',
    name: 'Tech Store',
    category: 'ecommerce',
    description: 'Modern e-commerce for electronics and gadgets',
    icon: <ShoppingCart className="w-6 h-6" />,
    preview: 'Tech-focused layout with product specifications and reviews',
    isPro: false,
    prompt: 'Design a technology e-commerce website with a modern hero section, product categories for electronics, detailed product specifications, customer reviews section, comparison tools, and secure checkout process. Use a clean, tech-inspired design with blue and gray colors.'
  },
  {
    id: 'blog-personal',
    name: 'Personal Blog',
    category: 'blog',
    description: 'Personal blogging site with clean reading experience',
    icon: <FileText className="w-6 h-6" />,
    preview: 'Clean blog layout focused on readability and content',
    isPro: false,
    prompt: 'Create a personal blog website with a welcoming header, featured posts section, blog post grid with excerpts, author bio section, categories sidebar, search functionality, and newsletter subscription. Use a clean, readable design with good typography and white space.'
  },
  {
    id: 'blog-magazine',
    name: 'Magazine Blog',
    category: 'blog',
    description: 'Magazine-style blog with multiple content sections',
    icon: <FileText className="w-6 h-6" />,
    preview: 'Magazine layout with featured articles and category sections',
    isPro: true,
    prompt: 'Build a magazine-style blog website with a dynamic header, featured articles carousel, category-based content sections, trending posts sidebar, author profiles, social media integration, and advertisement spaces. Use a modern magazine layout with bold typography and engaging visuals.'
  }
];

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
  isPro: boolean;
}

export default function TemplateLibrary({ isOpen, onClose, onSelectTemplate, isPro }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showProModal, setShowProModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Templates', icon: <Palette className="w-4 h-4" /> },
    { id: 'business', name: 'Business', icon: <Building2 className="w-4 h-4" /> },
    { id: 'portfolio', name: 'Portfolio', icon: <User className="w-4 h-4" /> },
    { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'blog', name: 'Blog', icon: <FileText className="w-4 h-4" /> }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template: Template) => {
    if (template.isPro && !isPro) {
      setShowProModal(true);
      return;
    }
    onSelectTemplate(template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Template Library</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Choose a template to get started quickly</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all relative"
                onClick={() => handleTemplateSelect(template)}
              >
                {template.isPro && (
                  <div className="absolute top-3 right-3">
                    <Crown className="w-5 h-5 text-yellow-500" />
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {template.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {template.description}
                </p>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {template.preview}
                  </p>
                </div>
                
                {template.isPro && !isPro && (
                  <div className="mt-3 text-center">
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                      Pro Template
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pro Upgrade Modal */}
        {showProModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4">
              <div className="text-center">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Pro Template
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This template is available for Pro members only. Upgrade to access all premium templates and features.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowProModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowProModal(false);
                      onClose();
                      // This would trigger the pricing modal in the parent component
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}