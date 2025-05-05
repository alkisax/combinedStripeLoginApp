/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect  } from "react"
import { Link } from 'react-router-dom'
import axios from 'axios'
import Participants from './Participants'
import Transactions from './Transactions'


const AdminPanel = ({url, handleDeleteParticipant, participants, setParticipants}) => {

  const [loading, setLoading] = useState(true)
  const [showParticipants, setShowParticipants] = useState(false);

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

      <button onClick={() => setShowParticipants(!showParticipants)} className="btn btn-primary">
        {showParticipants && 'Hide Participants'}
        {!showParticipants && 'Show Participants'}
      </button>

      <Participants
        loading={loading}
        participants={participants}
        handleDeleteParticipant={handleDeleteParticipant}
        setParticipants={setParticipants}
        url={url}
        showParticipants={showParticipants}
      />

    </div>
  )
}

export default AdminPanel