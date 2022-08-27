import { Navbar, NavDropdown, Container, Nav } from "react-bootstrap";
import { useGlobalState } from "../utils/componentIndex";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { store } = useGlobalState();
  const navigate = useNavigate();

  const handleSelect = (e) => {
    navigate(e);
  };

  const NavBody = () => {
    return (
      <>
        <Nav
          className="justify-content-start flex-grow-1 pe-3"
        >
          <NavDropdown
            title="Dogs"
            id={`offcanvasNavbarDropdown-expand-md`}>
            <NavDropdown.Item eventKey="/dogs/display/male" id="male-dogs">Male Dogs</NavDropdown.Item>
            <NavDropdown.Item eventKey="/dogs/display/female" id="female-dogs">Female Dogs</NavDropdown.Item>
            <NavDropdown.Item eventKey="/dogs/display/retired" id="retired-dogs">Retired Dogs</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Litters"
            id={`offcanvasNavbarDropdown-expand-md`}>
            <NavDropdown.Item eventKey="/litters/apply" id="litter-application">Litter Application</NavDropdown.Item>
            <NavDropdown.Item eventKey="litters/browse">Browse Litters</NavDropdown.Item>
            <NavDropdown.Item eventKey="litters/showcase">Litter Showcase</NavDropdown.Item>
          </NavDropdown>
          {/* <Nav.Link className="nav-link" eventKey="/shows">Shows</Nav.Link> */}
          <Nav.Link className="nav-link" eventKey="/about">About Us</Nav.Link>
          {store.loggedInUser.admin ?
            <>
              <NavDropdown
                title="Admin Panel"
                id={`offcanvasNavbarDropdown-expand-md`}>
                <NavDropdown.Item eventKey="/dogs/display/all" id="all-dogs">View All Dogs</NavDropdown.Item>
                <NavDropdown.Item eventKey="/litters/manage" id="manage-litters">Manage Litters</NavDropdown.Item>
                <NavDropdown.Item eventKey="/dogs/manage" id="manage-dogs">Manage Dogs</NavDropdown.Item>
              </NavDropdown>
            </>
            :
            <>

            </>}
        </Nav>
        {
          store.loggedInUser.username ?
            <Nav fluid="true" className="justify-content-end align-items-end pe-3">
              <NavDropdown
                title={store.loggedInUser.username}
                id={`offcanvasNavbarDropdown-expand-md`}
                align={{ md: 'end' }}
                style={{ textAlign: 'right' }}
              >
                <NavDropdown.Item eventKey={`/user/${store.loggedInUser.id}`} id="view-contacts">Profile</NavDropdown.Item>
                <NavDropdown.Item eventKey="/user/signOut" id="sign-out">Sign Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            :
            <Nav>
              <Nav.Link className="nav-link" eventKey="/user/signIn">Sign In</Nav.Link>
            </Nav>
        }
      </>
    );
  };

  return (
    <>
      <Navbar key='md' bg="light" expand='md' className="mb=3" onSelect={handleSelect} collapseOnSelect>
        <Container fluid>
          <Nav.Link className="navbar-brand" eventKey="/">Myshalair</Nav.Link>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Collapse
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbar-expand-md`}
          >
            <NavBody />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;