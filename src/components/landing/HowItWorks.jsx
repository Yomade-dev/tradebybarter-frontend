import { Container, Row, Col } from "react-bootstrap";

const steps = [
  { title: "List your item", text: "Add a photo, a short description, and what you'd like in return.", accent: "tb-top-teal" },
  { title: "Make an offer", text: "Find a listing you want and propose a trade. Chat to agree the details.", accent: "tb-top-amber" },
  { title: "Meet and trade", text: "Meet in a public place, check the item, and swap. Then rate each other.", accent: "tb-top-teal" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="tb-section">
      <Container>
        <div className="tb-head">
          <div>
            <h2>Three steps to a trade</h2>
          </div>
        </div>

        <Row className="g-3">
          {steps.map((s, i) => (
            <Col md={4} key={s.title}>
              <div className={`tb-glass tb-step ${s.accent}`}>
                <span className="tb-step-n">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}