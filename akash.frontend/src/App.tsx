import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DemoCard from './pages/DemoCard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { useActiveWalletConnectionStatus } from 'thirdweb/react';
import { chainConfig } from './chainConfig';
import { Web3AuthProvider } from './provider/authProvider';


const App: React.FC = () => {

  const walletConnectionStatus = useActiveWalletConnectionStatus();

  return (
    // <CanvasBackgroundProvider>
    //     </CanvasBackgroundProvider>
    <Web3AuthProvider chainConfig={chainConfig}>
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={
          walletConnectionStatus === "connected"  ? <Home /> : <Login />
        } />
        
        {/* <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/DemoCards" element={<DemoCard />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/return" element={<Return />} /> */}
      </Routes>
    </Router>
    </Web3AuthProvider>
  );
};

export default App;