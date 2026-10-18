import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && ["gold", "silver", "all"].includes(cat.toLowerCase())) {
      setFilter(cat.toLowerCase());
    }
  }, [searchParams]);

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
    { key: "all", label: "All Pieces", countLabel: "All" },
    { key: "gold", label: "✦ 22K Gold", countLabel: "Gold" },
    { key: "silver", label: "◆ 925 Silver", countLabel: "Silver" },
  ];

  const visibleProducts = useMemo(() => {
    if (!search.trim()) return products;
    const query = search.trim().toLowerCase();
    return products.filter((product) => String(product.name || "").toLowerCase().includes(query));
  }, [products, search]);

  const handleTabChange = (key) => {
    setFilter(key);
    if (key === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", key);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-charcoal">
      <section className="bg-section-gold-tint pt-24 pb-10 sm:pt-28 sm:pb-16 text-center px-4 sm:px-6 border-b border-gold/15">
        <span className="badge-gold mb-3 sm:mb-4 inline-flex">Rajlaxmi Collection</span>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream mb-2 sm:mb-4 heading-decorated">
          Our Jewellery
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-xs sm:text-sm leading-relaxed mt-4 sm:mt-6 px-2">
          Browse our complete handcrafted collection of 100% BIS hallmarked gold and sterling silver jewellery.
        </p>
      </section>

      <section className="py-8 sm:py-16 px-3 sm:px-6 bg-charcoal">
        <div className="container mx-auto max-w-7xl">
          {/* Search and Filters */}
          <div className="mb-6 sm:mb-10 flex flex-col gap-4">
            <div className="mx-auto w-full max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search gold necklaces, silver rings, bangles..."
                  className="w-full border border-gold/25 bg-[#141414] pl-10 pr-10 py-3 text-xs sm:text-sm text-cream placeholder:text-gray-500 focus:border-gold focus:outline-none rounded-sm transition-colors"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60 text-sm">🔍</span>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cream text-xs p-1"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Gold & Silver Category Selection Pills */}
            <div className="flex justify-center items-center gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-xs uppercase tracking-widest transition-all duration-300 rounded-sm whitespace-nowrap active:scale-95 ${
                    filter === tab.key
                      ? "bg-gold text-charcoal shadow-gold font-bold"
                      : "border border-gold/30 text-gray-300 hover:border-gold hover:text-gold bg-[#141414]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Budget Range Pills */}
            <div className="flex justify-center items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
              {priceRanges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setBudget(range.key)}
                  className={`px-3 sm:px-4 py-1.5 text-[10px] uppercase tracking-wider transition-all duration-300 rounded-sm whitespace-nowrap active:scale-95 ${
                    budget === range.key
                      ? "bg-gold/20 border border-gold text-gold font-semibold shadow-gold-sm"
                      : "border border-gray-800 text-gray-400 hover:border-gold/40 hover:text-gray-200 bg-[#121212]"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid - 2 COLUMNS ON MOBILE */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-[#141414] animate-pulse rounded-sm border border-gold/10" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-400 text-sm">{error}</div>
          ) : visibleProducts.length === 0 ? (
            <div className="text-center py-20 px-4">
              <span className="text-gold/40 text-4xl block mb-3">◈</span>
              <p className="font-serif text-2xl sm:text-3xl text-gray-300 mb-2">No pieces found</p>
              <p className="text-gray-500 text-xs sm:text-sm mb-6">Try clearing your search keyword or selecting "All Budgets".</p>
              <button
                onClick={() => { setSearch(""); setFilter("all"); setBudget("all"); }}
                className="btn-gold-shimmer py-2.5 px-6 text-xs uppercase tracking-widest"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filter}-${budget}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
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
            <p className="text-center text-gray-500 text-[11px] sm:text-xs mt-10 uppercase tracking-widest">
              Showing {visibleProducts.length} {filter === "all" ? "pieces" : filter + " jewellery pieces"}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
