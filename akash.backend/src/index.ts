import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Stripe from 'stripe';
import paymentManager from './routes/payment_manger';
import express from 'express';
import deployManager from './routes/deploy_manger';
import { startCheckingForBids } from './utils/cronjob';
import walletManagerRouter from './routes/wallet_manager';
import dbManagerRouter from './routes/db_managerr';
const port = process.env.PORT || 3000;

const app = express();
const Domain = process.env.Domain;

startCheckingForBids('*/5 * * * *');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-04-10',
});

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// creating routes
app.use("/api", paymentManager);
app.use("/api", deployManager);
app.use("/api", walletManagerRouter);
app.use("/api", dbManagerRouter);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://akash-frontend.vercel.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

console.log("first")