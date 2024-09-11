import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useAuth(); // Use your authentication hook here
  const location = useLocation();

  return isAuthenticated ? (
    <Route {...rest} element={<Element />} />
  ) : (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
};

export default ProtectedRoute;
