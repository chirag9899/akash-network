
import React from "react";
import { useWeb3Auth } from "./provider/authProvider.jsx";


const Home = () => {
  const { getBalance, sendTransaction, getUserInfo } = useWeb3Auth();

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

  return (
    <div>
      {/* Your component JSX */}
      <button onClick={handleGetBalance}>Get Balance</button>
      <button onClick={handleSendTransaction}>Send Transaction</button>
      <button onClick={handleGetUserInfo}>Get User Info</button>
    </div>
  );
};

export default Home;
