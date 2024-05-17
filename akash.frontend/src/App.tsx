import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DemoCard from './pages/DemoCard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import {  useWeb3Auth } from './provider/authProvider';
import CheckoutForm from './components/CheckoutForm';
import { Checkout, Return } from './components/Checkout';
import Deploy from './pages/Deploy';
import { ADAPTER_STATUS } from '@web3auth/base';
import Loader from './components/loader/Loader';
import ErrorPage from './components/ErrorPage';
import { useEffect, useState } from 'react';
import CommingSoon from './components/CommingSoon';

const App: React.FC = () => {


  const { status }: any = useWeb3Auth();
  const [showScreen, setShowScreen] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setShowScreen(window.innerWidth <= 730);
    };
  
    // Call the function once to set the initial state
    handleResize();
  
    // Add the event listener
    window.addEventListener('resize', handleResize);
  
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  console.log(window.screen.width)
  return (


    showScreen ? <>
      <CommingSoon/>
    </> : <>
      <Router>
        <Navbar />
        <div className="h-full bg-[url('./assets/grid1.png')]" >
          <Routes>
            <Route path="*" element={
              status == ADAPTER_STATUS.CONNECTING && <Loader />
              || status == ADAPTER_STATUS.CONNECTED && <Home />
              || status == ADAPTER_STATUS.DISCONNECTED && <Login />
              || status == ADAPTER_STATUS.ERRORED && <ErrorPage />
              || status == ADAPTER_STATUS.NOT_READY && <Loader />
              || status == ADAPTER_STATUS.READY && <Login />
              || status == null && <Loader />
            } />
            <Route path="/checkoutForm" element={status == ADAPTER_STATUS.CONNECTED ? <CheckoutForm /> : <Navigate to={"/"} />} />
            <Route path="/checkout/" element={status == ADAPTER_STATUS.CONNECTED ? <Checkout /> : <Navigate to={"/"} />} />
            <Route path="/DemoCards" element={<DemoCard />} />
            <Route path="/return" element={status == ADAPTER_STATUS.CONNECTED && <Return />} />
            <Route path="/deploy" element={<Deploy />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    </>




  );
};

export default App;