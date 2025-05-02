import { useEffect, useRef } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'

const Home = ({ message, setMessage, url }) => {
  // επρεπε να γίνει γιατι καλούσε το success 2 φορες δημιουργώντας 2 transactions
  const hasCalledSuccessRef = useRef(false);

  const [searchParams] = useSearchParams()
  useEffect(() => {
    const canceled = searchParams.get('canceled'); 
    const success = searchParams.get('success')
    // added to manage to call stripe.controller.js handlesucces from frontend
    const sessionId = searchParams.get('session_id');
    console.log("sessionId", sessionId);
    

    if (success === 'true' && sessionId && !hasCalledSuccessRef.current){
      // επρεπε να φτιαξω μια νεα function γιατι το axios δεν δουλευε αλλιώς
      const fetchSuccess = async () => {
        try {
          const result = await axios.get(`${url}/stripe/success?session_id=${sessionId}`)
          console.log("Success response:", result.data);
          // για να εμποδίσει επανάληψη της κλήσης
          hasCalledSuccessRef.current = true;
        } catch (error) {
          console.error ("Error handling success:", error)
        }
      }
      fetchSuccess()
      setMessage(`Payment successful! thank you! :)
                  you will soon receive an email with the details`)
    }

    if (canceled === 'true') {
      setMessage('Payment canceled! :(');
      setTimeout(() => {
        setMessage('');
      }, 7000); 
    }

  }, [searchParams, setMessage, url])

  return (
    <>
      {message && (
        <div className={`alert ${message.includes('canceled') ? 'alert-danger' : 'alert-success'} pb-3`} role="alert">
          {message}
        </div>
      )}

      <h1>Donate APP</h1>
      <p>stripe + login app</p>
      <p className="text-center text-secondary small">to create an admin has to be done through backend with postman.
        post http://localhost:3000/api/admin
        {`{
          "username": "newadmin",
          "name": "New Admin",
          "email": "newadmin@example.com",
          "password": "password123",
          "roles": ["admin"] 
        }`}
        </p>
      {/* <Checkout /> */}
    </>
  )
}

export default Home