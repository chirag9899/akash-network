import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DemoCard from './pages/DemoCard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import CanvasBackground from './components/CanvasBackground';

const App: React.FC = () => {
  return (
    <Router >
      <Navbar />
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/DemoCards" element={<DemoCard />} />
      </Routes>
    </Router >
  );
};

export default App;
