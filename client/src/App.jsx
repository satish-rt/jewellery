import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import UserProtectedRoute from './components/UserProtectedRoute';
import { PageLoader } from './components/Loader';
import { UserProvider } from './context/UserContext';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import UserLogin from './pages/UserLogin';
import Register from './pages/Register';
import WhatsAppButton from './components/WhatsAppButton';
import MobileBottomNav from './components/MobileBottomNav';

import ProtectedRoute from './admin/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import Enquiries from './admin/Enquiries';
import Users from './admin/Users';

const AUTH_ROUTES = ['/register', '/login'];

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);
  const showNavFooter = !isAdminRoute && !isAuthRoute;

  return (
    <UserProvider>
      {showNavFooter && <Navbar />}
      <main className={`flex-grow ${showNavFooter ? 'pb-20 md:pb-0' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Auth routes — no Navbar, no login required */}
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/login" element={<PageTransition><UserLogin /></PageTransition>} />

            {/* Public catalog routes — ANY visitor can see products & listings without login */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
            <Route path="/shop/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />

            {/* Contact route — requires login before contacting or submitting enquiries */}
            <Route
              path="/contact"
              element={
                <UserProtectedRoute message="Please login to contact us or submit an enquiry.">
                  <PageTransition><Contact /></PageTransition>
                </UserProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="users" element={<Users />} />
            </Route>
            <Route path="/admin/login" element={<Login />} />
          </Routes>
        </AnimatePresence>
      </main>
      {showNavFooter && <Footer />}
      {showNavFooter && <WhatsAppButton />}
      {showNavFooter && <MobileBottomNav />}
    </UserProvider>
  );
}

export default App;