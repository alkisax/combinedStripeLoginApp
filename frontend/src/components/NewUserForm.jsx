/* eslint-disable no-unused-vars */
import {useState} from 'react'
import axios from 'axios'

const NewUserForm = ({ url, users, setUsers }) =>{
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roles, setRoles] = useState(['user'])


  const handleSubmitUser = async (event) => {
    event.preventDefault()
    
    try {
      const newUser = {
        "username": username,
        "name": name,
        "email": email,
        "password": password,
        "roles": roles
      }

      const response = await axios.post(`${url}/users`, newUser)

      console.log('✅ User created:', response.data)
      alert('User created successfully!')

      // Clear the form if needed
      setUsername('')
      setName('')
      setEmail('')
      setPassword('')
      setRoles(['user'])

      // Redirect to /admin after creating the user
      // navigate('/admin');
      // ✅ απλό "φρεσκάρισμα" της σελίδας για να ξανατραβήξει τα δεδομένα
      // window.location.reload()
      // Update users list directly
      // setUsers([...users, response.data]); // αυτο προστεθηκε γιατι δεν πρεπει να κανεις ανανεωση της σελιδας σε single page app
      setUsers(current => [...current, response.data]); // Take the current state (users) and add the new user (response.data) to the end of the array
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }


  return (
    <>
      <form onSubmit={handleSubmitUser}>
        <div>
          username
          <input type="text"
          id='createUsername'
          value={username}
          name="username"
          onChange={({target}) => setUsername(target.value)}
          autoComplete="username"
          />
        </div>
        <div>
          name
          <input type="text"
          id='createName'
          value={name}
          name="name"
          onChange={({target}) => setName(target.value)}
          autoComplete="name"
          />
        </div>
        <div>
          email
          <input type="email"
          id='createEmail'
          value={email}
          name="email"
          onChange={({target}) => setEmail(target.value)}
          autoComplete="email"
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="admin"
              checked={roles.includes('admin')}
              onChange={({ target }) => {
                if (target.checked) {
                  setRoles([...roles, 'admin'])
                } else {
                  setRoles(roles.filter(r => r !== 'admin'))
                }
              }}
            />
            Admin
          </label>
        </div>      
        <div>
          password
          <input type="text"
          id='createPassword'
          value={password}
          name="password"
          onChange={({target}) => setPassword(target.value)}
          autoComplete="password"
          />
        </div>
        <button id='submitCreateBtn' type="submit">submit</button>
      </form>
    </>
  )
}
export default NewUserForm