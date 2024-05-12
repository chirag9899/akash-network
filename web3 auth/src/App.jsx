

  import { useEffect, useState } from "react";
  import { Web3Auth } from "@web3auth/modal";
  import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
  import Web3 from "web3";
  
  import "./App.css";
  import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { StargateClient } from "@cosmjs/stargate";
  // import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
  
  // IMP START - Dashboard Registration
  
  const clientId = "BN-K3fMMEi3w-Iull0MvE-oz7PLPruAEhWEycwxy2sobF4tPQv3DbPKVOxP066wupxVeXYcD80o2DFbtiyZhr5w"
  const secretId = "b930b649d6bba5991f75635a92ef4bb0d15a0047dd7e93bf9bf472144f009fd8"
  // const chainConfig = {
  //   chainId: "0x1", // Please use 0x1 for Mainnet
  //   rpcTarget: "https://rpc.ankr.com/eth",
  //   chainNamespace: CHAIN_NAMESPACES.EIP155,
  //   displayName: "Ethereum Mainnet",
  //   blockExplorerUrl: "https://etherscan.io/",
  //   ticker: "ETH",
  //   tickerName: "Ethereum",
  //   logo: "https://images.toruswallet.io/eth.svg",
  // };

  const chainConfig = {
    chainNamespace: "other",
    chainId: "sandbox-01 ", //
    rpcTarget: "https://rpc.sandbox-01.aksh.pw/",
    // Avoid using public rpcTarget in production.
    displayName: "Akash Testnet",
    ticker: "akash",
    tickerName: "cosmos",
  };
  
  
  const privateKeyProvider = new CommonPrivateKeyProvider({
    config: { chainConfig: chainConfig }
  });
  
  const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider: privateKeyProvider,
  });
  
  function App() {
    const [provider, setProvider] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
  
    useEffect(() => {
      const init = async () => {
        try {
          await web3auth.initModal();
          setProvider(web3auth.provider);
  
          if (web3auth.connected) {
            setLoggedIn(true);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      init();
    }, []);
  
    const login = async () => {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    };
  
    const getUserInfo = async () => {
      const user = await web3auth.getUserInfo();
      uiConsole(user);
    };
  
    const logout = async () => {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      uiConsole("logged out");
    };
  
    const getBalance_cosmos = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
    
      const rpc = "https://rpc.sandbox-01.aksh.pw/";
      const web3 = new Web3(provider);
    
      try {
        // Retrieve private key
        const privateKey = Buffer.from(await privateKeyProvider.request({ method: "private_key" }), "hex");

        console.log(await privateKeyProvider.request({ method: "private_key" }));
        
        // Create wallet
        const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, "akash");
        
        // Generate Akash address
        const accounts = await wallet.getAccounts({ network: "akash" },{prefix:"akash"});
        const address = accounts.length > 0 ? accounts[0].address : null;
    
        if (!address) {
          uiConsole("Failed to generate Akash address.");
          return;
        }
        
        // Connect to Akash Testnet RPC
        const client = await StargateClient.connect(rpc);
        
        // Get the balance
        const balance = await client.getAllBalances(address);

        console.log(balance);
        
        uiConsole(balance);
        return balance
      } catch (error) {
        uiConsole(error.message || error);
      }
    };
    


    const getAccounts = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const web3 = new Web3(provider );
  
      // Get user's Ethereum public address
      const address = await web3.eth.getAccounts();
      uiConsole(address);
    };
  
    const getBalance = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const web3 = new Web3(provider );
  
      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];
  
      // Get user's balance in ether
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address), // Balance is in wei
        "ether"
      );
      uiConsole(balance);
    };
  
    const signMessage = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const web3 = new Web3(provider );
  
      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];
  
      const originalMessage = "YOUR_MESSAGE";
  
      // Sign the message
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        fromAddress,
        "test password!" // configure your own password here.
      );
      uiConsole(signedMessage);
    };
  
    function uiConsole(...args) {
      const el = document.querySelector("#console>p");
      if (el) {
        el.innerHTML = JSON.stringify(args || {}, null, 2);
      }
      console.log(...args);
    }
  
    const loggedInView = (
      <>
        <div className="flex-container">
          <div>
            <button onClick={getUserInfo} className="card">
              Get User Info
            </button>
          </div>
          <div>
            <button onClick={getAccounts} className="card">
              Get Accounts
            </button>
          </div>
          <div>
            <button onClick={getBalance} className="card">
              Get Balance
            </button>
          </div>
          <div>
            <button onClick={signMessage} className="card">
              Sign Message
            </button>
          </div>
          <div>
            <button onClick={logout} className="card">
              Log Out
            </button>
          </div>
          <div>
            <button onClick={async() => { const data = await web3auth.getUserInfo(); console.log("data",data)}} className="card">
              Log account cosmos
            </button>
          </div>
          <div>
            <button onClick={async() => { const data = await getBalance_cosmos(); console.log("data",data)}} className="card">
            get balance cosmos
            </button>
          </div>
        </div>
      </>
    );
  
    const unloggedInView = (
      <button onClick={login} className="card">
        Login
      </button>
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
  
        <footer className="footer">
          <a
            href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/react-modal-quick-start"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source code
          </a>
        </footer>
      </div>
    );
  }
  
  export default App;