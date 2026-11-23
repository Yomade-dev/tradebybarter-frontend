import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SiteNavbar() {
  return (
    <Navbar expand="md" sticky="top" className="tb-nav" data-bs-theme="dark" collapseOnSelect>
      <Container>
        <Navbar.Brand href="#top" className="tb-brand">TradeByBarter</Navbar.Brand>
        <Navbar.Toggle aria-controls="tb-menu" />
        <Navbar.Collapse id="tb-menu">
          <Nav className="ms-auto align-items-md-center gap-md-2">
            <Nav.Link href="#categories">Categories</Nav.Link>
            <Nav.Link href="#how">How it works</Nav.Link>
            <Nav.Link href="#featured">Listings</Nav.Link>
            <Nav.Link href="#why">Why us</Nav.Link>
            <Link to="/Auth" className="tb-btn tb-btn-glass ms-md-2">Log in</Link>
            <Link to="/signup" className="tb-btn">Get started</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}