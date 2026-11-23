import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../Api';
import { clearSession } from "../utils/auth";
import '../css/Auth.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearSession();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/Home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-screen d-flex flex-column justify-content-center align-items-center">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="auth-form">
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="" className="signin-btn w-100" disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </Button>
        </Form>

        <p className="create-account">
          Don't have an account? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </Container>
  );
};

export default Auth;