import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from "./pages/Landing";
import SplashScreen from './pages/SplashScreen';
import Auth from './pages/Auth';
import Signup from './pages/SignUp';
import Profile from './pages/Profile';
import About from './pages/About';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import MyListings from "./pages/MyListings";
import SavedItems from "./pages/SavedItems";
import TradeHistory from "./pages/TradeHistory";
import Settings from "./pages/Settings";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/SplashScreen" element={<SplashScreen />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/About" element={<About />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/saved" element={<SavedItems />} />
        <Route path="/trade-history" element={<TradeHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;