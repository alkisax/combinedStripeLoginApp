import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const GoogleSuccess = ({ setAdmin, setIsAdmin}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (!token) {
      console.log("login failed");
      return navigate('/login');
    }

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);

      // Decode token and extract roles
      const decoded = jwtDecode(token);
      console.log('Decoded JWT:', decoded);
      const adminData = {
        email,
        id: decoded.id,
        roles: ['admin'], // Set roles as admin since only admins can log in
      };
  
      localStorage.setItem('admin', JSON.stringify(adminData));
    
      setAdmin(true);
      setIsAdmin(adminData);

      // Redirect to dashboard or homepage
      navigate('/');
    } else {
      console.log("login failed");      
      navigate('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Logging you in via Google...</div>;
};

export default GoogleSuccess;
