import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0, goldProducts: 0, silverProducts: 0,
    totalEnquiries: 0, newEnquiries: 0, totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | Rajlaxmi Admin";
    const fetchStats = async () => {
      try {
        const [productsRes, enquiriesRes, usersRes] = await Promise.allSettled([
          api.get("/products"),
          api.get("/enquiries"),
          api.get("/users"),
        ]);
        const products =
          productsRes.status === "fulfilled"
            ? productsRes.value.data?.products || []
            : [];
        const enquiries =
          enquiriesRes.status === "fulfilled"
            ? enquiriesRes.value.data?.enquiries || []
            : [];
        const users =
          usersRes.status === "fulfilled"
            ? usersRes.value.data?.users || []
            : [];
        setStats({
          totalProducts: products.length,
          goldProducts: products.filter(
            (p) => p.category?.toLowerCase() === "gold",
          ).length,
          silverProducts: products.filter(
            (p) => p.category?.toLowerCase() === "silver",
          ).length,
          totalEnquiries: enquiries.length,
          newEnquiries: enquiries.filter((e) => e.status === "new").length,
          totalUsers: users.length,
        });
      } catch (e) {
        console.error("Dashboard stats error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, highlight = false, linkTo, icon }) => (
    <div className={`bg-[#141414] p-6 border relative overflow-hidden group transition-all duration-300 ${
      highlight ? "border-gold shadow-gold animate-glow-pulse" : "border-gold/15 hover:border-gold/40"
    }`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest">{title}</h3>
        <span className="text-gold/40 text-xl">{icon}</span>
      </div>
      {loading ? (
        <div className="h-10 w-20 bg-[#1E1E1E] animate-pulse rounded" />
      ) : (
        <p className={`font-serif text-4xl ${highlight ? "text-gold" : "text-cream"}`}>{value}</p>
      )}
      {linkTo && (
        <>
          <Link to={linkTo} className="absolute inset-0 z-10"><span className="sr-only">View {title}</span></Link>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gold text-sm">→</div>
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream mb-1">Dashboard</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest">Rajlaxmi Jewellers — Admin Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard title="New Enquiries" value={stats.newEnquiries} highlight={stats.newEnquiries > 0} linkTo="/admin/enquiries" icon="✉" />
        <StatCard title="Total Enquiries" value={stats.totalEnquiries} linkTo="/admin/enquiries" icon="◇" />
        <StatCard title="Registered Users" value={stats.totalUsers} linkTo="/admin/users" icon="◈" />
        <StatCard title="Total Products" value={stats.totalProducts} linkTo="/admin/products" icon="◆" />
        <StatCard title="Gold Pieces" value={stats.goldProducts} icon="✦" />
        <StatCard title="Silver Pieces" value={stats.silverProducts} icon="◆" />
      </div>

      <div className="bg-[#141414] border border-gold/15 p-8">
        <h2 className="font-serif text-xl text-cream mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Manage Products', to: '/admin/products', icon: '◆' },
            { label: 'View Enquiries', to: '/admin/enquiries', icon: '✉' },
            { label: 'View Registered Users', to: '/admin/users', icon: '◈' },
          ].map(({ label, to, icon }) => (
            <Link key={to} to={to}
              className="flex items-center justify-between p-4 bg-black/30 border border-gold/10 hover:border-gold/40 hover:bg-gold/5 transition-all group">
              <span className="flex items-center gap-3 text-sm uppercase tracking-widest text-gray-300 group-hover:text-gold transition-colors">
                <span className="text-gold/40 group-hover:text-gold">{icon}</span>
                {label}
              </span>
              <span className="text-gray-600 group-hover:text-gold transition-colors">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;