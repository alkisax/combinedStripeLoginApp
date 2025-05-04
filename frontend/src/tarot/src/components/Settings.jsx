import 'bootstrap/dist/css/bootstrap.min.css';
import InnerSettings from "./InnerSettings";
import { useState } from "react";

const Settings = ({ setBias }) => {
  const password = 'settings'
  const [ newPasword, setNewPassword] = useState('')
  const [ isPassed, setIsPassed ] = useState(false)

  const handlePassChange = (event) => {
    console.log(event.target.value)
    setNewPassword(event.target.value)
  }
  const checkPass = (event) => {
    event.preventDefault()
    if (newPasword === password) {
      setIsPassed(true)
    }
    setNewPassword('')
  }

  return(
    <div>
      {isPassed ? (
        <div>
          <InnerSettings setBias={setBias} />
        </div>
      ) : (
        <div className="mb-3">
          <h4 className="mb-2" style={{ fontSize: '0.7rem' }}>Password for settings:</h4>
          <form onSubmit={checkPass} className="d-flex align-items-center">
            <input
              type="text"
              value={newPasword}
              onChange={handlePassChange}
              className="form-control me-1 p-1" // More reduced padding and margin
              placeholder="Enter settings password"
              style={{ fontSize: '0.65rem' }} // Smaller input text
            />
            <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Submit</button> 
          </form>
        </div>
      )}

    </div>
  )
}

export default Settings