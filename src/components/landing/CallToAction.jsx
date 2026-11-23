import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section id="join" className="tb-section">
      <Container>
        <div className="tb-glass tb-cta tb-top-amber">
          <h2>Got something lying around?</h2>
          <p>Create a free account and list your first item in under two minutes.</p>
          <Link to="/signup" className="tb-btn tb-btn-lg">Create free account</Link>
        </div>
      </Container>
    </section>
  );
}