import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ admin , children, requiredRole }) => {
  if (!admin) {
    console.log("protected failed");    
    return <Navigate to="/" />;
  }

  if (requiredRole && !admin.roles.includes(requiredRole)) {
    console.log("protected passed"); 
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
