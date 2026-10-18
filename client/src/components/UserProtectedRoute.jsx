import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { PageLoader } from './Loader';

const UserProtectedRoute = ({ children, message = 'Please log in to contact us or send an enquiry.' }) => {
  const { user, loading } = useUser();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location, message }} replace />;
  return children;
};

export default UserProtectedRoute;