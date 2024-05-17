import { getAllUsers, getOrderByOrderId, getOrdersByOwner } from "./db";
import { checkForBids, createLease, createLeaseTX, sendManifest } from "./deploy";
import cron from 'node-cron';


interface leaseDeployment {
    id: {
        owner: string;
        dseq: number;
    };
}

export async function startCheckingForBids(  cronExpression: string) {
    console.log('Starting cron job with expression:', cronExpression);


    const owners = await getAllUsers();

    const check = async(owner: string) => {
        console.log('Running checkForBids')
        const data = await getOrdersByOwner(owner, false).then((orders) => {
            return orders.map((order) => {
                return order.dseq
            })
        })
        if(data.length === 0){
            throw new Error(`no orders found for ${owner} `)
        }
    
        for (const dseq of data) {
            console.log("checking for ",dseq, owner)
            const status = await checkForBids(dseq, owner);
            // if( status.length > 0){
            //     console.log(`bids found for ${dseq} `)

            //     const tx = await createLease({id: {owner, dseq}});

            //     if( tx) {
            //         //send manifest
            //         // await sendManifest();
            //     }

                
            // }
            // else{
            //     console.log(`no bids found for ${dseq} `)
            // }
        }
    };
       cron.schedule(cronExpression, () => {
        owners.forEach(owner => {
            check(owner);
        });
    });
  }


