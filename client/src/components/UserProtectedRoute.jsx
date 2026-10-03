import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { PageLoader } from './Loader';

const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/register" state={{ from: location }} replace />;
  return children;
};

export default UserProtectedRoute;