import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {


  const { status, web3Auth , userInfo}: any = useWeb3Auth();


//   export declare const ADAPTER_STATUS: {
//     readonly NOT_READY: "not_ready";
//     readonly READY: "ready";
//     readonly CONNECTING: "connecting";
//     readonly CONNECTED: "connected";
//     readonly DISCONNECTED: "disconnected";
//     readonly ERRORED: "errored";
// };
  return (
    // <Router>
    //   <Navbar />
    //   <Routes>
    //     <Route path="*" element={
    //       status ? <Home /> : <Login />
    //     } />
    //     <Route path="/checkoutForm" element={
    //       status ? <CheckoutForm /> : <Login />
    //     } />
    //     <Route
    //       path="/checkout/"
    //       element={<Checkout />}
    //     />
    //     <Route path="/checkout/" element={<Checkout />} />
    //       <Route path="/DemoCards" element={<DemoCard />} />
    //       <Route path="/return" element={<Return />} />
    //       <Route path="/home" element={<Home />} />
    //       <Route path="/deploy" element={<Deploy />} />
    //   </Routes>
    // </Router>
    <>
    <Router>
      <Navbar />
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
        <Route path="/checkoutForm" element={ status == ADAPTER_STATUS.CONNECTED && <CheckoutForm/> } />
        <Route path="/checkout/"element={  <Checkout/> } />
        <Route path="/DemoCards" element={<DemoCard />} />
        <Route path="/return" element={ status == ADAPTER_STATUS.CONNECTED && <Return />} />
        <Route path="/deploy" element={<Deploy />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
    </>
   

  );
};

export default App;