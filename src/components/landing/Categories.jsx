import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import SafeImg from "./SafeImg";

const categories = [
  { img: "phones.jpg", name: "Phones & gadgets" },
  { img: "fashion.jpg", name: "Fashion" },
  { img: "home.jpg", name: "Home & kitchen" },
  { img: "books.jpg", name: "Books & study" },
  { img: "gaming.jpg", name: "Games & consoles" },
  { img: "sports.jpg", name: "Sports & bikes" },
];

export default function Categories() {
  return (
    <section id="categories" className="tb-section">
      <Container>
        <div className="tb-head">
          <div>
            <h2>Find something to trade for</h2>
            <p className="tb-sub">Browse by category, or list your own item in any of them.</p>
          </div>
        </div>

        <Row className="g-3">
          {categories.map((c) => (
            <Col xs={6} md={4} key={c.name}>
              <Link to="/Home" className="tb-cat">
                <SafeImg src={`/images/landing/${c.img}`} alt={c.name} className="tb-cat-img" />
                <span className="tb-cat-label">{c.name}</span>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}