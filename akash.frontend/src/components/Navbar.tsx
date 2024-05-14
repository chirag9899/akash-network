import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useActiveWalletConnectionStatus, ThirdwebProvider, ConnectButton, lightTheme, useDisconnect, useActiveWallet } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { Wallet, inAppWallet } from 'thirdweb/wallets';
import Dropdown from '../components/DropDown';
import { useWeb3Auth } from '../provider/authProvider';
import logo from '../assets/akashLogoFull.svg';



const Navbar: React.FC = () => {
  // const connectionStatus = useActiveWalletConnectionStatus();
  const { status, web3Auth, getUserInfo, getBalance }: any = useWeb3Auth();
  const [userInfo, setUserInfo] = useState<any>(null);


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo();
        console.log(info)
        setUserInfo(info);
      } catch (error) {
        console.error("hello",error);
      }
    };

    fetchUserInfo();
  }, [getUserInfo]);

  const navigate = useNavigate()
  return (
    <nav className="bg-transparent border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <img src={logo} alt="akash logo" className="cursor-pointer h-5" onClick={() => navigate("/")} />

        <div className="flex items-center gap-2 font-mono">
          {/* <Link to="/home" className="text-gray-800 hover:text-gray-900 mx-2 py-2 rounded-md text-sm font-medium">Home</Link> */}
          {/* <Link to="/login" className="text-gray-800 hover:text-gray-900 mx-2 py-2 rounded-md text-sm font-medium">Login</Link> */}
          <Link to="/DemoCards" className="text-gray-800 hover:text-gray-900 mx-2 py-2 rounded-md text-sm font-medium">DemoCards</Link>
          {status && userInfo && (
          <Dropdown userInfo={userInfo} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
