import { useState  } from "react"
import { Link } from "react-router-dom"
import NewParticipantForm from './NewParticipantForm'

const Participants = ({ loading, participants, handleDeleteParticipant, showParticipants, setParticipants, url}) => {

  const [viewForm, setViewForm] = useState(false)


  return (
    <>
      {showParticipants && (
        <>
          {loading && <p>Loading...</p>}
          
          {!loading && participants.length === 0 && <p>No participants found</p>}
  
          <ul>
            {!loading && participants.length !== 0 &&
              participants.map((participant) => (
                <li key={participant._id || `${participant.name}-${participant.email}`}>
                  {/* // αν κάνεις κλικ σε έναν καταθέτη σε οδηγη σε δικιά του σελίδα 
                  // στο App.jsx έχει:
                  // <Route path="/users" element={<AdminPanel handleDeleteUser={handleDeleteParticipant} url={url} />} />
                  // <Route path="/users/:id" element={<UserDetail />} /> */}
                  <Link to={`/participant/${participant._id}`}>
                    {participant.email}
                  </Link>
                  - {participant.name} - {participant.email} - {participant.surname}
                  <button id={`${participant.email}Btn`} onClick={() => handleDeleteParticipant(participant._id)}>Delete</button>
                </li>
              ))
            }
          </ul>

{/* // κάνει toggle την φορμα για δημιουργεία νεόυ πελάτη  */}
          <button id="createParticipantBtn" onClick={() => setViewForm(!viewForm)}>
            create participant form
          </button>
  
          {viewForm && 
            <NewParticipantForm 
              users={participants} 
              setUsers={setParticipants} 
              url={url} 
            />}
        </>
      )}
    </>
  )
}

export default Participants