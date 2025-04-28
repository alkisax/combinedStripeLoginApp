/* eslint-disable no-unused-vars */
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const Home = ({ message, setMessage }) => {

  const [searchParams] = useSearchParams()
  useEffect(() => {
    const canceled = searchParams.get('canceled'); 

    if (canceled === 'true') {
      setMessage('Payment canceled! :(');
      setTimeout(() => {
        setMessage('');
      }, 7000); 
    }

    const success = searchParams.get('success')
    if (success === 'true') {
      setMessage('Donation successful! thank you! :)');
      setTimeout(() => {
        setMessage('');
      }, 7000); 
    }
  }, [searchParams, setMessage])

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