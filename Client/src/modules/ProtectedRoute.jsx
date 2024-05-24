import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ condition_handler, optional_conditional_handler_operation, protected_route, children }) {

  if (condition_handler()) {
    optional_conditional_handler_operation();
    return <Navigate to={protected_route} replace />;
  }

  return children;
}

export default ProtectedRoute;