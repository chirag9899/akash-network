import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";

const Web3AuthContext = createContext();

const Web3AuthProvider = ({ children, chainConfig }) => {

  const [web3Auth, setWeb3AuthInstance] = useState(null);
  const [privateKeyProvider, setPrivateKeyProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState(null);

  const isInitializedRef = useRef(false);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        if (isInitializedRef.current) return; // Already initialized, skip.

        const provider = new CommonPrivateKeyProvider({
          config: { chainConfig }
        });
        setPrivateKeyProvider(provider);

        const web3authInstance = new Web3Auth({
          clientId: chainConfig.clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider: provider,
        });
        await web3authInstance.initModal();
        console.log("Wallet initialized successfully");
        if (web3authInstance.connected) {
          setLoggedIn(true);
        }
        setWeb3AuthInstance(web3authInstance);
        isInitializedRef.current = true; // Mark as initialized
      } catch (error) {
        console.error("Error initializing wallet:", error);
        throw new Error(error.message || error);
      }
    };

    initWeb3Auth();
  }, [chainConfig]);

  const login = async () => {
    const web3authProvider = await web3Auth.connect();
    setProvider(web3authProvider);
    if (web3Auth.connected) {
      setLoggedIn(true);
    }
  };

  const logout = async () => {
    await web3Auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getPrivateKeyAndWallet = async () => {
    try {
      if (!web3Auth || !privateKeyProvider) {
        throw new Error("Web3Auth or private key provider not initialized");
      }

      if (!privateKeyProvider) {
        throw new Error("No private key provider");
      }
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
    try {
      
      if (!web3Auth || !privateKeyProvider) {
        throw new Error("Web3Auth or private key provider not initialized");
      }

      const { privateKey, wallet } = await getPrivateKeyAndWallet();
      const accounts = await wallet.getAccounts({ network: chainConfig.ticker }, { prefix: chainConfig.ticker });
      const address = accounts.length > 0 ? accounts[0].address : null;

      if (!address) {
        throw new Error(`Failed to generate ${chainConfig.displayName} address.`);
      }

      const client = await connectStargateClient();
      const balance = await client.getAllBalances(address);
      return {address,balance};
    } catch (error) {
      throw new Error(error.message || error);
    }
  };

  const sendTransaction = async (destination, denom, amount, gas) => {
    if (!web3Auth || !privateKeyProvider) {
      throw new Error("Web3Auth or private key provider not initialized");
    }

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
    if (!web3Auth || !privateKeyProvider) {
      throw new Error("Web3Auth or private key provider not initialized");
    }

    try {
      return await web3Auth.getUserInfo();
    } catch (error) {
      console.error("here",error);
      throw new Error(error.message || error);
    }
  };

  return (
    <Web3AuthContext.Provider value={{ getBalance, sendTransaction, getUserInfo, getPrivateKeyAndWallet,loggedIn, setLoggedIn, login, logout }}>
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
