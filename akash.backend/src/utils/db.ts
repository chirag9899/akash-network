import { db } from '../db/firebase.config';
import { setDoc, getDoc, doc, collection, getDocs, updateDoc, } from 'firebase/firestore';
import { arrayUnion } from 'firebase/firestore';

// console.log(owner -> deployment.id, txhash, bids : [] , lease , dseq, provider, orderId, oseq)

export interface Deployment {
    owner: string;
    txhash: string;
    bids: any[];
    lease: any;
    dseq: number;
    provider: string;
    oseq: number;
    leaseStatus: {
        services: Record<string, {
            uris: string[];
        }>;
    }
}



export const saveDeployment = async (data: Deployment) => {
    try {
        const { owner, txhash, bids, lease, dseq, provider, oseq, leaseStatus } = data;
        const deploymentCollectionRef = collection(db, "deployments");
        const deploymentDocRef = doc(deploymentCollectionRef, owner);
        const orderCollectionRef = collection(deploymentDocRef, "orders");
        const orderDoc = doc(orderCollectionRef, dseq.toString());
        const orderData = {
            owner, txhash, bids, lease, dseq, provider, oseq
        };

        await setDoc(orderDoc, orderData);

        const allUserDocRef = doc(deploymentCollectionRef, 'allUser');
        await setDoc(allUserDocRef, {
            owners: arrayUnion(owner)
        }, { merge: true });

    } catch (error) {
        if (error.code === 'firestore/not-found') {
            throw new Error(`Deployment document not found: ${error.message}`);
        } else {
            console.log(error)
            throw new Error("saveDeployment Error");
        }
    }
}
export const getAllUsers = async () => {
    try {
        const deploymentCollectionRef = collection(db, "deployments");
        const allUserDocRef = doc(deploymentCollectionRef, 'allUser');
        const allUserDocSnapshot = await getDoc(allUserDocRef);
        if (allUserDocSnapshot.exists()) {
            const data = allUserDocSnapshot.data();
            console.log(data)
            return data ? data.owners : [];
        } else {
            throw new Error('allUser document does not exist');
        }
    } catch (error) {
        throw new Error(`Error getting all users: ${error.message}`);
    }
}

export const updateOrder = async (owner: string, orderId: string, fieldsToUpdate: Partial<Deployment>) => {
    try {
        const deploymentCollectionRef = collection(db, "deployments");
        const deploymentDocRef = doc(deploymentCollectionRef, owner);
        const orderCollectionRef = collection(deploymentDocRef, "orders");
        const orderDoc = doc(orderCollectionRef, orderId);
        await updateDoc(orderDoc, fieldsToUpdate);
    } catch (error) {
        if (error.code === 'firestore/not-found') {
            throw new Error(`Order document not found: ${error.message}`);
        } else {
            throw new Error("updateOrder Error");
        }
    }
}



export const getOrdersByOwner = async (owner: string, onlyID: boolean = true) => {
    try {
        const deploymentCollectionRef = collection(db, "deployments");
        const deploymentDocRef = doc(deploymentCollectionRef, owner);
        const orderCollectionRef = collection(deploymentDocRef, "orders");
        const orderDocsSnapshot = await getDocs(orderCollectionRef);
        const orders = onlyID ? orderDocsSnapshot.docs.map(doc => doc.id) : orderDocsSnapshot.docs.map(doc => doc.data());
        return orders;
    } catch (error) {
        throw new Error(`Error getting orders by owner: ${error.message}`);
    }
}



export const getOrderByOrderId = async (owner: string, orderId: string) => {
    try {
        const deploymentCollectionRef = collection(db, "deployments");
        const deploymentDocRef = doc(deploymentCollectionRef, owner);
        const orderCollectionRef = collection(deploymentDocRef, "orders");
        const orderDocRef = doc(orderCollectionRef, orderId);
        const orderDocSnapshot = await getDoc(orderDocRef);
        if (orderDocSnapshot.exists()) {
            return orderDocSnapshot.data();
        } else {   
            throw new Error(`Order with id ${orderId} not found`);
        }
    } catch (error) {
        throw new Error(`Error getting order by orderId: ${error.message}`);
    }
}

const dummyDeployments: Deployment[] = [
    {
        owner: 'akash1z47haahlta2d0xlh6402ukyuf43m7fnlfc8hax',
        txhash: 'new hash',
        bids: [{ amount: '0.00001', bidder: '0x123456789' }],
        lease: { duration: 30, price: '0.00001' },
        dseq: 4740952,
        provider: 'akash',
        oseq: 2,
        leaseStatus: null
    },


];

dummyDeployments.forEach(async (deployment) => {
    await getAllUsers();
    // await saveDeployment(deployment);

    // const data = await getOrdersByOwner("akash1z47haahlta2d0xlh6402ukyuf43m7fnlfc8hax")
    // console.log(data)

    // const data2 = await getOrderByOrderId("dsf0x123456789", "new0x99234567890")
    // console.log(data2)

    // await updateOrder("owner2", "1", { dseq: 20 })
});