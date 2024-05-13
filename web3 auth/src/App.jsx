
import { useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import "./App.css";
import { Web3AuthProvider } from "./provider/authProvider";
import Home from "./Home";


const clientId = "BN-K3fMMEi3w-Iull0MvE-oz7PLPruAEhWEycwxy2sobF4tPQv3DbPKVOxP066wupxVeXYcD80o2DFbtiyZhr5w"
const secretId = "b930b649d6bba5991f75635a92ef4bb0d15a0047dd7e93bf9bf472144f009fd8"

const chainConfig = {
  chainNamespace: "other",
  chainId: "sandbox-01",
  rpcTarget: "https://rpc.sandbox-01.aksh.pw/",
  displayName: "Akash Testnet",
  ticker: "akash",
  tickerName: "cosmos",
  clientId: "BN-K3fMMEi3w-Iull0MvE-oz7PLPruAEhWEycwxy2sobF4tPQv3DbPKVOxP066wupxVeXYcD80o2DFbtiyZhr5w"

};



const App = () => {

  return (
  <Web3AuthProvider chainConfig={chainConfig}>
     <Home/>
  </Web3AuthProvider>
  );
};

export default App;



// const privateKeyProvider = new CommonPrivateKeyProvider({
//   config: { chainConfig: chainConfig }
// });

// const web3auth = new Web3Auth({
//   clientId,
//   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
//   privateKeyProvider: privateKeyProvider,
// });

// const connectStargateClient = async () => {
//   const rpc = "https://rpc.sandbox-01.aksh.pw/";
//   return await StargateClient.connect(rpc);
// };

// const getPrivateKeyAndWallet = async () => {
//   try {
//     const privateKey = Buffer.from(await privateKeyProvider.request({ method: "private_key" }), "hex");
//     const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, "akash");
//     return { privateKey, wallet };
//   } catch (error) {
//     throw new Error(error.message || error);
//   }
// };

// const getBalance = async () => {
//   try {
//     const { privateKey, wallet } = await getPrivateKeyAndWallet();
//     const accounts = await wallet.getAccounts({ network: "akash" }, { prefix: "akash" });
//     const address = accounts.length > 0 ? accounts[0].address : null;

//     if (!address) {
//       throw new Error("Failed to generate Akash address.");
//     }

//     const client = await connectStargateClient();
//     const balance = await client.getAllBalances(address);
//     return balance;
//   } catch (error) {
//     throw new Error(error.message || error);
//   }
// };

// const sendTransaction = async () => {
//   try {
//     const rpc = "https://rpc.sandbox-01.aksh.pw/";
//     const { privateKey, wallet } = await getPrivateKeyAndWallet();
//     const fromAddress = (await wallet.getAccounts())[0].address;
//     const destination = "akash1pa0ckdmr35ck2eem7a8ejrc36dllka3h9a46hp";
//     const signer = await DirectSecp256k1Wallet.fromKey(privateKey, "akash");
//     const signingClient = await SigningStargateClient.connectWithSigner(rpc, signer);
//     const result = await signingClient.sendTokens(fromAddress, destination, [{ denom: "uakt", amount: "250" }], {
//       amount: [{ denom: "uakt", amount: "250000" }],
//       gas: "1000000",
//     });
//     const transactionHash = result.transactionHash;
//     const height = result.height;
//     return { transactionHash, height };
//   } catch (error) {
//     throw new Error(error.message || error);
//   }
// };


// import { useEffect } from "react";
// import { Web3Auth } from "@web3auth/modal";
// import { WEB3AUTH_NETWORK } from "@web3auth/base";
// import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
// import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
// import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
// import "./App.css";


// const clientId = "BN-K3fMMEi3w-Iull0MvE-oz7PLPruAEhWEycwxy2sobF4tPQv3DbPKVOxP066wupxVeXYcD80o2DFbtiyZhr5w"
// const secretId = "b930b649d6bba5991f75635a92ef4bb0d15a0047dd7e93bf9bf472144f009fd8"


// const chainConfig = {
//   chainNamespace: "other",
//   chainId: "sandbox-01",
//   rpcTarget: "https://rpc.sandbox-01.aksh.pw/",
//   displayName: "Akash Testnet",
//   ticker: "akash",
//   tickerName: "cosmos",
// };

// const privateKeyProvider = new CommonPrivateKeyProvider({
//   config: { chainConfig: chainConfig }
// });

// const web3auth = new Web3Auth({
//   clientId,
//   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
//   privateKeyProvider: privateKeyProvider,
// });

// const connectStargateClient = async () => {
//   const rpc = "https://rpc.sandbox-01.aksh.pw/";
//   return await StargateClient.connect(rpc);
// };

// const getPrivateKeyAndWallet = async () => {
//   try {
//     const privateKey = Buffer.from(await privateKeyProvider.request({ method: "private_key" }), "hex");
//     const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, "akash");
//     return { privateKey, wallet };
//   } catch (error) {
//     throw new Error(error.message || error);
//   }
// };

// const getBalance = async () => {
//   try {
//     const { privateKey, wallet } = await getPrivateKeyAndWallet();
//     const accounts = await wallet.getAccounts({ network: "akash" }, { prefix: "akash" });
//     const address = accounts.length > 0 ? accounts[0].address : null;

//     if (!address) {
//       throw new Error("Failed to generate Akash address.");
//     }

//     const client = await connectStargateClient();
//     const balance = await client.getAllBalances(address);
//     return balance;
//   } catch (error) {
//     throw new Error(error.message || error);
//   }
// };

// const sendTransaction = async () => {
//   try {
//     const rpc = "https://rpc.sandbox-01.aksh.pw/";
//     const { privateKey, wallet } = await getPrivateKeyAndWallet();
//     const fromAddress = (await wallet.getAccounts())[0].address;
//     const destination = "akash1pa0ckdmr35ck2eem7a8ejrc36dllka3h9a46hp";
//     const signer = await DirectSecp256k1Wallet.fromKey(privateKey, "akash");
//     const signingClient = await SigningStargateClient.connectWithSigner(rpc, signer);
//     const result = await signingClient.sendTokens(fromAddress, destination, [{ denom: "uakt", amount: "250" }], {
//       amount: [{ denom: "uakt", amount: "250000" }],
//       gas: "1000000",
//     });
//     const transactionHash = result.transactionHash;
//     const height = result.height;
//     return { transactionHash, height };
//   } catch (error) {
//     throw new Error(error.message || error);
//   }
// };

// const App = () => {
//   useEffect(() => {
//     const init = async () => {
//       try {
//         await web3auth.initModal();
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     init();
//   }, []);

//   return (
//     <div className="container">
//       <h1 className="title">
//         <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
//           Web3Auth{" "}
//         </a>
//         & ReactJS (Webpack) Quick Start
//       </h1>
//       <div className="flex-container">
//         <div>
//           <button onClick={async () => { console.log(await web3auth.getUserInfo()) }} className="card">
//             Log account cosmos
//           </button>
//         </div>
//         <div>
//           <button onClick={async () => { console.log(await getBalance()) }} className="card">
//             get balance cosmos
//           </button>
//         </div>
//         <div>
//           <button onClick={async () => { console.log(await sendTransaction()) }} className="card">
//             send token
//           </button>
//         </div>
//       </div>
//       <div id="console" style={{ whiteSpace: "pre-line" }}>
//         <p style={{ whiteSpace: "pre-line" }}></p>
//       </div>
//       <footer className="footer">
//         <a
//           href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/react-modal-quick-start"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Source code
//         </a>
//       </footer>
//     </div>
//   );
// };

// export default App;
