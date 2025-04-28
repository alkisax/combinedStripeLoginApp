import Checkout from './Checkout'

const Home = ({ message}) => {

  return (
    <>
      <h6>{message}</h6>
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