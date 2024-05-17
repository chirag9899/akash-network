import fs from "fs";
import https from "https";
import path from "path";
import { DirectSecp256k1HdWallet, DirectSecp256k1Wallet, Registry } from "@cosmjs/proto-signing";
import { coin, SigningStargateClient, assertIsDeliverTxSuccess, DeliverTxResponse, StargateClient } from "@cosmjs/stargate";
import { MsgSend, Msg } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { SDL } from "@akashnetwork/akashjs/build/sdl";
import { MsgCreateDeployment } from "@akashnetwork/akash-api/v1beta3";
import { MsgCreateLease } from "@akashnetwork/akash-api/v1beta4";
import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";
import * as cert from "@akashnetwork/akashjs/build/certificates";
import { getRpc } from "@akashnetwork/akashjs/build/rpc";

import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { QueryBidsRequest, QueryClientImpl as QueryMarketClient } from "@akashnetwork/akashjs/build/protobuf/akash/market/v1beta4/query";
import { QueryClientImpl as QueryProviderClient, QueryProviderRequest } from "@akashnetwork/akashjs/build/protobuf/akash/provider/v1beta3/query";
import { saveDeployment, updateOrder } from "./db";
import { chainConfig } from "./chainConfig";
import { CertificateManager, CertificatePem } from "@akashnetwork/akashjs/build/certificates/certificate-manager/CertificateManager";
import { toBase64 } from "pvutils";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { createStarGateMessage } from "@akashnetwork/akashjs/build/pbclient/pbclient";
import { config } from "dotenv";
import Web3 from "web3";



const rpcUrl = "https://rpc.sandbox-01.aksh.pw:443";
const chainId = "sandbox-01";
// const mnemonicPath = path.resolve(__dirname, '../../src/fixtures/mnemonic.txt');
// const mnemonic = fs.readFileSync(mnemonicPath, 'utf-8');

const sdlPath = path.resolve(__dirname, '../../src/fixtures/fixture.sdl.yaml');
const rawSDL = fs.readFileSync(sdlPath, 'utf8');
const sdl = SDL.fromString(rawSDL, "beta3");


// const rawSDL = fs.readFileSync("./fixtures/example.sdl.yaml", "utf8");

const certificatePath = path.resolve(__dirname, '../../src/fixtures/cert.json');


const privateKey = "bd8c33f3f9d3fc262d7a8b7e762297f021e5598eb3a55e6230cd9fc0ef04f6ce";




type Deployment = {
  id: {
    owner: string;
    dseq: number;
  };
};

type Lease = {
  id: {
    owner: string;
    dseq: number;
    provider: string;
    gseq: number;
    oseq: number;
  };
};

type Certificate = {
  csr: string;
  privateKey: string;
  publicKey: string;
};

// you can set this to a specific deployment sequence number to skip the deployment creation
const dseq = 0;

async function loadPrerequisites() {



  //   // const wallet = await walletFromMnemonic(mnemonic);
  //   const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, 'hex'), "akash");


  //   const registry = getAkashTypeRegistry();

  // const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, 'hex'), "akash");
  // const client: SigningStargateClient = await SigningStargateClient.connectWithSigner(rpcUrl, wallet, {
  //   registry: new Registry(registry)
  // });

  //   const client: StargateClient = await StargateClient.connect(
  //     rpcUrl,
  //   )

  //   const signedTX = "asdasd";

  //   const certificate = await loadOrCreateCertificate(accountAddr ,signedTX);
  //   const sdl = SDL.fromString(rawSDL, "beta3");

  //   return {
  //     wallet,
  //     client,
  //     certificate,
  //     sdl
  //   };
}


async function walletFromMnemonic(mnemonic: string) {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "akash" });
}

// saves the certificate into the fixtures folder
export function saveCertificate(certificate: { privateKey: string; publicKey: string; csr: string }) {
  const json = JSON.stringify(certificate);
  fs.writeFileSync(certificatePath, json);
}

function loadCertificate(path: string): { csr: string; privateKey: string; publicKey: string } {
  const json = fs.readFileSync(path, "utf8");

  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error(`Could not parse certificate: ${e} `);
  }
}

export async function createCertificateTx(accountAddress: string) {
  console.log('accountAddress:', accountAddress);

  // if (fs.existsSync(certificatePath)) {
  //   return loadCertificate(certificatePath);
  // }

  const pem: Pick<CertificatePem, "cert" | "publicKey"> | cert.pems = await cert.createCertificate(accountAddress); //certificate


  if ("csr" in pem) {
    console.warn("The `csr` field is deprecated. Use `cert` instead.");
  }
  const certKey = "cert" in pem ? pem.cert : pem.csr;
  const encodedCsr = base64ToUInt(toBase64(certKey));
  const encdodedPublicKey = base64ToUInt(toBase64(pem.publicKey));
  const message = createStarGateMessage(Message.MsgCreateCertificate, {
    owner: accountAddress,
    cert: encodedCsr,
    pubkey: encdodedPublicKey
  });

  const memo = "create certificate";


  const certManager = new CertificateManager();
  const certificate = certManager.generatePEM(accountAddress);

  return { pem }
}

// export async function broadcastCertificate(
//   pem: Pick<CertificatePem, "cert" | "publicKey"> | cert.pems,
//   owner: string,
//   signedTx: any
// ): Promise<DeliverTxResponse> {
//   if ("csr" in pem && !("cert" in pem)) {
//     console.trace("The `csr` field is deprecated. Use `cert` instead.");
//   }
//   const certKey = "cert" in pem ? pem.cert : pem.csr;
//   const encodedCsr = base64ToUInt(toBase64(certKey));
//   const encdodedPublicKey = base64ToUInt(toBase64(pem.publicKey));
//   const message = createStarGateMessage(Message.MsgCreateCertificate, {
//     owner: owner,
//     cert: encodedCsr,
//     pubkey: encdodedPublicKey
//   });

//   // return await client.signAndBroadcast(owner, [message.message], message.fee);
// }
async function loadOrCreateCertificate(accountAddress: string, signedTX: any) {
  // const accounts = await wallet.getAccounts();

  // check to see if we can load the certificate from the fixtures folder

  if (fs.existsSync(certificatePath)) {
    return loadCertificate(certificatePath);
  }

  // if not, create a new one
  // const certificate = await cert.createCertificate(accounts[0].address);
  // const result = await broadcastCertificate(certificate, accounts[0].address);
  const certificate = await cert.createCertificate(accountAddress);


  // frontend sign transaction here 

  // const result = await broadcastCertificate(certificate, accountAddress, signedTX);

  // if (result.code !== undefined && result.code === 0) {
  //   // save the certificate to the fixtures folder
  //   saveCertificate(certificate);
  //   return certificate;
  // }

  // throw new Error(`Could not create certificate: ${result.rawLog} `);
}

export async function createDeploymentTx(userAddress: string, blockHeight: number) {

  console.log(userAddress, blockHeight)
  // const blockheight = await client.getHeight();
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
    version: await sdl.manifestVersion(),
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

  return { msg, fee, memo, deployment }
}

async function createDeployment(userAddress: string, blockHeight: number, client: SigningStargateClient) {


  // const blockheight = await client.getHeight();
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


  return
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
    version: await sdl.manifestVersion(),
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

  const tx = await client.signAndBroadcast(userAddress, [msg], fee, "create deployment");

  // console.log(tx, deployment)
  // if (tx.code !== undefined && tx.code === 0) {
  //   await saveDeployment(
  //     {
  //       owner: deployment.id.owner,
  //       txhash: tx.transactionHash,
  //       bids: [],
  //       lease: null,
  //       dseq: deployment.id.dseq,
  //       provider: null,
  //       oseq: 0,
  //       leaseStatus: null
  //     }
  //   )
  //   return deployment;
  // }

  // throw new Error(`Could not create deployment: ${tx.rawLog} `);
}

async function fetchBid(dseq: number, owner: string) {
  const rpc = await getRpc(rpcUrl);
  const client = new QueryMarketClient(rpc);
  const request = QueryBidsRequest.fromPartial({
    filters: {
      owner: owner,
      dseq: dseq
    }
  });

  const startTime = Date.now();
  const timeout = 1000 * 60 * 5;

  while (Date.now() - startTime < timeout) {
    console.log("Fetching bids...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    // error here
    const bids = await client.Bids(request);
    console.log(bids)

    if (bids.bids.length > 0 && bids.bids[0].bid !== undefined) {
      console.log("Bid fetched!");
      await updateOrder(owner, dseq.toString(), { bids: bids.bids });
      return bids.bids[0].bid;
    }

    // wait 1 second before trying again
  }

  throw new Error(`Could not fetch bid for deployment ${dseq}.Timeout reached.`);
}

export async function createLeaseTX(deployment: Deployment) {


  const {
    id: { dseq, owner }
  } = deployment;
  const bid = await fetchBid(dseq, owner);

  if (bid.bidId === undefined) {
    throw new Error("Bid ID is undefined");
  }


  const lease = {
    bidId: bid.bidId
  };

  const fee = {
    amount: [
      {
        denom: "uakt",
        amount: "50000"
      }
    ],
    gas: "2000000"
  };

  const msg = {
    typeUrl: `/${MsgCreateLease.$type}`,
    value: MsgCreateLease.fromPartial(lease)
  };

  return { msg, fee, lease, memo: "create lease" }
}

export async function createLease(deployment: Deployment ): Promise<Lease> {

  const registry = getAkashTypeRegistry();

  const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, 'hex'), "akash");
  const client: SigningStargateClient = await SigningStargateClient.connectWithSigner(rpcUrl, wallet, {
    registry: new Registry(registry)
  });


  const {
    id: { dseq, owner }
  } = deployment;
  const bid = await fetchBid(dseq, owner);
  const accounts = await wallet.getAccounts();

  if (bid.bidId === undefined) {
    throw new Error("Bid ID is undefined");
  }

  const lease = {
    bidId: bid.bidId
  };

  const fee = {
    amount: [
      {
        denom: "uakt",
        amount: "50000"
      }
    ],
    gas: "2000000"
  };

  const msg = {
    typeUrl: `/${MsgCreateLease.$type}`,
    value: MsgCreateLease.fromPartial(lease)
  };

  console.log(msg)
  const tx = await client.signAndBroadcast(accounts[0].address, [msg], fee, "create lease");
  // save lease status owner, dseq, provider, gseq, oseq
  console.log(tx)


  if (tx.code !== undefined && tx.code === 0) {

    await updateOrder(owner, dseq.toString(), {
      lease: {
        id: BidID.toJSON(bid.bidId) as {
          owner: string;
          dseq: number;
          provider: string;
          gseq: number;
          oseq: number;
        }
      }
    });

    return {
      id: BidID.toJSON(bid.bidId) as {
        owner: string;
        dseq: number;
        provider: string;
        gseq: number;
        oseq: number;
      }
    };
  }

  throw new Error(`Could not create lease: ${tx.rawLog} `);
}

async function queryLeaseStatus(lease: Lease, providerUri: string, certificate: Certificate) {
  const id = lease.id;

  if (id === undefined) {
    throw new Error("Lease ID is undefined");
  }

  const leasePath = `/lease/${id.dseq}/${id.gseq}/${id.oseq}/status`;

  const agent = new https.Agent({
    cert: certificate.csr,
    key: certificate.privateKey,
    rejectUnauthorized: false
  });

  const uri = new URL(providerUri);

  return new Promise<{ services: Record<string, { uris: string[] }> }>((resolve, reject) => {
    const req = https.request(
      {
        hostname: uri.hostname,
        port: uri.port,
        path: leasePath,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        agent: agent
      },
      res => {
        if (res.statusCode !== 200) {
          return reject(`Could not query lease status: ${res.statusCode}`);
        }

        let data = "";

        res.on("data", chunk => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      }
    );

    req.on("error", reject);
    req.end();
  });
}

export async function sendManifest(lease: Lease, certificate: { csr: string; privateKey: string; publicKey: string }) {
  if (lease.id === undefined) {
    throw new Error("Lease ID is undefined");
  }

  const { dseq, provider } = lease.id;
  const rpc = await getRpc(rpcUrl);
  const client = new QueryProviderClient(rpc);
  const request = QueryProviderRequest.fromPartial({
    owner: provider
  });

  const tx = await client.Provider(request);

  if (tx.provider === undefined) {
    throw new Error(`Could not find provider ${provider}`);
  }

  const providerInfo = tx.provider;
  const manifest = sdl.manifestSortedJSON();
  const path = `/deployment/${dseq}/manifest`;

  const uri = new URL(providerInfo.hostUri);
  const agent = new https.Agent({
    cert: certificate.csr,
    key: certificate.privateKey,
    rejectUnauthorized: false
  });

  await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: uri.hostname,
        port: uri.port,
        path: path,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Content-Length": manifest.length
        },
        agent: agent
      },
      res => {
        res.on("error", reject);

        res.on("data", chunk => {
          console.log("Response:", chunk.toString());
        });

        if (res.statusCode !== 200) {
          return reject(`Could not send manifest: ${res.statusCode}`);
        }

        resolve("ok");
      }
    );

    req.on("error", reject);
    req.write(manifest);
    req.end();
  });

  const startTime = Date.now();
  const timeout = 1000 * 60 * 10;

  while (Date.now() - startTime < timeout) {
    console.log("Waiting for deployment to start...");
    const status = await queryLeaseStatus(lease, providerInfo.hostUri, certificate).catch(err => {
      if (err.includes("Could not query lease status: 404")) {
        return undefined;
      }
      throw err;
    });


    if (status) {
      await updateOrder(lease.id.owner, dseq.toString(), { leaseStatus: status })


      for (const [name, service] of Object.entries(status.services)) {
        if ((service as { uris: string[] }).uris) {
          console.log(`Service ${name} is available at:`, (service as { uris: string[] }).uris[0]);
          return;
        }
      }
    }

    // wait 1 second before trying again
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  throw new Error(`Could not start deployment. Timeout reached.`);
}

export async function checkForBids(dseq: number, owner: string) {
  try {
    const rpc = await getRpc(rpcUrl);
    const client = new QueryMarketClient(rpc);
    const request = QueryBidsRequest.fromPartial({
      filters: {
        owner: owner,
        dseq: dseq
      }
    });

    const bids = await client.Bids(request);

    console.log(bids)
    if (bids.bids.length > 0 && bids.bids[0].bid !== undefined) {
      return bids.bids;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error)
  }
}

function base64ToUInt(base64: string) {
  if (typeof window !== "undefined") {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  return Buffer.from(base64, "base64");
}
export enum Message {
  MsgCreateCertificate = "/akash.cert.v1beta3.MsgCreateCertificate",
  MsgRevokeCertificate = "/akash.cert.v1beta3.MsgRevokeCertificate",
  MsgCreateDeployment = "/akash.deployment.v1beta3.MsgCreateDeployment",
  MsgCloseDeployment = "/akash.deployment.v1beta3.MsgCloseDeployment",
  MsgDepositDeployment = "/akash.deployment.v1beta3.MsgDepositDeployment",
  MsgUpdateDeployment = "/akash.deployment.v1beta3.MsgUpdateDeployment",
  MsgCloseGroup = "/akash.deployment.v1beta3.MsgCloseGroup",
  MsgPauseGroup = "/akash.deployment.v1beta3.MsgPauseGroup",
  MsgStartGroup = "/akash.deployment.v1beta3.MsgStartGroup",
  MsgCreateLease = "/akash.market.v1beta4.MsgCreateLease"
}

export async function broadcast(
  signedTX: any
): Promise<DeliverTxResponse> {

  const client: StargateClient = await StargateClient.connect(
    rpcUrl
  )

  console.log("signed tx 2", signedTX)
  const result: DeliverTxResponse = await client.broadcastTx(signedTX);

  return result;
}

// async function deploy() {


//   // const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, 'hex'), "akash");
//   // const registry = getAkashTypeRegistry();
//   // const client: SigningStargateClient = await SigningStargateClient.connectWithSigner(rpcUrl, wallet, {
//   //   registry: new Registry(registry)
//   // });


//   // const { wallet, client, certificate, sdl } = await loadPrerequisites();

//   // console.log("Creating deployment...");
//   // const deployment = await createDeployment(sdl, wallet, client);
//   // here we save the deployment id to the database in firebase

//   // console.log(owner -> deployment.id, txhash, bids : [] , lease , dseq, provider, orderId, oseq)

//   const deployment: Deployment = {
//     id: {
//       owner: 'akash1pa0ckdmr35ck2eem7a8ejrc36dllka3h9a46hp',
//       dseq: 4740952
//     },
//   }

//   // console.log("Creating lease...");
//   // const lease = await createLease(deployment, wallet, client);

//   // console.log("Sending manifest...");
//   // return await sendManifest(sdl, lease, wallet, certificate);

//   // await createDeployment("akash1pa0ckdmr35ck2eem7a8ejrc36dllka3h9a46hp", 1,client)
//   await checkForBids(4740952 ,"akash1z47haahlta2d0xlh6402ukyuf43m7fnlfc8hax")

//   // return await checkForBids(deployment.id.dseq, deployment.id.owner)

// }

// deploy().catch(console.error);