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
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Auth routes — no Navbar, no login required */}
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/login" element={<PageTransition><UserLogin /></PageTransition>} />

            {/* Protected catalog routes — must be logged in */}
            <Route path="/" element={<UserProtectedRoute><PageTransition><Home /></PageTransition></UserProtectedRoute>} />
            <Route path="/shop" element={<UserProtectedRoute><PageTransition><Shop /></PageTransition></UserProtectedRoute>} />
            <Route path="/shop/:id" element={<UserProtectedRoute><PageTransition><ProductDetail /></PageTransition></UserProtectedRoute>} />
            <Route path="/contact" element={<UserProtectedRoute><PageTransition><Contact /></PageTransition></UserProtectedRoute>} />
            <Route path="/about" element={<UserProtectedRoute><PageTransition><About /></PageTransition></UserProtectedRoute>} />

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
    </UserProvider>
  );
}

export default App;