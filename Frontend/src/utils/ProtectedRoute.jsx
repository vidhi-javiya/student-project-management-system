import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUser } from './auth';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = getToken();
  const user = getUser();

  // 1. if token not match to redirect move the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;