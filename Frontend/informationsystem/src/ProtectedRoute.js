import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, role } = useContext(AuthContext);
  return isAuthenticated && role === 1 ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
