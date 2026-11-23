import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import '../css/Profile.css';

export default function PageShell({ title, children }) {
  const navigate = useNavigate();
  return (
    <div className="glass-page">
      <Container className="profile-content">
        <div className="sub-head">
          <button type="button" className="back-btn" onClick={() => navigate('/profile')} aria-label="Back to profile">‹</button>
          <h5 className="profile-header">{title}</h5>
        </div>
        {children}
      </Container>
      <BottomNav active="profile" />
    </div>
  );
}