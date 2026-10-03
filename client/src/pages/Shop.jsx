import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import api from "../lib/api";

const priceRanges = [
  { key: "all", label: "All Budgets" },
  { key: "under-10000", label: "Under ₹10K", min: 0, max: 9999 },
  { key: "10k-50k", label: "₹10K–₹50K", min: 10000, max: 50000 },
  { key: "50k-plus", label: "₹50K+", min: 50000, max: Number.MAX_SAFE_INTEGER },
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Collection | Rajlaxmi Jewellers";
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== "all") params.set("category", filter);
        if (search.trim()) params.set("q", search.trim());
        const selectedRange = priceRanges.find((range) => range.key === budget);
        if (selectedRange && selectedRange.min !== undefined) params.set("minPrice", String(selectedRange.min));
        if (selectedRange && selectedRange.max !== undefined && Number.isFinite(selectedRange.max)) params.set("maxPrice", String(selectedRange.max));

        const { data } = await api.get(`/products${params.toString() ? `?${params.toString()}` : ""}`);
        setProducts(data.products || []);
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filter, search, budget]);

  const tabs = [
    { key: "all", label: "All Pieces" },
    { key: "gold", label: "✦ Gold" },
    { key: "silver", label: "◆ Silver" },
  ];

  const visibleProducts = useMemo(() => {
    if (!search.trim()) return products;
    const query = search.trim().toLowerCase();
    return products.filter((product) => String(product.name || "").toLowerCase().includes(query));
  }, [products, search]);

  return (
    <div className="min-h-screen bg-charcoal">
      <section className="bg-section-gold-tint pt-28 pb-16 text-center px-6 border-b border-gold/15">
        <span className="badge-gold mb-4 inline-flex">Rajlaxmi Collection</span>
        <h1 className="font-serif text-5xl md:text-6xl text-cream mb-4 heading-decorated">
          Our Jewellery
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed mt-6">
          Browse our complete collection of handcrafted gold and silver jewellery.
        </p>
      </section>

      <section className="py-16 px-6 bg-charcoal">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col gap-4">
            <div className="mx-auto w-full max-w-xl">
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-gold/70">Search by Piece</label>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search necklaces, rings, bangles..."
                className="w-full border border-gold/20 bg-[#141414] px-4 py-3 text-sm text-cream placeholder:text-gray-500 focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              {priceRanges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setBudget(range.key)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    budget === range.key
                      ? "bg-gold text-charcoal shadow-gold font-semibold"
                      : "border border-gold/30 text-gray-400 hover:border-gold hover:text-gold bg-transparent"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-14 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-2.5 text-xs uppercase tracking-widest transition-all duration-300 ${
                  filter === tab.key
                    ? "bg-gold text-charcoal shadow-gold font-semibold"
                    : "border border-gold/30 text-gray-400 hover:border-gold hover:text-gold bg-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-[#1E1E1E] animate-pulse rounded-sm border border-gold/5" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400">{error}</div>
          ) : visibleProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-4xl text-gray-600 mb-3">No pieces found</p>
              <p className="text-gray-500 text-sm">Try another keyword or budget range.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filter}-${budget}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {visibleProducts.map((product) => (
                  <div key={product._id} className="card-gold-hover">
                    <ProductCard product={product} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && visibleProducts.length > 0 && (
            <p className="text-center text-gray-600 text-xs mt-10 uppercase tracking-widest">
              Showing {visibleProducts.length} {filter === "all" ? "pieces" : filter + " pieces"}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
