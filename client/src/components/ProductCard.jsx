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

  const cardContent = (
    <Link
      to={`/shop/${_id}`}
      className="block group relative overflow-hidden bg-[#141414] border border-gold/10 hover:border-gold/50 transition-all duration-500 hover:shadow-gold"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#111]">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={`${name} — Rajlaxmi Jewellers`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gold/20 text-4xl font-serif">RJ</span>
          </div>
        )}

        {!inStock && (
          <div className="absolute left-4 top-4 z-10 rounded-sm border border-red-500/60 bg-red-950/80 px-2 py-1 text-[9px] uppercase tracking-[0.25em] text-red-200">
            Out of Stock
          </div>
        )}

        {/* Gold overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
          <span className="text-gold text-xs uppercase tracking-widest border border-gold/60 px-4 py-2 bg-charcoal/60 backdrop-blur-sm">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-gold/10 group-hover:border-gold/30 transition-colors">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase tracking-widest text-gold/60 mb-1 block">
              {category}
            </span>
            <h3 className="font-serif text-cream text-base truncate group-hover:text-gold transition-colors">
              {name}
            </h3>
          </div>
          <p className="text-gold text-sm font-medium whitespace-nowrap">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(price)}
          </p>
        </div>
      </div>
    </Link>
  );

  if (prefersReducedMotion) return cardContent;

  return (
    <Tilt
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      glareEnable={true}
      glareMaxOpacity={0.08}
      glareColor="#B8935F"
      scale={1.02}
      transitionSpeed={500}
    >
      {cardContent}
    </Tilt>
  );
});

export default ProductCard;
