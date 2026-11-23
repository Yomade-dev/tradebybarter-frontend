import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaLinkedinIn,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa6";

const socials = [
  { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/yomzy_g?mdxt=dmo4Y2dncDlqN2l1&utm_source=qr" },
  { name: "X", icon: FaXTwitter, href: "#" },
  { name: "TikTok", icon: FaTiktok, href: "#" },
  { name: "LinkedIn", icon: FaLinkedinIn, href: "#" },
];

export default function Footer() {
  return (
    <footer className="tb-footer">
      <Container>
        <Row className="g-4">
          <Col md={6} lg={3}>
            {/* To use your logo image instead:
                <img src="/images/logo.png" alt="TradeByBarter" height="40" /> */}
            <span className="tb-brand tb-footer-brand">TradeByBarter</span>
            <p className="tb-footer-about">
              A cashless trading platform. Exchange goods, skills and services
              without spending money.
            </p>
            <div className="tb-socials">
              {socials.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="tb-social"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </Col>

          <Col xs={6} md={3} lg={3}>
            <h4>Platform</h4>
            <ul>
              <li><Link to="/Home">Browse listings</Link></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#why">Safety</a></li>
              <li><Link to="/help">Help</Link></li>
            </ul>
          </Col>

          <Col xs={6} md={3} lg={3}>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </Col>

          <Col md={6} lg={3}>
            <h4>Download app</h4>
            <a href="#" className="tb-store">
              <FaGooglePlay className="tb-store-icon" />
              <span>
                <strong>Google Play</strong>
                <small className="tb-soon">Coming soon</small>
              </span>
            </a>
            <div className="tb-store">
              <FaApple className="tb-store-icon" />
              <span>
                <strong>App Store</strong>
                <small className="tb-soon">Coming soon</small>
              </span>
            </div>
          </Col>
        </Row>

        <div className="tb-footer-bottom">
          <small>© {new Date().getFullYear()} TradeByBarter. All rights reserved.</small>
        </div>
      </Container>
    </footer>
  );
}