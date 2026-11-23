import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import logo from "../assets/barter logo1.jpeg"
import '../css/SplashScreen.css';


const SplashScreen = () => {
  const [isLight, setIsLight] = useState(false);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLight(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);
const navigate = useNavigate();

 const handleNext = () => {
  navigate('/auth');
};

  return (
    <Container
      fluid
      className={`splash-screen d-flex flex-column justify-content-center align-items-center ${
        isLight ? 'splash-light' : ''
      }`}
    >
      {!isLight ? (
        <>
          <img src={logo} className="logo" alt="TradeByBarter logo" />
          <h4 className="brand-name">TradeByBarter</h4>
          <div className="loading-indicator mt-5"></div>
        </>
      ) : (
        <>
          <img src={logo} className="logo" alt="TradeByBarter logo" />
          <h2 className="tagline">Trade what you have</h2>
          <h6 className="secTagLine">List an item and say what you need.</h6>
          <Button className="next-btn" onClick={handleNext}>
            NEXT
          </Button>
        </>
      )}
    </Container>
  );
};

export default SplashScreen;

