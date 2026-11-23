import { Container, Row, Col } from "react-bootstrap";

const points = [
  { title: "Keep your money", text: "Get what you need without spending cash." },
  { title: "Verified members", text: "Every member confirms their phone number before listing." },
  { title: "Ratings after every trade", text: "See a member's trade history before you meet them." },
  { title: "Safe meet-up spots", text: "We suggest busy public places close to both of you." },
];

export default function WhySwap() {
  return (
    <section id="why" className="tb-section">
      <Container>
        <div className="tb-glass tb-why">
          <Row className="g-4">
            <Col lg={4}>
              <h2>Built for fair trades</h2>
              <p className="tb-sub">Trading works when both sides feel safe and sure.</p>
            </Col>
            <Col lg={8}>
              <Row className="g-4">
                {points.map((p) => (
                  <Col sm={6} key={p.title}>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
}