import React, { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";

const Web3AuthContext = createContext();

const Web3AuthProvider = ({ children, chainConfig }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const privateKeyProvider = new CommonPrivateKeyProvider({
    config: { chainConfig }
  });

  const web3auth = new Web3Auth({
    clientId: chainConfig.clientId,
    web3AuthNetwork: chainConfig.web3AuthNetwork,
    privateKeyProvider: privateKeyProvider,
  });

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setIsInitialized(true);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const getPrivateKeyAndWallet = async () => {
    try {
      const privateKey = Buffer.from(await privateKeyProvider.request({ method: "private_key" }), "hex");
      const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, chainConfig.ticker);
      return { privateKey, wallet };
    } catch (error) {
      throw new Error(error.message || error);
    }
  };

  const connectStargateClient = async () => {
    const rpc = chainConfig.rpcTarget;
    return await StargateClient.connect(rpc);
  };

  const getBalance = async () => {
    if (!isInitialized) return;

    try {
      const { privateKey, wallet } = await getPrivateKeyAndWallet();
      const accounts = await wallet.getAccounts({ network: chainConfig.ticker }, { prefix: chainConfig.ticker });
      const address = accounts.length > 0 ? accounts[0].address : null;

      if (!address) {
        throw new Error(`Failed to generate ${chainConfig.displayName} address.`);
      }

      const client = await connectStargateClient();
      const balance = await client.getAllBalances(address);
      return balance;
    } catch (error) {
      throw new Error(error.message || error);
    }
  };

  const sendTransaction = async (destination, denom, amount, gas) => {
    if (!isInitialized) return;

    try {
      const rpc = chainConfig.rpcTarget;
      const { privateKey, wallet } = await getPrivateKeyAndWallet();
      const fromAddress = (await wallet.getAccounts())[0].address;
      const signer = await DirectSecp256k1Wallet.fromKey(privateKey, chainConfig.ticker);
      const signingClient = await SigningStargateClient.connectWithSigner(rpc, signer);
      const result = await signingClient.sendTokens(fromAddress, destination, [{ denom, amount }], { amount: [{ denom, amount }], gas });
      const transactionHash = result.transactionHash;
      const height = result.height;
      return { transactionHash, height };
    } catch (error) {
      throw new Error(error.message || error);
    }
  };

  const getUserInfo = async () => {
    if (!isInitialized) return;

    try {
      return await web3auth.getUserInfo();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Web3AuthContext.Provider value={{ getBalance, sendTransaction, getUserInfo }}>
      {children}
    </Web3AuthContext.Provider>
  );
};

const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};

export { Web3AuthProvider, useWeb3Auth };
