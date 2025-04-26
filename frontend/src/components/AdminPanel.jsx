/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect  } from "react"
import { Link } from 'react-router-dom'
import axios from 'axios'
import NewUserForm from './NewUserForm'

const AdminPanel = ({url, handleDeleteUser, users, setUsers}) => {
  const [viewForm, setViewForm] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get(`${url}/users`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setUsers(response.data.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); 
      }
    };

    fetchUsers();
  }, [url]);

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Only admins can see this.</p>
      {loading && <p>Loading...</p>}
      {!loading && users.length === 0 && <p>No users found</p>}
      <ul>
        {!loading && users.length !== 0 && 
          users.map((user) => {
            return (
              <li key={user._id || `${user.username}-${user.email}`}>
                 <Link to={`/users/${user._id}`}>
                  {user.username}
                 </Link>
                 - {user.name} - {user.email} - {user.roles.join(", ")}
                 <button id={`${user.username}Btn`} onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </li>
            )
          })
        } 
      </ul>

      <button id="createUserBtn" onClick={() => setViewForm(!viewForm)}>create user form</button>
      {viewForm && <NewUserForm users={users} setUsers={setUsers} url={url} />}

    </div>
  )
}

export default AdminPanel