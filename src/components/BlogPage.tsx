/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Clock, Calendar, ArrowRight, X,
  Send, CheckCircle, Share2, Filter, ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: 'product' | 'company' | 'engineering' | 'dealerships' | 'compliance';
  categoryLabel: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  publishDate: string;
  readTime: string;
  imageUrl: string;
  featured?: boolean;
  tags: string[];
  likes: number;
}

export default function BlogPage() {
  // 1. Static simple-english database
  const blogPosts: BlogPost[] = [
    {
      id: 'post-1',
      title: 'Safe and Easy Car Payments with JustCarSale',
      excerpt: 'Learn how our secure payment system protects you when buying a car.',
      content: [
        'We are happy to announce our new payment system. Buying cars across different cities is now completely safe.',
        'Our secure payment tool holds your money safely. The seller only gets paid after our certified inspectors check the car and approve the paperwork.',
        'This makes buying cars easy and stress-free. Every step is protected, giving you peace of mind.'
      ],
      category: 'product',
      categoryLabel: 'Product Updates',
      author: {
        name: 'Justas Petrauskas',
        role: 'Co-Founder & Chief Product Architect',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
      },
      publishDate: 'June 15, 2026',
      readTime: '5 min read',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&h=480&q=80',
      featured: true,
      tags: ['Portal 2.0', 'Payments', 'Security'],
      likes: 124
    },
    {
      id: 'post-2',
      title: 'New Warsaw Delivery Hub: Faster Car Delivery',
      excerpt: 'We opened a new hub in Warsaw to deliver your cars much faster.',
      content: [
        'We have opened a brand-new car hub outside Warsaw. This helps us ship and deliver cars much quicker than before.',
        'The new yard has a lot of space for car checks and quick loading. This means your cars are processed with no delay.',
        'For buyers and sellers, this means transport times are cut down by two whole days. Your car will arrive at your door safely and quickly.'
      ],
      category: 'company',
      categoryLabel: 'Company News',
      author: {
        name: 'Elena Noreikienė',
        role: 'Director of Logistics, Warsaw Depot Hub',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80'
      },
      publishDate: 'June 09, 2026',
      readTime: '4 min read',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&h=380&q=80',
      tags: ['Delivery', 'Logistics', 'Warsaw'],
      likes: 83
    },
    {
      id: 'post-3',
      title: 'Faster Website Speeds and Instant Car Listings',
      excerpt: 'We upgraded our system to show you live car listings with zero delay.',
      content: [
        'We know that timing is everything when buying or selling a car. That is why we upgraded our website servers.',
        'When a car is sold, the listing is removed immediately. This prevents duplicate bookings and keeps our database accurate.',
        'Our website now loads in less than a second. This makes finding your next car faster and smoother.'
      ],
      category: 'engineering',
      categoryLabel: 'Tech & Engineering',
      author: {
        name: 'Dr. Valdas Sabonis',
        role: 'Lead Systems Developer, Vilnius HQ',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80'
      },
      publishDate: 'May 28, 2026',
      readTime: '7 min read',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&h=380&q=80',
      tags: ['API', 'Speeds', 'Database'],
      likes: 98
    },
    {
      id: 'post-4',
      title: 'Get a Green Check Badge for Your Car Store',
      excerpt: 'Build instant trust with buyers by getting our certified verification badge.',
      content: [
        'The Green Check Badge shows buyers that your store is real and trusted. Stores with this badge sell cars much faster.',
        'We verify your business license and make sure you have the actual cars in your shop before giving you the badge.',
        'This simple step prevents spam and helps honest sellers stand out. Apply today to get your trust badge.'
      ],
      category: 'dealerships',
      categoryLabel: 'For Dealerships',
      author: {
        name: 'Kristina Petraitytė',
        role: 'Head of Dealer Operations',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80'
      },
      publishDate: 'May 14, 2026',
      readTime: '3 min read',
      imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&h=380&q=80',
      tags: ['Badge', 'Trust', 'Verification'],
      likes: 67
    },
    {
      id: 'post-5',
      title: 'Simple Guide to Car Taxes and Customs',
      excerpt: 'Learn the rules of buying cars across borders with our simple guide.',
      content: [
        'Buying a car from another country can seem hard. We are here to make the taxes and paperwork simple for you.',
        'Our built-in tax calculator shows you the exact price before you buy. No hidden fees or surprise charges.',
        'We help you draft and check all custom forms. This guarantees your car clears customs easily and quickly.'
      ],
      category: 'compliance',
      categoryLabel: 'Safety & Taxes',
      author: {
        name: 'Dr. Tomas Kazlauskas',
        role: 'VP of Regulatory Compliance, Legal Consul',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
      },
      publishDate: 'April 30, 2026',
      readTime: '6 min read',
      imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&h=380&q=80',
      tags: ['Taxes', 'Customs', 'Rules'],
      likes: 112
    },
    {
      id: 'post-6',
      title: 'Our New Plan for Eco-Friendly Car Transport',
      excerpt: 'We are partnering with green transport services to protect our environment.',
      content: [
        'We want to keep our planet clean. That is why we are starting a new green transport plan for car deliveries.',
        'We are partnering with transport trucks that use cleaner energy and offset their carbon emissions.',
        'This plan does not cost you any extra money. We take care of it ourselves to make car buying better for the earth.'
      ],
      category: 'company',
      categoryLabel: 'Company News',
      author: {
        name: 'Vytautas Petryla',
        role: 'Head of Corporate Sustainability',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'
      },
      publishDate: 'April 19, 2026',
      readTime: '4 min read',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&h=380&q=80',
      tags: ['Green', 'Logistics', 'Earth'],
      likes: 54
    }
  ];

  // 2. Filter, search and categories state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Newsletter form
  const [newsEmail, setNewsEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  // Active expanded modal article
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Likes tracker local simulator
  const [likedArticleIds, setLikedArticleIds] = useState<Record<string, boolean>>({});

  // 3. Computed filtered articles list
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchQuery = searchQuery.trim() === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Featured Post selected
  const featuredPost = useMemo(() => {
    const featured = blogPosts.find(p => p.featured);
    if (!featured) return blogPosts[0];
    
    if (searchQuery || selectedCategory !== 'all') {
      return filteredPosts.find(p => p.featured) || filteredPosts[0];
    }
    return featured;
  }, [filteredPosts, selectedCategory, searchQuery]);

  // Handle newsletter registration
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail || !newsEmail.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribeSuccess(true);
      setNewsEmail('');
    }, 1200);
  };

  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedArticleIds(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Get active reading post details
  const activePostData = useMemo(() => {
    return blogPosts.find(p => p.id === activeArticleId) || null;
  }, [activeArticleId]);

  return (
    <div className="w-full space-y-12 max-w-[1240px] mx-auto px-4 py-8" id="blog-system-stage">
      
      {/* ============================================================== */}
      {/* 1. HERO HEADER BANNER */}
      {/* ============================================================== */}
      <section className="text-center space-y-3 max-w-4xl mx-auto pt-4" id="blog-hero">
        <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight leading-none uppercase font-sans" id="blog-main-title">
          Inside <span className="text-[#8B0000] underline decoration-4 decoration-[#8B0000]/20 underline-offset-8">JustCarSale</span>
        </h1>
      </section>

      {/* ============================================================== */}
      {/* 2. FILTER & REAL-TIME SEARCH PANEL */}
      {/* ============================================================== */}
      <section className="w-full" id="blog-search-filtration-bar">
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left search bar input */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-[#8B0000] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-[#8B0000] pl-11 pr-10 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide outline-none transition-all placeholder:text-zinc-450 focus:ring-2 focus:ring-[#8B0000]/10"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right interactive categories list */}
          <div className="flex flex-wrap items-center gap-2" id="blog-categories-pills-list">
            {['all', 'product', 'company', 'engineering', 'dealerships', 'compliance'].map((cat) => {
              const isActive = selectedCategory === cat;
              const labels: Record<string, string> = {
                all: 'All Updates',
                product: 'Products',
                company: 'Company News',
                engineering: 'Engineering',
                dealerships: 'For Dealers',
                compliance: 'Safety & Taxes'
              };
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-[10px] font-mono font-black tracking-wider uppercase transition-all cursor-pointer border rounded-lg shadow-xs ${
                    isActive
                      ? 'bg-[#8B0000] text-white border-transparent'
                      : 'bg-white text-zinc-650 border-zinc-200 hover:border-[#8B0000] hover:text-[#8B0000]'
                  }`}
                >
                  {labels[cat]}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. HIGHLIGHTED FEATURED POST BANNER */}
      {/* ============================================================== */}
      <AnimatePresence mode="wait">
        {featuredPost && !searchQuery && selectedCategory === 'all' && (
          <motion.section 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full text-left" 
            id="blog-featured-spotlight"
          >
            <div 
              onClick={() => setActiveArticleId(featuredPost.id)}
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              
              {/* Post image */}
              <div className="lg:col-span-7 relative h-64 sm:h-96 lg:h-full bg-zinc-50 border-r-2 border-dashed border-zinc-200">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover filter brightness-95 grayscale group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Post verbal details */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white text-zinc-900">
                
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight group-hover:text-[#8B0000] transition-colors font-sans border-l-4 border-[#8B0000] pl-4">
                    {featuredPost.title}
                  </h2>
                </div>

                <div className="pt-6 border-t-2 border-dashed border-zinc-100 flex items-center justify-between">
                  {/* Author profile */}
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatarUrl}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left leading-normal">
                      <strong className="text-xs text-zinc-900 block font-extrabold">{featuredPost.author.name}</strong>
                      <span className="text-[9px] text-zinc-400 block uppercase tracking-tight font-mono font-bold">{featuredPost.author.role}</span>
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-white text-zinc-855 border border-zinc-200 rounded-lg shadow-xs group-hover:bg-[#8B0000] group-hover:text-white group-hover:border-transparent transition-all font-bold text-xs uppercase tracking-wider">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </div>

            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 4. MAIN ARTICLE GRID LIST */}
      {/* ============================================================== */}
      <section className="w-full text-left animate-fade-in" id="blog-posts-catalog-grid">
        
        {/* Dynamic header status */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-200 pb-4 mb-8">
          <span className="text-xs font-mono font-black uppercase text-zinc-400 tracking-wider">
            {filteredPosts.length} posts found
          </span>
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-[#8B0000] font-black text-xs uppercase font-mono tracking-wider hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(p => !featuredPost || p.id !== featuredPost.id || searchQuery || selectedCategory !== 'all').map((post) => {
              return (
                <article
                  key={post.id}
                  onClick={() => setActiveArticleId(post.id)}
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  
                  {/* Card Upper Image frame */}
                  <div className="relative h-48 sm:h-52 bg-zinc-50 overflow-hidden border-b-2 border-dashed border-[#8B0000]/20">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover filter brightness-95 grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Card Central info body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <h3 className="text-base font-black uppercase text-zinc-900 group-hover:text-[#8B0000] transition-colors leading-tight font-sans line-clamp-3">
                      {post.title}
                    </h3>
                  </div>

                  {/* Card Bottom Footer */}
                  <div className="px-5 py-4 bg-white border-t-2 border-dashed border-zinc-150 flex items-center justify-between">
                    {/* Simplified Author representation */}
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover border-2 border-zinc-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] font-bold text-zinc-700 uppercase font-sans">
                        {post.author.name}
                      </span>
                    </div>

                    {/* CTA arrow */}
                    <span className="text-[#8B0000] flex items-center gap-1 text-[10px] font-mono font-bold uppercase">
                      <span>READ</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B0000] group-hover:translate-x-1 transition-all" />
                    </span>
                  </div>

                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-4 max-w-xl mx-auto" id="no-articles-card-indicator">
            <Filter className="w-12 h-12 text-[#8B0000] mx-auto animate-pulse" />
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                No posts found
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                We could not find any updates matching "{searchQuery}".
              </p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="bg-[#8B0000] hover:bg-[#700000] text-white px-5 py-2.5 rounded-lg border border-transparent shadow-xs transition-all uppercase font-bold text-[10px] tracking-widest cursor-pointer"
            >
              Show All Updates
            </button>
          </div>
        )}

      </section>

      {/* ============================================================== */}
      {/* 5. NEWSLETTER INTEGRATIVE INPUT DRAWER */}
      {/* ============================================================== */}
      <section className="bg-white border border-zinc-200 p-8 sm:p-12 rounded-xl shadow-sm my-12" id="blog-newsletter-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-3xl sm:text-[36px] font-black text-zinc-900 uppercase tracking-tight leading-none">
              Get our <span className="text-[#8B0000] underline decoration-4 decoration-[#8B0000]/20 underline-offset-4">latest news</span>
            </h2>
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                {!subscribeSuccess ? (
                  <motion.form
                    key="sub-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row gap-3 bg-white w-full"
                  >
                    <input
                      required
                      type="email"
                      placeholder="Enter your email here..."
                      value={newsEmail}
                      onChange={(e) => setNewsEmail(e.target.value)}
                      className="flex-1 bg-white border border-zinc-200 focus:border-[#8B0000] rounded-lg text-xs px-3.5 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none font-medium transition-all focus:ring-2 focus:ring-[#8B0000]/10"
                    />
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="bg-[#8B0000] hover:bg-[#700000] disabled:bg-zinc-800 text-white px-6 py-3 rounded-lg border border-transparent shadow-xs uppercase font-bold text-[10px] tracking-widest whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="sub-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white text-[#8B0000] border border-zinc-250 rounded-xl p-5 text-left flex items-start gap-4 shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-50 text-[#8B0000] border border-[#8B0000]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-5.5 h-5.5" />
                    </div>
                    <div className="space-y-1">
                      <strong className="text-sm font-black text-[#8B0000] block uppercase">Subscribed!</strong>
                      <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                        You have successfully registered. We will send you new updates directly to your inbox.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. MODAL OVERLAY: EXPANDED ARTICLE READER */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activePostData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[999] overflow-y-auto px-4 py-8 flex justify-center items-start text-left"
            onClick={() => setActiveArticleId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden max-w-[840px] w-full shadow-lg relative mt-4 cursor-default text-zinc-900"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Floating close button */}
              <button
                type="button"
                onClick={() => setActiveArticleId(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-white hover:bg-zinc-50 text-zinc-650 rounded-lg flex items-center justify-center border border-zinc-200 shadow-xs transition-all z-10 cursor-pointer"
                title="Close article"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Image Header */}
              <div className="h-64 sm:h-80 relative bg-zinc-50 border-b-2 border-dashed border-[#8B0000]/20">
                <img
                  src={activePostData.imageUrl}
                  alt={activePostData.title}
                  className="w-full h-full object-cover filter brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="bg-[#8B0000] text-white text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-transparent shadow-xs w-fit block">
                    {activePostData.categoryLabel}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight max-w-2xl font-sans">
                    {activePostData.title}
                  </h2>
                </div>
              </div>

              {/* Reading core block details */}
              <div className="p-6 sm:p-10 space-y-8">
                
                {/* Meta details header band */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-dashed border-zinc-100 text-xs text-zinc-500">
                  
                  {/* Author profile */}
                  <div className="flex items-center gap-3">
                    <img
                      src={activePostData.author.avatarUrl}
                      alt={activePostData.author.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left leading-normal">
                      <strong className="text-xs text-zinc-900 block font-extrabold">{activePostData.author.name}</strong>
                      <span className="text-[9.5px] text-zinc-400 block uppercase tracking-tight font-bold font-mono">{activePostData.author.role}</span>
                    </div>
                  </div>

                  {/* Date, read time */}
                  <div className="flex items-center gap-4 text-[10.5px] font-mono font-black text-zinc-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#8B0000]" />
                      <span>{activePostData.publishDate}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#8B0000]" />
                      <span>{activePostData.readTime}</span>
                    </span>
                  </div>

                </div>

                {/* Article content */}
                <div className="space-y-4 text-zinc-700 text-xs sm:text-sm font-normal leading-relaxed max-w-none">
                  {activePostData.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-4">
                  {activePostData.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="bg-zinc-50 border-2 border-zinc-200 text-zinc-700 text-[10px] uppercase tracking-wider font-mono font-black px-3 py-1 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Engagement / Action Footer */}
                <div className="pt-6 border-t-2 border-dashed border-zinc-150 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => handleLikePost(activePostData.id, e)}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer border rounded-lg ${
                        likedArticleIds[activePostData.id]
                          ? 'bg-[#8B0000] border-transparent text-white shadow-xs'
                          : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 shadow-xs'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{likedArticleIds[activePostData.id] ? activePostData.likes + 1 : activePostData.likes} Upvotes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Link copied to clipboard!")}
                      className="hover:bg-zinc-50 bg-white border-2 border-zinc-200 text-zinc-600 p-2 rounded-lg transition-all cursor-pointer"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveArticleId(null)}
                    className="bg-[#8B0000] hover:bg-[#700000] text-white text-[10.5px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg border border-transparent shadow-xs transition-all cursor-pointer"
                  >
                    Finished Reading
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
