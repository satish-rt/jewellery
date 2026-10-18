import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const ProductCard = React.memo(({ product }) => {
  const { _id, name, category, images, price, inStock } = product;
  const imgUrl = images?.[0]?.url;
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const cardContent = (
    <Link
      to={`/shop/${_id}`}
      className="block group relative overflow-hidden bg-[#141414] border border-gold/15 hover:border-gold/50 transition-all duration-300 hover:shadow-gold rounded-sm"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#111]">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={`${name} — Rajlaxmi Jewellers`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                category === "silver"
                  ? "https://images.unsplash.com/photo-1611591475879-11c9118c7c97?auto=format&fit=crop&w=800&q=80"
                  : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80";
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gold/20 text-3xl sm:text-4xl font-serif">RJ</span>
          </div>
        )}

        {!inStock && (
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 rounded-sm border border-red-500/60 bg-red-950/80 px-1.5 py-0.5 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-red-200">
            Out of Stock
          </div>
        )}

        {/* Category Pill Tag on Image */}
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10">
          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-gold bg-black/75 backdrop-blur-sm border border-gold/30 font-medium">
            {category}
          </span>
        </div>

        {/* Gold overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-end justify-center pb-4">
          <span className="text-gold text-[11px] uppercase tracking-widest border border-gold/60 px-3 py-1.5 bg-charcoal/80 backdrop-blur-sm">
            View Piece
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-4 border-t border-gold/10 group-hover:border-gold/30 transition-colors">
        <h3 className="font-serif text-cream text-xs sm:text-base truncate group-hover:text-gold transition-colors mb-1 font-medium">
          {name}
        </h3>
        <div className="flex items-center justify-between gap-1">
          <p className="text-gold text-xs sm:text-sm font-semibold whitespace-nowrap">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(price)}
          </p>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden sm:inline">BIS</span>
        </div>
      </div>
    </Link>
  );

  if (prefersReducedMotion || isMobile) return cardContent;

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      glareEnable={true}
      glareMaxOpacity={0.06}
      glareColor="#B8935F"
      scale={1.01}
      transitionSpeed={400}
    >
      {cardContent}
    </Tilt>
  );
});

export default ProductCard;
