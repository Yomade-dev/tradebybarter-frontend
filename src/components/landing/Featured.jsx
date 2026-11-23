import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import SafeImg from "./SafeImg";

const listings = [
  { img: "iPhone-12.jpg", name: "iPhone 12", wants: "A laptop", meta: "Good · Trade only", accent: "tb-top-teal" },
  { img: "hp-laptop.jpg", name: "HP Laptop", wants: "A phone", meta: "Good · Trade only", accent: "tb-top-amber" },
  { img: "camera.jpg", name: "Canon DSLR", wants: "A 32-inch monitor", meta: "Like new · Trade only", accent: "tb-top-teal" },
  { img: "headphones.jpg", name: "Sony headphones", wants: "A mechanical keyboard", meta: "Good · Trade only", accent: "tb-top-amber" },
];

export default function Featured() {
  return (
    <section id="featured" className="tb-section">
      <Container>
        <div className="tb-head">
          <div>
            <h2>Featured listings</h2>
            <p className="tb-sub">Someone is looking for what you have.</p>
          </div>
          <Link to="/Home" className="tb-btn tb-btn-glass">See all listings</Link>
        </div>

        <Row className="g-3">
          {listings.map((l) => (
            <Col xs={6} lg={3} key={l.name}>
              <article className={`tb-glass tb-listing ${l.accent}`}>
                <SafeImg src={`/images/landing/${l.img}`} alt={l.name} className="tb-listing-img" />
                <div className="tb-listing-body">
                  <h3>{l.name}</h3>
                  <small>{l.meta}</small>
                  <p>Wants: <strong>{l.wants}</strong></p>
                  <Link to="/Home" className="tb-btn tb-btn-sm">Offer a trade</Link>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}