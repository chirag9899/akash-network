import React, { useEffect } from 'react';
import { createThirdwebClient } from 'thirdweb';
import {
  ThirdwebProvider,
  ConnectButton,
  lightTheme,
  ConnectEmbed,
} from "thirdweb/react";
import { inAppWallet, } from "thirdweb/wallets";
import { useActiveWalletConnectionStatus } from 'thirdweb/react';


import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


const client = createThirdwebClient({
  clientId: import.meta.env.VITE_APP_THIRDWEB_CLIENT_ID,
});

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

const Login: React.FC = () => {

  const navigate = useNavigate();
  const connectionStatus = useActiveWalletConnectionStatus();
  console.log(connectionStatus);

  
  useEffect(() => {
    if (connectionStatus == "connected") {
      console.log("connected to home");
      navigate("/home");
    }
  }, [connectionStatus])

  return (
    <div className="flex items-center justify-center min-h-screen " >
      <ThirdwebProvider>
        <ConnectEmbed
          client={client}
          wallets={wallets}
          theme={lightTheme({
            colors: { accentButtonBg: "#fd3f4a" },
          })}
          onConnect={() => {

          }}



        // connectModal={{
        //   size: "compact",
        //   title: "Sign in ",
        //   titleIcon:
        //     "https://i.postimg.cc/3RDLnLmG/akash-logo-Czd-Yko-VW-2sjg-Hi-3.png",
        //   showThirdwebBranding: false,
        // }}
        />
        {/* <ConnectEmbed
        theme="dark"
        onConnect={() => {
          console.log("connected");
          // you can also redirect to a different page using Next.js router
        }}
      /> */}
      </ThirdwebProvider>
    </div>
  );
};

export default Login;
