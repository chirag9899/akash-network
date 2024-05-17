import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { WEB3AUTH_NETWORK, IProvider, ADAPTER_STATUS_TYPE, OPENLOGIN_NETWORK_TYPE } from "@web3auth/base";
import { DirectSecp256k1Wallet, Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { ChainConfig } from "../helper/chainConfig";
import { toast } from "react-toastify";
import axios from "axios";
import { MsgCreateDeployment } from "@akashnetwork/akash-api/v1beta3";
import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";
import { SDL } from "@akashnetwork/akashjs/build/sdl";


const Web3AuthContext = createContext({});
// const sdlPath = path.resolve(__dirname, '../../src/fixtures/fixture.sdl.yaml');
// const rawSDL = fs.readFileSync(sdlPath, 'utf8');

const rawSDL = `
version: '2.0'
services:
  tetris:
    image: bsord/tetris
    expose:
      - port: 80
        as: 80
        to:
          - global: true
profiles:
  compute:
    tetris:
      resources:
        cpu:
          units: 1
        memory:
          size: 512Mi
        storage:
          - size: 512Mi
        gpu:
            units: 0
  placement:
    akash:
      attributes:
        host: akash
      signedBy:
        anyOf:
          - akash1pa0ckdmr35ck2eem7a8ejrc36dllka3h9a46hp
          - akash1z47haahlta2d0xlh6402ukyuf43m7fnlfc8hax
          - akash19hwd9h8a4nuejtrjaedj200skxkm5xmps87knf
      pricing:
        tetris:
          denom: uakt
          amount: 10000
deployment:
  tetris:
    akash:
      profile: tetris
      count: 1
`
const sdl = SDL.fromString(rawSDL, "beta3");



const Web3AuthProvider = ({ children, chainConfig }: { children: React.ReactNode, chainConfig: ChainConfig }) => {

    const [web3Auth, setWeb3AuthInstance] = useState<Web3Auth>();
    const [privateKeyProvider, setPrivateKeyProvider] = useState<IProvider>();
    const [loggedIn, setLoggedIn] = useState(false);
    const [provider, setProvider] = useState<IProvider>();
    const [status, setStatus] = useState<ADAPTER_STATUS_TYPE | null>(null);

    // const [walletServicePlugin, setWalletServicePlugin] = useState<WalletServicesPlugin | null>();

    const isInitializedRef = useRef(false);



    const [conversionUsd, _] = useState(localStorage.getItem('conversion'));

    console.log(conversionUsd)
  

    useEffect(() => {
        const initWeb3Auth = async () => {
            try {
                if (isInitializedRef.current) return; // Already initialized, skip.

                const provider = new CommonPrivateKeyProvider({
                    config: { chainConfig }
                });
                setPrivateKeyProvider(provider);

                let web3AuthNetwork: OPENLOGIN_NETWORK_TYPE | undefined;
                if (import.meta.env.VITE_APP_PRODUCTION === "false") {
                    web3AuthNetwork = WEB3AUTH_NETWORK.SAPPHIRE_DEVNET;
                } else {
                    web3AuthNetwork = WEB3AUTH_NETWORK.SAPPHIRE_MAINNET;
                }
                const web3authInstance = new Web3Auth({
                    clientId: chainConfig.clientId,
                    web3AuthNetwork: web3AuthNetwork,
                    privateKeyProvider: provider,
                });


                await web3authInstance.initModal();

                console.log("Wallet initialized successfully");
                if (web3authInstance.connected) {
                    setLoggedIn(true);
                }
                setWeb3AuthInstance(web3authInstance);

                if (!localStorage.getItem('conversion-timestamp') || parseInt(localStorage.getItem('conversion-timestamp')!) < Date.now() / 1000) {
                    console.log(parseInt(localStorage.getItem('conversion-timestamp')!) , Date.now() / 1000)
                     await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api//conversionAkt_Usd`)
                        .then(response => {
                            console.log(response)
                            const conversion = response.data.price;
                            localStorage.setItem('conversion', JSON.stringify(conversion));
                            localStorage.setItem('conversion-timestamp', (Date.now() / 1000 + 18000).toString());
                        })
                        .catch(error => {
                            console.error('Error fetching conversion:', error);
                        });
                }

                
                isInitializedRef.current = true; // Mark as initialized
            } catch (error: any) {
                console.error("Error initializing wallet:", error);
                throw new Error(error.message || error as string);
            }
        };

        initWeb3Auth();
    }, [chainConfig]);


    useEffect(() => {

        if (web3Auth) {
            setStatus(web3Auth.status)
        }
    }, [web3Auth, web3Auth?.status]);

    const login = async () => {
        const web3authProvider = web3Auth && await web3Auth.connect();
        web3authProvider && setProvider(web3authProvider);
        if (web3Auth && web3Auth.connected) {
            setLoggedIn(true);
        }
    };


    // const status = () => {
    //     return web3Auth && web3Auth.status;
    // }

    const logout = async () => {
        if (web3Auth) {
            await web3Auth.logout();
        }
        setProvider(undefined);
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

            const pvtKey: string = await privateKeyProvider.request({ method: "private_key" }) || "";
            const privateKey = Buffer.from(pvtKey, "hex");
            const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, chainConfig.ticker);
            return { privateKey, wallet };
        } catch (error: any) {
            toast.error(error.message || error as string);
            throw new Error(error.message || error as string);
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

            const {  wallet } = await getPrivateKeyAndWallet();
            // const accounts = await wallet.getAccounts({ network: chainConfig.ticker }, { prefix: chainConfig.ticker });
            const accounts = await wallet.getAccounts();
            const address = accounts.length > 0 ? accounts[0].address : null;

            if (!address) {
                throw new Error(`Failed to generate ${chainConfig.displayName} address.`);
            }

            const client = await connectStargateClient();
            const balance = await client.getAllBalances(address);
            return { address, balance };
        } catch (error: any) {
            toast.error(error.message || error as string);
            throw new Error(error.message || error);
        }
    };

    const sendTransaction = async (destination: string, denom: string, amount: string, gas: number): Promise<{ transactionHash: string, height: number }> => {
        if (!web3Auth || !privateKeyProvider) {
            throw new Error("Web3Auth or private key provider not initialized");
        }

        try {
            const rpc = chainConfig.rpcTarget;
            const { privateKey, wallet } = await getPrivateKeyAndWallet();
            
            const fromAddress = (await wallet.getAccounts())[0].address;
            const signer = await DirectSecp256k1Wallet.fromKey(privateKey, chainConfig.ticker);
            // const signingClient = await SigningStargateClient.connectWithSigner(rpc, signer);
            const registry = getAkashTypeRegistry();

            const signingClient: SigningStargateClient = await SigningStargateClient.connectWithSigner(rpc, signer, {
                registry: new Registry(registry)
            });
            const result = await signingClient.sendTokens(fromAddress, destination, [{ denom, amount }], { amount: [{ denom, amount }], gas: gas.toString() });
            const transactionHash = result.transactionHash;
            const height = result.height;
            return { transactionHash, height };
        } catch (error: any) {
            toast.error(error.message || error as string);
            throw new Error(error.message || error);
        }
    };

    async function createDeploymentTx(userAddress: string, blockHeight: number,) {
        // const accounts = await wallet.getAccounts();
        const blockheight = blockHeight
        const groups = sdl.groups();


        // if (dseq != 0) {
        //   console.log("Skipping deployment creation...");
        //   return {
        //     id: {
        //       owner: accounts[0].address,
        //       dseq: dseq
        //     },
        //     groups: groups,
        //     deposit: {
        //       denom: "uakt",
        //       amount: "5000000"
        //     },
        //     version: await sdl.manifestVersion(),
        //     depositor: accounts[0].address
        //   };
        // }

        const deployment = {
            id: {
                owner: userAddress,
                dseq: blockheight
            },
            groups: groups,
            deposit: {
                denom: "uakt",
                amount: "5000000"
            },
            version: new Uint8Array( [
                255, 248, 161,  63,  54, 116,  62,  78,
                181, 117, 216,  18,   9, 147, 142,  20,
                 68,  54,  17, 246,  30, 232, 238,   8,
                170, 175,  53,  52, 126, 243, 130, 232
              ]),
            depositor: userAddress
        };

        const fee = {
            amount: [
                {
                    denom: "uakt",
                    amount: "20000"
                }
            ],
            gas: "800000"
        };

        const msg = {
            typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
            value: MsgCreateDeployment.fromPartial(deployment)
        };

        console.log(msg)

        const memo = "create deployment"

        console.log(msg, fee, memo)
        return { msg, fee, memo, deployment }
    }

    const getUserInfo = async () => {

        try {
            if (!web3Auth || !privateKeyProvider || !web3Auth.connected) {
                console.log("Web3Auth or private key provider not initialized")
                return
                // throw new Error("Web3Auth or private key provider not initialized");
            }
            const data = await web3Auth.getUserInfo();
            const {  wallet } = await getPrivateKeyAndWallet();
            // const accounts = await wallet.getAccounts({ network: chainConfig.ticker }, { prefix: chainConfig.ticker });
            const accounts = await wallet.getAccounts();
            const address = accounts.length > 0 ? accounts[0].address : null;

            if (!address) {
                throw new Error(`Failed to generate ${chainConfig.displayName} address.`);
            }

            const client = await connectStargateClient();
            const balance = await client.getAllBalances(address);
            return { data, address, balance };
            return
        } catch (error: any) {
            toast.error(error.message || error as string);
            console.error("here", error);
            throw new Error(error.message || error);
        }
    };

    const getOrdersByOwner = async () => {
        try {
            const userInfo = await getUserInfo();

            console.log(`${import.meta.env.VITE_APP_BACKEND_URL}/api/getOrdersByOwner`, userInfo?.address)
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/getOrdersByOwner`, { owner: userInfo && userInfo.address, onlyID: false });
            return response.data.orders;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // function base64ToUInt(base64: string) {
    //     if (typeof window !== "undefined") {
    //       const binary_string = window.atob(base64);
    //       const len = binary_string.length;
    //       const bytes = new Uint8Array(len);
    //       for (let i = 0; i < len; i++) {
    //         bytes[i] = binary_string.charCodeAt(i);
    //       }
    //       return bytes;
    //     }
      
    //     return Buffer.from(base64, "base64");
    //   }


    const deploy = async () => {
        const rpc = chainConfig.rpcTarget;
        const { privateKey, wallet } = await getPrivateKeyAndWallet();
        const acountAddress = (await wallet.getAccounts())[0].address;
        const signer = await DirectSecp256k1Wallet.fromKey(privateKey, chainConfig.ticker);
        const registry = new Registry();
        registry.register("/akash.deployment.v1beta3.MsgCreateDeployment", MsgCreateDeployment);
        registry.register("/akash.cert.v1beta3.MsgCreateCertificate", MsgCreateDeployment);

        const signingClient: SigningStargateClient = await SigningStargateClient.connectWithSigner(rpc, signer, {
            registry
        });

        console.log(signingClient.getAccount(acountAddress).then((res) => console.log(res)))

        const height = await signingClient.getHeight()
        try {

            // const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/createCertificateTx`, { address: acountAddress });
            // const pem = response.data.certificate.pem
            // const executeData = await cert.broadcastCertificate(pem, acountAddress, signingClient as any );

            const txData = await createDeploymentTx(acountAddress, height);

            const executedTX = await signingClient.signAndBroadcast(acountAddress, [txData.msg], txData.fee, txData.memo);

            if(executedTX) {
               try {
                 await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/saveDeployment`, { 
                  data : {
                    owner: acountAddress,
                    txhash: executedTX.transactionHash,
                    bids: [],
                    lease:  null,
                    dseq: txData.deployment.id.dseq, 
                    provider: null,
                    oseq: 0,
                    leaseStatus: null
                  }
                 });
               } catch (error) {
                    throw new Error(`Error saving deployment: ${error}`);
               }

            }
        } catch (error) {
            console.log(error)
            throw new Error(`Error deploying: ${error}`)
        }


    }

    return (
        <Web3AuthContext.Provider value={{ getBalance, sendTransaction, getUserInfo, getPrivateKeyAndWallet, loggedIn, setLoggedIn, login, logout, status, web3Auth, provider, deploy, getOrdersByOwner , conversionUsd}}>
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
