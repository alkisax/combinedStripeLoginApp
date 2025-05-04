import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, Routes, Route } from 'react-router-dom';

const Appbar = ({ admin, handleLogout }) => {

  const padding = {
    paddingRight: 5,
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">

          <Nav.Link as={Link} to="/" style={padding}>
            Home
          </Nav.Link>

          <Nav.Link as={Link} to="/buymeacoffee" style={padding}>
            Buy me a coffee
          </Nav.Link>

          {admin ? (
            <div className="d-flex flex-column align-items-start ml-auto" style={{ padding }}>
              <em style={{ paddingRight: 10 }}>{admin.token ? 'Admin logged in' : 'Logged in'}</em>
              <Nav.Link as={Link} to="/admin" style={padding}>
                Admin Pannel
              </Nav.Link>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Nav.Link as={Link} to="/login" style={padding}>
              Admin Login
            </Nav.Link>
          )}

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Appbar