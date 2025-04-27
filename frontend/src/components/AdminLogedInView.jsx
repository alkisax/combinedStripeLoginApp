
const AdminLogedInView = ({ handleLogout, userIsAdmin, handleAdminBtn }) => {
  return (
    <>
      <h1>Welcome Admin</h1>
      {/* <Checkout /> */}
      <button id="logoutBtn" onClick={handleLogout}>log out</button>
      {userIsAdmin &&
        <button id="adminBtn" onClick={handleAdminBtn}>admin panel</button> 
      }
    </>
  )
}

export default AdminLogedInView