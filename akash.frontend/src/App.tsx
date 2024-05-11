import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DemoCard from './pages/DemoCard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { CheckoutForm, Return } from './components/Checkout';
import { CanvasBackgroundProvider } from './components/CanvasBackground';


const App: React.FC = () => {
  return (
    <div className="relative z-10">
      <CanvasBackgroundProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/DemoCards" element={<DemoCard />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/return" element={<Return />} />
          </Routes>
        </Router>
      </CanvasBackgroundProvider>
    </div>
  );
};

export default App;