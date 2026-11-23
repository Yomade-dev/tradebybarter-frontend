import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import SafeImg from "./SafeImg";

const items = [
  { img: "/public/images/landing/iphone-12.jpg", name: "iPhone 12", meta: "Good · Trade only", accent: "tb-top-teal" },
  { img: "/public/images/landing/hp-laptop.jpg", name: "HP Laptop", meta: "Good · Trade only", accent: "tb-top-amber" },
];

export default function Hero() {
  const [swapped, setSwapped] = useState(false);
  const [a, b] = swapped ? [items[1], items[0]] : items;

  return (
    <header className="tb-hero" id="top">
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <h1>Trade what you have for what you need.</h1>
            <p className="tb-lead">
              List an item you no longer use, say what you want in return, and
              swap with people near you. No cash needed.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/signup" className="tb-btn tb-btn-lg">Start trading</Link>
              <Link to="/Home" className="tb-btn tb-btn-glass tb-btn-lg">Browse listings</Link>
            </div>
          </Col>

          <Col lg={6}>
            <div className="tb-swap" aria-live="polite">
              <div className={`tb-glass tb-swap-card ${a.accent}`}>
                <SafeImg src={a.img} alt={a.name} className="tb-swap-img" />
                <strong>{a.name}</strong>
                <small>{a.meta}</small>
                <span className="tb-tag">{swapped ? "Now yours" : "Yours"}</span>
              </div>

              <button
                className="tb-swap-btn"
                onClick={() => setSwapped(!swapped)}
                aria-label={swapped ? "Undo swap" : "Propose swap"}
              >
                ⇄
              </button>

              <div className={`tb-glass tb-swap-card ${b.accent}`}>
                <SafeImg src={b.img} alt={b.name} className="tb-swap-img" />
                <strong>{b.name}</strong>
                <small>{b.meta}</small>
                <span className="tb-tag">{swapped ? "Their new item" : "Theirs"}</span>
              </div>
            </div>
            <p className="tb-hint">
              {swapped ? "Swap proposed. They get a notification." : "Tap ⇄ to try a swap."}
            </p>
          </Col>
        </Row>
      </Container>
    </header>
  );
}