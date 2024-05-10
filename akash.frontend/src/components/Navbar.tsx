import React from 'react';
import { Link } from 'react-router-dom';
import { useActiveWalletConnectionStatus, ThirdwebProvider, ConnectButton, lightTheme, useDisconnect, useActiveWallet } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { Wallet, inAppWallet } from 'thirdweb/wallets';
import Dropdown from '../components/DropDown';


const Navbar: React.FC = () => {
  const connectionStatus = useActiveWalletConnectionStatus();
  const client = createThirdwebClient({
    clientId: import.meta.env.VITE_APP_THIRDWEB_CLIENT_ID,
  });
  
  // const { logout, isLoading } = useLogout();
  const { disconnect } = useDisconnect();
  const wallet: Wallet | undefined = useActiveWallet();



  const wallets = [
    inAppWallet({
      auth: {
        options: [
          "email",
          "google",
          "apple",
          "facebook",
          "phone",
        ],
      },
    }),
  ];

  return (
    <nav className="bg-transparent border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="text-lg font-semibold text-gray-900">My App</div>
        <div className="flex items-center">
          <Link to="/home" className="text-gray-800 hover:text-gray-900 mx-2 py-2 rounded-md text-sm font-medium">Home</Link>
          <Link to="/login" className="text-gray-800 hover:text-gray-900 mx-2 py-2 rounded-md text-sm font-medium">Login</Link>
          <Link to="/DemoCards" className="text-gray-800 hover:text-gray-900 mx-2 py-2 rounded-md text-sm font-medium">Demo Cards</Link>
          {connectionStatus === "connected" && (
          <Dropdown />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
