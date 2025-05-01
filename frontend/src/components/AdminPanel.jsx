/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect  } from "react"
import { Link } from 'react-router-dom'
import axios from 'axios'
import NewParticipantForm from './NewParticipantForm'
import Transactions from './Transactions'

const AdminPanel = ({url, handleDeleteParticipant, participants, setParticipants}) => {
  const [viewForm, setViewForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem("token"); 
        
        const response = await axios.get(`${url}/participant`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setParticipants(response.data.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); 
      }
    };

    fetchParticipants();
  }, [url]);

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Only admins can see this.</p>
      <Transactions url={url} />
      {loading && <p>Loading...</p>}
      {!loading && participants.length === 0 && <p>No participants found</p>}
      <ul>
        {!loading && participants.length !== 0 && 
          participants.map((participant) => {
            return (
              <li key={participant._id || `${participant.name}-${participant.email}`}>
                 <Link to={`/users/${participant._id}`}>
                  {participant.email}
                 </Link>
                 - {participant.name} - {participant.email} - {participant.surname}
                 <button id={`${participant.email}Btn`} onClick={() => handleDeleteParticipant(participant._id)}>Delete</button>
              </li>
            )
          })
        } 
      </ul>

      <button id="createParticipantBtn" onClick={() => setViewForm(!viewForm)}>create participant form</button>
      {viewForm && <NewParticipantForm users={participants} setUsers={setParticipants} url={url} />}

    </div>
  )
}

export default AdminPanel