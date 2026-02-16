import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If no token exists, send user back to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the component (children)
  return children;
};

export default ProtectedRoute;