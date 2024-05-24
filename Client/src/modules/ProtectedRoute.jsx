import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ cases, children }) {
  console.log(cases);

  for (const c of cases){
    if (c.condition_handler()) {
      c.optional_conditional_handler_operation();
      return <Navigate to={c.protected_route} replace />;
    }
  }

  return children;
}

/* cases = [condition_handler, optional_conditional_handler_operation, protected_route}, ...] 
    where
      condition_handler is a function that evaluates true/false to activate protection case
      optional_conditional_handler_operation is an optional function that is activating when protect case activated (first execute)
      protected_route is a route (string) value to direct user where it belongs to after case fired
*/
export default ProtectedRoute;