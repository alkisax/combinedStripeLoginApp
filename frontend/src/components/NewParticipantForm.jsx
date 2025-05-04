/* eslint-disable no-unused-vars */
import {useState} from 'react'
import axios from 'axios'

const NewParticipantForm = ({ url, participants, setParticipants }) =>{
  const [surname, setSurname] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmitParticipant = async (event) => {
    event.preventDefault()
    
    try {
      const newParticipant = {
        "name": name,
        "surname": surname,
        "email": email
      }

      const response = await axios.post(`${url}/participant`, newParticipant)

      console.log('✅ participant created:', response.data)
      alert('Participant created successfully!')

      // Clear the form if needed
      setSurname('')
      setName('')
      setEmail('')

      // αυτη η μορφή ανανέωσης του state είναι σωστή γιατή μου κάνει refresh την σελίδα
      setParticipants(current => [...current, response.data]); // Take the current state (users) and add the new user (response.data) to the end of the array
    } catch (error) {
      console.error('Error creating participant:', error)
    }
  }


  return (
    <>
      <form onSubmit={handleSubmitParticipant}>
        <div>
          name
          <input type="text"
          id='createName'
          value={name}
          name="username"
          onChange={({target}) => setName(target.value)}
          autoComplete="Name"
          />
        </div>
        <div>
          Surname
          <input type="text"
          id='createSurname'
          value={surname}
          name="surname"
          onChange={({target}) => setSurname(target.value)}
          autoComplete="Surname"
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
        <button id='submitCreateBtn' type="submit">submit</button>
      </form>
    </>
  )
}
export default NewParticipantForm