import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DemoCard from './pages/DemoCard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { useActiveWalletConnectionStatus } from 'thirdweb/react';
import { chainConfig } from './helper/chainConfig';
import { Web3AuthProvider, useWeb3Auth } from './provider/authProvider';
import CheckoutForm from './components/CheckoutForm';
import { Checkout, Return } from './components/Checkout';
import Deploy from './pages/Deploy';
import { ADAPTER_STATUS } from '@web3auth/base';
import Loader from './components/loader/Loader';
import ErrorPage from './components/ErrorPage';
import logo from './assets/grid.png';

const App: React.FC = () => {


  const { status, web3Auth , userInfo}: any = useWeb3Auth();

  return (
    // <div>
    <div>

    <Router>
      <Navbar />
      {/* <div className='bg-stone-50 h-[90vh]'  style={{ backgroundImage: `url(${logo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}> */}
      <div className="h-full bg-[url('./assets/grid1.png')]" >
      <Routes>
        <Route path="*" element={
          status == ADAPTER_STATUS.CONNECTING &&  <Loader />
          || status == ADAPTER_STATUS.CONNECTED && <Home />
          || status == ADAPTER_STATUS.DISCONNECTED && <Login />
          || status == ADAPTER_STATUS.ERRORED && <ErrorPage/>
          || status == ADAPTER_STATUS.NOT_READY &&  <Loader />
          || status == ADAPTER_STATUS.READY &&  <Login />
          || status == null &&  <Loader />
        } />
        <Route path="/checkoutForm" element={ status == ADAPTER_STATUS.CONNECTED ? <CheckoutForm/> : <Navigate to={"/"}/>} />
        <Route path="/checkout/"element={ status == ADAPTER_STATUS.CONNECTED ? <Checkout/> : <Navigate to={"/"}/> } />
        <Route path="/DemoCards" element={<DemoCard />} />
        <Route path="/return" element={ status == ADAPTER_STATUS.CONNECTED && <Return />} />
        <Route path="/deploy" element={<Deploy />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
        </div>
    </Router>
    </div>
   

  );
};

export default App;