import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still loading Firebase auth state → prevent redirect
  if (loading) {
    return (
      <div className="text-white text-center py-10">
        Loading...
      </div>
    );
  }

  // After loading, if no user → block access
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
