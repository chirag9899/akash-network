import express from 'express';
import { Deployment, getOrdersByOwner, saveDeployment } from '../utils/db';

const dbManagerRouter = express.Router();

dbManagerRouter.post('/getOrdersByOwner', async (req, res) => {
    try {
        console.log("enter")
        const { owner, onlyID }: { owner: string, onlyID?: boolean } = req.body;
        const orders = await getOrdersByOwner(owner, onlyID);
        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting orders by owner' });
    }
});




dbManagerRouter.post('/saveDeployment', async (req, res) => {
    try {
        const {data} = req.body;
        console.log(data)
        await saveDeployment(data);
        res.json({ message: 'Deployment saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving deployment' });
    }
});


export default dbManagerRouter;
