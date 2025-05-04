import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const GoogleSuccess = ({ setAdmin, setIsAdmin}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (token) {
      // Store the token (adjust storage if you prefer memory/Redux/etc.)
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);

      // Decode token and extract roles
      const decoded = jwtDecode(token);
      console.log('Decoded JWT:', decoded);

      if (decoded.roles?.includes('admin')) {
        setIsAdmin(true);
        setAdmin({ email, id: decoded.id });
      }

      // Redirect to dashboard or homepage
      navigate('/');
    } else {
      // Maybe show error
      navigate('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Logging you in via Google...</div>;
};

export default GoogleSuccess;
