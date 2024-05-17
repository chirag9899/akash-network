import { ChainNamespaceType } from "@web3auth/base";

const clientId = "BN-K3fMMEi3w-Iull0MvE-oz7PLPruAEhWEycwxy2sobF4tPQv3DbPKVOxP066wupxVeXYcD80o2DFbtiyZhr5w"
const secretId = "b930b649d6bba5991f75635a92ef4bb0d15a0047dd7e93bf9bf472144f009fd8"

export interface ChainConfig {
    chainNamespace: ChainNamespaceType;
    chainId: string;
    rpcTarget: string;
    displayName: string;
    ticker: string;
    tickerName: string;
  }
export const chainConfig:ChainConfig = {
    chainNamespace: "other",
    chainId: "sandbox-01",
    rpcTarget: "https://rpc.sandbox-01.aksh.pw/",
    displayName: "Akash Testnet",
    ticker: "akash",
    tickerName: "cosmos",

};

