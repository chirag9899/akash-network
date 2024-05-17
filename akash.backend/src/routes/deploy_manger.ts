import express from 'express';
import { broadcast, createCertificateTx, createDeploymentTx, createLeaseTX, saveCertificate, sendManifest } from '../utils/deploy';
import { DeliverTxResponse, StargateClient } from '@cosmjs/stargate';
import { saveDeployment, updateOrder } from '../utils/db';
import { MsgCreateDeployment } from "@akashnetwork/akash-api/v1beta3";
import { MsgCreateLease } from "@akashnetwork/akash-api/v1beta4";
// import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { BidID } from '@akashnetwork/akashjs/build/protobuf/akash/market/v1beta4/bid';
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

// import { TxRaw } from "@akashnetwork/akashjs/build/wallet/";



const deployManager = express.Router();

deployManager.post('/createCertificateTx', async (req, res) => {
    try {
        const { address } = req.body;
        const data = await createCertificateTx(address) ; // Update the type of the data variable
        console.log('data:', data);

        res.send({ certificate: data }); 
    } catch (error) {
        console.log(error)
        throw new Error("create-certificate Error")
    }
});


deployManager.post('/broadcastCertificateTx', async (req, res) => {
    try {
        const { certificate, address, signedTx } = req.body;

        const result: DeliverTxResponse = await broadcast(signedTx);

        if (result.code !== undefined && result.code === 0) {
            // save the certificate to the fixtures folder
            saveCertificate(certificate);
            return certificate;
        }

        res.send({ result: result });

    } catch (error) {
        console.log(error)
        throw new Error("broadcast cert Error")
    }
})


deployManager.post('/createDeployTX', async (req, res) => {
    console.log("enter")
    try {
        const { address, blockHeight } = req.body;

        const txData = await createDeploymentTx(address, blockHeight);

        res.send({ tx: txData });

    } catch (error) {
        console.log(error)
        throw new Error("createDeployTX  Error")
    }
})


deployManager.post('/broadcastDeploymentTx', async (req, res) => {
    try {
        const { signedTX, deployment } = req.body;
        // console.log("recieve signed", signedTX)
        // const tx = Uint8Array.from(TxRaw.encode(signed).finish())
        // const rawtx = Uint8Array.from(TxRaw.encode(signedTX).finish())
        const rawtx = TxRaw.encode(signedTX).finish();
        const tx: DeliverTxResponse = await broadcast(rawtx);


        if (tx.code !== undefined && tx.code === 0) {
            await saveDeployment(
                {
                    owner: deployment.id.owner,
                    txhash: tx.transactionHash,
                    bids: [],
                    lease: null,
                    dseq: deployment.id.dseq,
                    provider: null,
                    oseq: 0,
                    leaseStatus: null
                }
            )
            res.send({ result: tx });
        }

    } catch (error) {
        console.log(error)
        throw new Error("broadcastTx Error")
    }
})

deployManager.post('/createLeaseTX', async (req, res) => {
    try {
        const { deployment } = req.body;

        const tx = createLeaseTX(deployment);

        res.send({ tx: tx });

    } catch (error) {
        console.log(error)
        throw new Error("createDeployTX  Error")
    }
})

deployManager.post('/broadcastLeaseTX', async (req, res) => {
    try {
        const { signedTX, deployment, lease } = req.body;

        const tx: DeliverTxResponse = await broadcast(signedTX);


        if (tx.code !== undefined && tx.code === 0) {

            await updateOrder(deployment.owner, deployment.dseq.toString(), {
                lease: {
                    id: BidID.toJSON(lease.bidId) as {
                        owner: string;
                        dseq: number;
                        provider: string;
                        gseq: number;
                        oseq: number;
                    }
                }
            });

            res.send({ result: tx });
        }

    } catch (error) {
        console.log(error)
        throw new Error("broadcastTx Error")
    }
})


deployManager.post('/sendManifest', async (req, res) => {
    try {
        const { lease, certificate } = req.body;

        const result = sendManifest(lease, certificate);

        res.send({ result: result });

    } catch (error) {
        throw new Error(`Failed to manifest: ${error}`)
    }
})
export default deployManager;