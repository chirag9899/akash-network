import { DirectSecp256k1HdWallet, DirectSecp256k1Wallet, Registry } from "@cosmjs/proto-signing";
import { coin, SigningStargateClient, assertIsDeliverTxSuccess, DeliverTxResponse } from "@cosmjs/stargate";
import { MsgSend , Msg } from "cosmjs-types/cosmos/bank/v1beta1/tx";
// import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";
// import { SDL } from "@akashnetwork/akashjs/build/sdl";
// import Msgcreatede

const rpcUrl = "https://rpc.sandbox-01.aksh.pw:443";
const chainId = "sandbox-01";


const privateKey = "c3d4c00caea2bf3842e6b5638425c1f177c1b22407b0e7e0a1783666cca7fa60";

export async function sendAKT( recipientAddress: string, amount: string) {

  const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, 'hex'), "akash");

  const client = await SigningStargateClient.connectWithSigner(rpcUrl, wallet);

  const [account] = await wallet.getAccounts();

  console.log(account.address)

  const msgSend = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: MsgSend.fromPartial({
      fromAddress: account.address,
      toAddress: recipientAddress,
      amount: [coin(amount, "uakt")], 
    }),
  };

    const fee = {
      amount: [
          {
              denom: "uakt",
              amount: "200000",
          },
      ],
      gas: "800000",
  };

  let result: DeliverTxResponse;
  try {
    result = await client.signAndBroadcast(account.address, [msgSend], fee, "Send AKT via CosmJS");
  } catch (error) {
    throw new Error(`Failed to send AKT: ${error}`);
  }

  return result;
}


// async function createDeployment(sdl: SDL, wallet: DirectSecp256k1HdWallet, client: SigningStargateClient) {
//     const dseq = 0;
//     const blockheight = await client.getHeight();
//     const groups = sdl.groups();
//     const accounts = await wallet.getAccounts();
  
//     if (dseq != 0) {
//       console.log("Skipping deployment creation...");
//       return {
//         id: {
//           owner: accounts[0].address,
//           dseq: dseq
//         },
//         groups: groups,
//         deposit: {
//           denom: "uakt",
//           amount: "5000000"
//         },
//         version: await sdl.manifestVersion(),
//         depositor: accounts[0].address
//       };
//     }
  
//     const deployment = {
//       id: {
//         owner: accounts[0].address,
//         dseq: blockheight
//       },
//       groups: groups,
//       deposit: {
//         denom: "uakt",
//         amount: "5000000"
//       },
//       version: await sdl.manifestVersion(),
//       depositor: accounts[0].address
//     };
  
//     const fee = {
//       amount: [
//         {
//           denom: "uakt",
//           amount: "20000"
//         }
//       ],
//       gas: "800000"
//     };
  
//     const msg = {
//       typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
//       value: MsgCreateDeployment.fromPartial(deployment)
//     };
  
//     const tx = await client.signAndBroadcast(accounts[0].address, [msg], fee, "create deployment");
  
//     if (tx.code !== undefined && tx.code === 0) {
//       return deployment;
//     }
  
//     throw new Error(`Could not create deployment: ${tx.rawLog} `);
//   }

//   async function loadOrCreateCertificate(wallet: DirectSecp256k1HdWallet, client: SigningStargateClient) {
//     const accounts = await wallet.getAccounts();
//     // check to see if we can load the certificate from the fixtures folder
  
//     if (fs.existsSync(certificatePath)) {
//       return loadCertificate(certificatePath);
//     }
  
//     // if not, create a new one
//     const certificate = await cert.createCertificate(accounts[0].address);
//     const result = await cert.broadcastCertificate(certificate, accounts[0].address, client);
  
//     if (result.code !== undefined && result.code === 0) {
//       // save the certificate to the fixtures folder
//       saveCertificate(certificate);
//       return certificate;
//     }
  
//     throw new Error(`Could not create certificate: ${result.rawLog} `);
//   }  

  async function walletFromMnemonic(mnemonic: string) {
    return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "akash" });
  }