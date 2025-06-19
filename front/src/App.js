import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from './pages/index';
import LoginPage from './pages/Connexion/LoginPage';
import SignupPage from './pages/inscription/SignupPage';
import Profile from './pages/Profile/Profile';

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/chat" element={<Index />} />
          <Route path="/editprofile" element={<Profile />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
  );
};

export default App;
