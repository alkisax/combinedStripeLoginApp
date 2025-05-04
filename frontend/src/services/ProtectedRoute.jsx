import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ admin , children, requiredRole }) => {

  if (admin === null) {
    return <div>Loading...</div>; 
  }

  if (!admin) {
    console.log("protected failed");    
    return <Navigate to="/" />;
  }

  if (requiredRole && !admin?.roles?.includes(requiredRole)) {
    console.log("protected passed"); 
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;
