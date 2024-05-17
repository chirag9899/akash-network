import { ChainNamespaceType } from "@web3auth/base";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID

export interface ChainConfig {
    chainNamespace: ChainNamespaceType;
    chainId: string;
    rpcTarget: string;
    displayName: string;
    ticker: string;
    tickerName: string;
    clientId: string;
  }
export const chainConfig:ChainConfig = {
    chainNamespace: "other",
    chainId: "sandbox-01",
    rpcTarget: "https://rpc.sandbox-01.aksh.pw/",
    displayName: "Akash Testnet",
    ticker: "akash",
    tickerName: "cosmos",
    clientId: clientId
};

