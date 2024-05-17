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
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.



const app = express();
const Domain = 'http://localhost:5173';

// startCheckingForBids('* * * * * *');

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


app.post('/create-checkout-session', async (req, res) => {
   try {
    const { amount,currency } = req.body; // Receive amount from frontend

   
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
            {
                price_data: {
                    unit_amount: amount * 100, // Convert amount to cents
                    currency, // Adjust currency if needed
                    product_data: {
                        images: ['https://cdn.sanity.io/images/tlr8oxjg/production/c735189812ef6b7f3ba148cfbf91b9998aa851e1-1290x722.png?w=3840&q=80&fit=clip&auto=format'],
                        name: 'Deposit Money',
                    },
                },
                quantity: 1,
            },
        ],
        billing_address_collection: "required",
        mode: 'payment',
        // success_url: `${Domain}/return?success=true`,
        // cancel_url: `${Domain}/return?canceled=true`,
        return_url: `${Domain}/return?session_id={CHECKOUT_SESSION_ID}`});

     

    res.send({ clientSecret: session.client_secret });
   } catch (error) {
    console.log(error)
   }
});

app.get('/session-status', async (req, res) => {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id as string);


    console.log("session",session)
    res.send({
        status: session.payment_status,
        customer_details: session.customer_details,
        amount: session.amount_total / 100,
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});