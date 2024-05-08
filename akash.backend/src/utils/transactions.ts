import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { coin, SigningStargateClient, assertIsDeliverTxSuccess, DeliverTxResponse } from "@cosmjs/stargate";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";

// Akash network details
const rpcUrl = "https://rpc.sandbox-01.aksh.pw:443";
const chainId = "sandbox-01";

// Your private key in base64 encoding
const privateKey = "c3d4c00caea2bf3842e6b5638425c1f177c1b22407b0e7e0a1783666cca7fa60";

// Function to send AKT tokens
async function sendAKT( recipientAddress, amount) {
  // Create a wallet with the private key
  // const privateKeyBytes = new Uint8Array(Buffer.from(privateKey, 'base64')); // Convert from base64 to Uint8Array

  const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, 'hex'), "akash");

  // Connect to the Akash network
  const client = await SigningStargateClient.connectWithSigner(rpcUrl, wallet);

  

  // get first account
  const [account] = await wallet.getAccounts();

  console.log(account.address)

  // Create the message for sending AKT tokens
  const msgSend = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: MsgSend.fromPartial({
      fromAddress: account.address,
      toAddress: recipientAddress,
      amount: [coin(amount, "uakt")], // uakt is the smallest unit of AKT
    }),
  };

  // Define fee and gas limits
    const fee = {
      amount: [
          {
              denom: "uakt",
              amount: "200000",
          },
      ],
      gas: "800000",
  };
  // Broadcast the transaction
  let result: DeliverTxResponse;
  try {
    result = await client.signAndBroadcast(account.address, [msgSend], fee, "Send AKT via CosmJS");
  } catch (error) {
    throw new Error(`Failed to send AKT: ${error}`);
  }


  return result;
}


// Example usage
const recipientAddress = "akash1pa0ckdmr35ck2eem7a8ejrc36dllka3h9a46hp"; // Recipient's address
const amount = "1000000"; // Amount of AKT in the smallest unit (uakt)

sendAKT( recipientAddress, amount)
  .then((result) => console.log("Transaction successful:", result))
  .catch((error) => console.error("Error sending AKT:", error));
