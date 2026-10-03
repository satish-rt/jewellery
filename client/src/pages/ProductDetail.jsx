import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import api from '../lib/api';
import { PageLoader } from '../components/Loader';
import ContactModal from '../components/ContactModal';
import ProductCard from '../components/ProductCard';
import { buildWhatsAppUrl } from '../components/WhatsAppButton';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        document.title = `${data.product?.name} | Rajlaxmi Jewellers`;

        if (data.product?.category) {
          const relatedResponse = await api.get(`/products?category=${data.product.category}`);
          const related = (relatedResponse.data.products || []).filter(item => item._id !== data.product._id).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        setError(err.response?.status === 404 ? 'Piece not found.' : 'Failed to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (loading || error || !product) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-el', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.2 });
    }, contentRef);
    return () => ctx.revert();
  }, [loading, error, product]);

  if (loading) return <PageLoader />;

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-charcoal pt-20">
      <span className="text-gold text-4xl mb-4">◈</span>
      <h2 className="font-serif text-4xl text-cream mb-4">{error || 'Piece not found'}</h2>
      <p className="text-gray-400 mb-8">The piece you are looking for may have been removed.</p>
      <Link to="/shop" className="btn-gold-shimmer inline-block px-10 py-4 text-sm">Back to Collection</Link>
    </div>
  );

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const images = product.images?.length > 0
    ? product.images.map(img => img.url || img)
    : [`https://placehold.co/800x800/141414/B8935F?text=RJ`];

  return (
    <div className="min-h-screen bg-charcoal" ref={contentRef}>
      {/* Top navigation strip */}
      <div className="bg-[#141414] border-b border-gold/10 pt-20">
        <div className="container mx-auto px-6 md:px-12 py-4">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 reveal-el opacity-0">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-gold/30">›</span>
            <Link to="/shop" className="hover:text-gold transition-colors">Collection</Link>
            <span className="text-gold/30">›</span>
            <span className="text-gold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Left — Images */}
          <div className="flex flex-col gap-4 reveal-el opacity-0">
            {/* Main image */}
            <div className="aspect-square bg-[#0F0F0F] border border-gold/10 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`${product.name} — Rajlaxmi Jewellers`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {/* Category badge on image */}
              <div className="absolute top-4 left-4">
                <span className="badge-gold">{product.category}</span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)}
                    className={`aspect-square overflow-hidden border transition-all duration-300 ${
                      activeImage === idx ? 'border-gold shadow-gold-sm' : 'border-gold/10 opacity-60 hover:opacity-100 hover:border-gold/40'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="flex flex-col gap-6">
            {/* Title & Price */}
            <div className="reveal-el opacity-0 pb-6 border-b border-gold/15">
              <span className="text-xs uppercase tracking-widest text-gold/60 mb-2 block">{product.category} Collection</span>
              <h1 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-4">{product.name}</h1>
              <p className="text-3xl text-gold font-serif">{formatINR(product.price)}</p>
            </div>

            {/* Description */}
            <div className="reveal-el opacity-0">
              <p className="text-gray-300 leading-relaxed font-serif text-base whitespace-pre-line">
                {product.description || 'An elegant handcrafted piece from Rajlaxmi Jewellers.'}
              </p>
            </div>

            {/* Specifications */}
            <div className="reveal-el opacity-0 grid grid-cols-2 gap-4">
              {[
                { label: 'Weight', value: product.weight },
                { label: 'Purity', value: product.purity },
                { label: 'Category', value: product.category },
                { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
              ].filter(s => s.value).map((spec, i) => (
                <div key={i} className="bg-[#141414] border border-gold/10 px-4 py-3">
                  <span className="block text-xs uppercase tracking-widest text-gold/50 mb-1">{spec.label}</span>
                  <span className="text-cream text-sm font-medium">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* In Stock indicator */}
            <div className="reveal-el opacity-0 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-gold animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm tracking-widest uppercase text-gray-400">
                {product.inStock ? 'Available to Order' : 'Currently Unavailable'}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="reveal-el opacity-0 flex flex-col sm:flex-row gap-3 mt-2">
              <button onClick={() => setModalOpen(true)}
                className="flex-1 btn-gold-shimmer py-4 text-sm text-center">
                Enquire About This Piece
              </button>
              <button
                onClick={() => navigate(`/contact?productId=${product._id}&productName=${encodeURIComponent(product.name)}`)}
                className="flex-1 border border-gold/50 text-gold py-4 text-sm uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all duration-300 text-center">
                Open Contact Form
              </button>
            </div>

            <div className="reveal-el opacity-0 flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsAppUrl(product.name)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 border border-[#25D366]/60 bg-[#25D366]/10 px-4 py-3 text-center text-sm font-medium uppercase tracking-[0.2em] text-[#a7f3c7] hover:bg-[#25D366]/20 transition-all duration-300"
              >
                WhatsApp Enquiry
              </a>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}/shop/${product._id}`);
                  window.alert('Product link copied to clipboard.');
                }}
                className="flex-1 border border-gold/50 text-gold py-3 text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-charcoal transition-all duration-300"
              >
                Share This Piece
              </button>
            </div>

            <p className="text-center text-xs text-gray-600 tracking-widest uppercase reveal-el opacity-0">
              BIS Hallmarked · Genuine Quality Guaranteed
            </p>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20 reveal-el opacity-0">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="text-gold text-xs uppercase tracking-[0.3em] mb-2 block">You may also like</span>
                <h2 className="font-serif text-3xl text-cream">Similar Pieces</h2>
              </div>
              <Link to="/shop" className="text-gold text-xs uppercase tracking-widest hover:text-gold-200 transition-colors border-b border-gold/30 pb-1">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div key={item._id} className="card-gold-hover">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <ContactModal productId={product._id} productName={product.name} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default ProductDetail;