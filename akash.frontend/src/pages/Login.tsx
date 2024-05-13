



import React, { useEffect } from "react";
import { useWeb3Auth } from "../provider/authProvider.js";


const Login = () => {
  const { getBalance, sendTransaction, getUserInfo, getPrivateKeyAndWallet, setLoggedIn, loggedIn, login, logout, status, web3Auth }: any = useWeb3Auth();

  // const { status, web3Auth }: any = useWeb3Auth();
  

  // Use the provided functions as needed
  const handleGetBalance = async () => {
    const balance = await getBalance();
    console.log("Balance:", balance);
  };

  const handleSendTransaction = async () => {
    const destination = "exampleDestinationAddress";
    const denom = "exampleDenom";
    const amount = "100";
    const gas = "200000";
    const result = await sendTransaction(destination, denom, amount, gas);
    console.log("Transaction Result:", result);
  };

  const handleGetUserInfo = async () => {
    const userInfo = await getUserInfo();
    console.log("User Info:", userInfo);
  };

  const unloggedInView = (
    <>
    <button onClick={login} className="card">
      Login
    </button>
      <div>

    </div>
    </>
  );

  const handleGetKey = async () => {
    const { privateKey, wallet } = await getPrivateKeyAndWallet();
    console.log(wallet)
  };

  const loggedInView = (
    <>
      <div>
        {/* Your component JSX */}
        <button onClick={handleGetBalance}>Get Balance</button>
        <button onClick={handleSendTransaction}>Send Transaction</button>
        <button onClick={handleGetUserInfo}>Get User Info</button>
        <button onClick={handleGetKey}>Get private key</button>
        <button onClick={logout}>logout</button>
      
      </div>
    </>
  );


  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & ReactJS (Webpack) Quick Start
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

    </div>

  );
};

export default Login



// import React from "react";
// import { useWeb3Auth } from "../provider/authProvider.js";


// const Login = () => {
//   const { getBalance, sendTransaction, getUserInfo, getPrivateKeyAndWallet, setLoggedIn, loggedIn, login, logout }: any = useWeb3Auth();

//   // Use the provided functions as needed
//   const handleGetBalance = async () => {
//     const balance = await getBalance();
//     console.log("Balance:", balance);
//   };

//   const handleSendTransaction = async () => {
//     const destination = "exampleDestinationAddress";
//     const denom = "exampleDenom";
//     const amount = "100";
//     const gas = "200000";
//     const result = await sendTransaction(destination, denom, amount, gas);
//     console.log("Transaction Result:", result);
//   };

//   const handleGetUserInfo = async () => {
//     const userInfo = await getUserInfo();
//     console.log("User Info:", userInfo);
//   };

//   const unloggedInView = (
//     <button onClick={login} className="card">
//       Login
//     </button>
//   );

//   const handleGetKey = async () => {
//     const { privateKey, wallet } = await getPrivateKeyAndWallet();
//     console.log(wallet)
//   };

//   const loggedInView = (
//     <>
//       <div>
//         {/* Your component JSX */}
//         <button onClick={handleGetBalance}>Get Balance</button>
//         <button onClick={handleSendTransaction}>Send Transaction</button>
//         <button onClick={handleGetUserInfo}>Get User Info</button>
//         <button onClick={handleGetKey}>Get private key</button>
//         <button onClick={logout}>logout</button>
//       </div>
//     </>
//   );


//   return (
//     <div className="container">
//       <h1 className="title">
//         <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
//           Web3Auth{" "}
//         </a>
//         & ReactJS (Webpack) Quick Start
//       </h1>

//       <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
//       <div id="console" style={{ whiteSpace: "pre-line" }}>
//         <p style={{ whiteSpace: "pre-line" }}></p>
//       </div>

//     </div>

//   );
// };

// export default Login