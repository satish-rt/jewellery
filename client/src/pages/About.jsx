import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "../components/ScrollReveal";

const About = () => {
  useEffect(() => {
    document.title = "Our Story | Rajlaxmi Jewellers";
  }, []);

  const values = [
    {
      title: "Authenticity",
      desc: "Every piece is BIS hallmarked. Genuine materials and transparent practices are our foundation.",
      icon: "✦",
    },
    {
      title: "Craftsmanship",
      desc: "Traditional goldsmithing techniques perfected over 50 years by our master jewellers.",
      icon: "◆",
    },
    {
      title: "Timeless Design",
      desc: "Aesthetic sensibilities that transcend passing trends, designed to be loved forever.",
      icon: "◈",
    },
  ];

  return (
    <div className="w-full bg-charcoal">
      {/* Hero */}
      <section className="bg-section-gold-tint pt-28 pb-20 text-center px-6 border-b border-gold/15">
        <ScrollReveal direction="up">
          <span className="badge-gold mb-4 inline-flex">Our Heritage</span>
          <h1 className="font-serif text-5xl md:text-7xl text-cream heading-decorated mb-4">
            Our Story
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto mt-8 text-sm leading-relaxed">
            Five decades of passion, precision, and the pursuit of eternal
            beauty.
          </p>
        </ScrollReveal>
      </section>

      {/* Story */}
      <section className="py-20 px-6 bg-charcoal">
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="border-l-2 border-gold/40 pl-8 mb-12">
              <p className="text-gray-300 font-serif text-lg leading-relaxed mb-6">
                Founded over five decades ago, Rajlaxmi Jewellers has dedicated
                itself to the creation of exceptional fine jewellery. Our pieces
                are not merely ornaments, but heirlooms forged with passion and
                precision — made to be passed down through generations.
              </p>
              <p className="text-gray-400 font-serif text-lg leading-relaxed mb-6">
                Every creation begins in our atelier, where generation-spanning
                techniques meet contemporary vision. We believe that true luxury
                lies in the details — the flawless setting of a stone, the
                perfect weight of a gold chain, the immaculate polish of
                sterling silver.
              </p>
              <p className="text-gray-400 font-serif text-lg leading-relaxed">
                We source only the finest ethical materials, ensuring every
                piece carries the Rajlaxmi promise: hallmarked purity, enduring
                craftsmanship, and timeless beauty.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Values */}
      <section className="bg-section-gold-tint py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-cream heading-decorated">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} direction="up" delay={i * 0.2}>
                <div
                  className={`border p-10 h-full text-center transition-all duration-500 hover:shadow-gold group ${
                    i === 1
                      ? "border-gold bg-[#141414]"
                      : "border-gold/20 hover:border-gold/50"
                  }`}
                >
                  <div className="text-gold text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {v.icon}
                  </div>
                  <h3 className="font-serif text-xl text-cream mb-3">
                    {v.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* CTA */}
      <section className="py-24 px-6 bg-charcoal text-center">
        <ScrollReveal direction="up">
          <h2 className="font-serif text-4xl text-cream mb-4 heading-decorated">
            Experience the Collection
          </h2>
          <p className="text-gray-400 mb-10 mt-8 max-w-md mx-auto text-sm">
            Walk into our store or browse online. We are always ready to help
            you find your perfect piece.
          </p>
          <Link
            to="/shop"
            className="btn-gold-shimmer inline-block px-12 py-4 text-sm"
          >
            Explore Pieces
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default About;
