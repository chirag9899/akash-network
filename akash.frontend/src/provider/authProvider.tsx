import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { WEB3AUTH_NETWORK, IProvider, WALLET_ADAPTERS, ADAPTER_EVENTS, CONNECTED_EVENT_DATA, ADAPTER_STATUS_TYPE } from "@web3auth/base";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { ChainConfig } from "../helper/chainConfig";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";


const Web3AuthContext = createContext({});


const Web3AuthProvider = ({ children, chainConfig }: { children: React.ReactNode, chainConfig: ChainConfig }) => {

    const [web3Auth, setWeb3AuthInstance] = useState<Web3Auth>();
    const [privateKeyProvider, setPrivateKeyProvider] = useState<IProvider>();
    const [loggedIn, setLoggedIn] = useState(false);
    const [provider, setProvider] = useState<IProvider>();
    const [ status ,setStatus] = useState<boolean>(false);
    // const [walletServicePlugin, setWalletServicePlugin] = useState<WalletServicesPlugin | null>();

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
                // const walletServicesPlugin = new WalletServicesPlugin({
                //     wsEmbedOpts: {},
                //     walletInitOptions: { whiteLabel: { showWidgetButton: true } },
                //   });
                // web3authInstance.addPlugin(walletServicesPlugin);
                
                // await web3authInstance.initModal({
                //     modalConfig: {
                //       [WALLET_ADAPTERS.OPENLOGIN]: {
                //         label: "openlogin",
                //         loginMethods: {
                //           // Disable facebook and reddit
                //           apple: {
                //             name: "facebook",
                //             showOnModal: false,
                //           },
                //           reddit: {
                //             name: "reddit",
                //             showOnModal: false,
                //           },
                //           line: {
                //             name: "line",
                //             showOnModal: false,
                //           },
                //           github: {
                //             name: "github",
                //             showOnModal: false,
                //           },
                //           wechat: {
                //             name: "wechat",
                //             showOnModal: false,
                //           },
                //           twitter: {
                //             name: "twitter",
                //             showOnModal: false,
                //           },
                //           kakao: {
                //             name: "kakao",
                //             showOnModal: false,
                //           },
                //           linkedin: {
                //             name: "linkedin",
                //             showOnModal: false,
                //           },
                //           weibo: {
                //             name: "weibo",
                //             showOnModal: false,
                //           },
                //           // Disable email_passwordless and sms_passwordless
                //           email_passwordless: {
                //             name: "email_passwordless",
                //             showOnModal: false,
                //           },
                //           sms_passwordless: {
                //             name: "sms_passwordless",
                //             showOnModal: false,
                //           },
                //         },
                //       },
                //     },
                //   });
           

                // setWalletServicePlugin(walletServicesPlugin);
                
                console.log("Wallet initialized successfully");
                if (web3authInstance.connected) {
                    setLoggedIn(true);
                }
                setWeb3AuthInstance(web3authInstance);
                isInitializedRef.current = true; // Mark as initialized
            } catch (error: any) {
                console.error("Error initializing wallet:", error);
                throw new Error(error.message || error as string);
            }
        };

        initWeb3Auth();
    }, [chainConfig]);


    useEffect(() => {

        if (web3Auth){
            console.log(web3Auth)
            setStatus(web3Auth.connected)
        }

        const subscribeAuthEvents = () => {
            if (!web3Auth) return;

            web3Auth.on(ADAPTER_EVENTS.CONNECTED, (data: CONNECTED_EVENT_DATA) => {
                console.log("connected to wallet", data);
            });

            web3Auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                console.log("connecting");
            });

            web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
                console.log("disconnected");
            });

            web3Auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                console.log("error", error);
            });
        };

        subscribeAuthEvents();

        return () => {
            if (web3Auth) {
                // Unsubscribe event listeners
                web3Auth.removeAllListeners();
            }
        };
    }, [web3Auth, web3Auth?.connected]);

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

            const { privateKey, wallet } = await getPrivateKeyAndWallet();
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
            const signingClient = await SigningStargateClient.connectWithSigner(rpc, signer);
            const result = await signingClient.sendTokens(fromAddress, destination, [{ denom, amount }], { amount: [{ denom, amount }], gas: gas.toString() });
            const transactionHash = result.transactionHash;
            const height = result.height;
            return { transactionHash, height };
        } catch (error: any) {
            throw new Error(error.message || error);
        }
    };


    const getUserInfo = async () => {
        if (!web3Auth || !privateKeyProvider) {
            throw new Error("Web3Auth or private key provider not initialized");
        }

        try {
            const data = await web3Auth.getUserInfo();
            const { privateKey, wallet } = await getPrivateKeyAndWallet();
            // const accounts = await wallet.getAccounts({ network: chainConfig.ticker }, { prefix: chainConfig.ticker });
            const accounts = await wallet.getAccounts();
            const address = accounts.length > 0 ? accounts[0].address : null;

            if (!address) {
                throw new Error(`Failed to generate ${chainConfig.displayName} address.`);
            }

            const client = await connectStargateClient();
            const balance = await client.getAllBalances(address);
            return { data , address, balance };
            return 
        } catch (error: any) {
            console.error("here", error);
            throw new Error(error.message || error);
        }
    };

    return (
        <Web3AuthContext.Provider value={{ getBalance, sendTransaction, getUserInfo, getPrivateKeyAndWallet, loggedIn, setLoggedIn, login, logout, status, web3Auth }}>
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
