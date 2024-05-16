



import React, { useEffect } from "react";
import { useWeb3Auth } from "../provider/authProvider.js";
import logo from "../assets/akash.png";


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
    <>
      <div className="flex flex-col items-center justify-between space-y-10  py-32">
        <div className='px-10 py-10 flex flex-col items-center gap-2'>
          <img src={logo} alt="logo" className='h-40' />
          <div className='py-5  text-bold font-bold text-5xl'>
            Welcome to akash Network
          </div>
        </div>
        <div>
          <div className=" bg-akash-red flex w-full p-4 rounded-lg spaxe-x-2 space-y-2 text-white" >{unloggedInView} </div>
        </div>
      </div>

    </>

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