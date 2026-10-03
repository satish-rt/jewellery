import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import api from '../lib/api';

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    document.title = 'Rajlaxmi Jewellers — Fine Gold & Silver Jewellery';
    api.get('/products').then(({ data }) => setFeatured((data.products || []).slice(0, 4))).catch(() => {});
  }, []);

  const stats = [
    { value: '50+', label: 'Years of\nCraft' },
    { value: '10K+', label: 'Happy\nFamilies' },
    { value: '22K', label: 'Hallmarked\nGold' },
    { value: 'BIS', label: 'Certified\nPurity' },
  ];

  const categories = [
    { name: 'Gold Necklaces', desc: 'Handcrafted 22K gold', icon: '◆' },
    { name: 'Diamond Sets', desc: 'Certified solitaires', icon: '◈' },
    { name: 'Silver Jewellery', desc: '925 sterling silver', icon: '◇' },
    { name: 'Bangles & Kadas', desc: 'Traditional designs', icon: '○' },
  ];

  return (
    <div className="w-full bg-charcoal">

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background: warm radial gradient (no Spline dependency) */}
        <div className="absolute inset-0 z-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 50%, #2A1F0A 0%, #1A1A1A 60%, #0F0F0F 100%)' }} />

        {/* Decorative gold orb top-right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] z-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 70% 30%, rgba(184,147,95,0.12) 0%, transparent 60%)' }} />

        {/* Thin vertical gold line — right side */}
        <div className="absolute right-16 top-1/4 bottom-1/4 w-px z-10 hidden lg:block"
          style={{ background: 'linear-gradient(180deg, transparent, #B8935F 30%, #F5DFA0 50%, #B8935F 70%, transparent)' }} />

        {/* Diamond decorations */}
        <div className="absolute right-24 top-1/2 -translate-y-1/2 text-gold/20 text-6xl hidden lg:block select-none">◆</div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 z-10"
          style={{ background: 'linear-gradient(to top, #1A1A1A, transparent)' }} />

        {/* ── Hero Content — LEFT ALIGNED ── */}
        <div className="relative z-20 w-full container mx-auto px-8 md:px-16 lg:px-20 pt-28 pb-16">
          <div className="max-w-2xl">

            {/* Eyebrow badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 mb-8">
                <div className="h-px w-8 bg-gold" />
                <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Premium Handcrafted Jewellery Since 1975</span>
                <div className="h-px w-8 bg-gold" />
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
              className="font-serif text-6xl md:text-7xl lg:text-8xl text-cream leading-[1.0] mb-6">
              Timeless<br />
              <span className="italic text-gold-gradient">Gold.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="text-gray-300 text-lg md:text-xl max-w-lg mb-10 font-light leading-relaxed">
              Every piece at Rajlaxmi Jewellers is an heirloom in the making — 
              hallmarked, handcrafted, and designed to be cherished forever.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop"
                className="inline-flex items-center justify-center gap-3 bg-gold text-charcoal px-10 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-gold-200 transition-all duration-300 group shadow-gold">
                Explore Collection
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-3 border border-gold/50 text-cream px-10 py-4 text-sm uppercase tracking-[0.2em] hover:border-gold hover:text-gold transition-all duration-300">
                Book Consultation
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="flex items-center gap-6 mt-12 pt-8 border-t border-gold/15">
              {['BIS Hallmarked', 'Free Customisation', 'Trusted Since 1975'].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gold text-xs">✦</span>
                  <span className="text-gray-500 text-xs uppercase tracking-widest">{t}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────── STATS BAR ─────────────────── */}
      <div className="divider-gold" />
      <section style={{ background: 'linear-gradient(180deg, #1A1500 0%, #1A1A1A 100%)' }}>
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-4 divide-x divide-gold/15">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="py-10 text-center px-6">
                <p className="font-serif text-4xl md:text-5xl text-gold-gradient font-semibold mb-2">{s.value}</p>
                <p className="text-gray-500 text-xs uppercase tracking-widest whitespace-pre-line leading-relaxed">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <div className="divider-gold" />

      {/* ─────────────────── CATEGORIES ─────────────────── */}
      <section className="py-20 px-8 bg-charcoal">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.3em] mb-2 block">Browse by</span>
              <h2 className="font-serif text-4xl text-cream">Our Categories</h2>
            </div>
            <Link to="/shop" className="text-gold text-xs uppercase tracking-widest hover:text-gold-200 transition-colors border-b border-gold/30 pb-1 self-start md:self-auto">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <Link to="/shop" className="block bg-[#141414] border border-gold/10 hover:border-gold/50 p-6 md:p-8 transition-all duration-400 group hover:shadow-gold">
                  <div className="text-gold/30 text-3xl mb-4 group-hover:text-gold transition-colors">{cat.icon}</div>
                  <h3 className="font-serif text-cream text-base md:text-lg mb-1 group-hover:text-gold transition-colors">{cat.name}</h3>
                  <p className="text-gray-500 text-xs tracking-wide">{cat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── FEATURED PRODUCTS ─────────────────── */}
      <div className="divider-gold" />
      <section className="py-20 px-8 bg-charcoal">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="text-gold text-xs uppercase tracking-[0.3em] mb-3 block">Customer love</span>
            <h2 className="font-serif text-4xl text-cream">Testimonials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Aditi S.', city: 'Mumbai', quote: 'The craftsmanship is exceptional and the staff handled our custom piece with so much patience.', rating: 5 },
              { name: 'Ritika M.', city: 'Delhi', quote: 'I found the perfect bridal set here. Every detail felt premium, elegant, and personal.', rating: 5 },
              { name: 'Mehul P.', city: 'Ahmedabad', quote: 'The hallmarked gold and finishing quality are exactly what we wanted for my family jewellery.', rating: 5 },
            ].map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border border-gold/15 bg-[#141414] p-6">
                <div className="mb-4 text-gold text-sm">{'★'.repeat(item.rating)}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">“{item.quote}”</p>
                <div className="border-t border-gold/10 pt-4">
                  <p className="font-serif text-cream text-lg">{item.name}</p>
                  <p className="text-xs uppercase tracking-widest text-gold/70">{item.city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <div className="divider-gold" />
      <section className="py-20 px-8" style={{ background: 'linear-gradient(180deg, #1A1500 0%, #1A1A1A 100%)' }}>
        <div className="container mx-auto">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.3em] mb-2 block">Handpicked for you</span>
              <h2 className="font-serif text-4xl text-cream">Featured Pieces</h2>
            </div>
            <Link to="/shop" className="text-gold text-xs uppercase tracking-widest hover:text-gold-200 transition-colors border-b border-gold/30 pb-1 self-start md:self-auto">
              Full Collection →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((product, i) => (
                <motion.div key={product._id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="card-gold-hover">
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-[#141414] animate-pulse border border-gold/5" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────── HERITAGE STRIP ─────────────────── */}
      <div className="divider-gold" />
      <section className="py-20 px-8 bg-charcoal">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">Our Heritage</span>
              <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6 leading-tight">
                Five Decades of<br /><span className="italic text-gold-gradient">Pure Craftsmanship</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 font-light text-sm md:text-base">
                Rajlaxmi Jewellers has been a cornerstone of Indian fine jewellery for over 50 years.
                Every piece leaves our atelier with a promise: hallmarked purity, enduring beauty,
                and craftsmanship that transcends generations.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {['Every piece BIS certified & hallmarked', 'Custom jewellery made to your vision', 'Trusted by 10,000+ families across India'].map((pt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-gold text-sm flex-shrink-0">✦</span>
                    <span className="text-gray-400 text-sm">{pt}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-widest hover:text-gold-200 transition-colors border-b border-gold/30 pb-1">
                Our Story →
              </Link>
            </div>

            {/* Right — feature grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '◆', title: '22K Gold', desc: 'BIS hallmarked\nhigh-purity gold' },
                { icon: '◈', title: '925 Silver', desc: 'Sterling silver\nwith lifetime guarantee' },
                { icon: '◇', title: 'Custom Orders', desc: 'Design your dream\njewellery with us' },
                { icon: '✦', title: 'Free Cleaning', desc: 'Lifetime free\njewellery care' },
              ].map((item, i) => (
                <div key={i} className={`bg-[#141414] border p-6 transition-all duration-300 hover:shadow-gold ${i === 0 ? 'border-gold/40' : 'border-gold/10 hover:border-gold/40'}`}>
                  <div className="text-gold text-xl mb-3">{item.icon}</div>
                  <p className="font-serif text-cream text-sm mb-1">{item.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed whitespace-pre-line">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── CTA BANNER ─────────────────── */}
      <div className="divider-gold" />
      <section className="relative py-24 px-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1200 0%, #1A1A1A 40%, #1A1200 100%)' }}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(184,147,95,0.5) 20px, rgba(184,147,95,0.5) 21px)' }} />
        {/* Content */}
        <div className="relative text-center max-w-2xl mx-auto">
          <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">Ready to begin?</span>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-4 leading-tight">
            Find Your <span className="italic text-gold-gradient">Perfect Piece</span>
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Walk into our store or enquire online. Our experts are always ready to guide you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-gold text-charcoal px-12 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-gold-200 transition-all duration-300 shadow-gold">
              Browse Collection
            </Link>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-gold/50 text-cream px-12 py-4 text-sm uppercase tracking-[0.2em] hover:border-gold hover:text-gold transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;