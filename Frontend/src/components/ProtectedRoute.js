import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ loggedIn, children }) {
  if (loggedIn) {
    return children;
  }
  return <Navigate to="/sign-in" replace />;
}

export default ProtectedRoute;