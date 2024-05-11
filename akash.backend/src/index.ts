import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Stripe from 'stripe';
import paymentManager from './routes/payment_manger';
import express from 'express';
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.



const app = express();
const Domain = 'http://localhost:5173';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-04-10',
});

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// creating routes
app.use("/api", paymentManager);




app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                // price: 'price_1PETZwSF6nbQBJViesLMIlbf',
                price_data: {
                    unit_amount: 5000,
                    currency: 'inr',
                    product_data: {
                        images: ['https://cdn.sanity.io/images/tlr8oxjg/production/c735189812ef6b7f3ba148cfbf91b9998aa851e1-1290x722.png?w=3840&q=80&fit=clip&auto=format'],
                        name: 'Gpu',
                    },
                },
                quantity: 1,

            },
        ],
        billing_address_collection: "required",
        mode: 'payment',
        return_url: `${Domain}/return?session_id={CHECKOUT_SESSION_ID}`,
    });


    res.send({ clientSecret: session.client_secret });
});

app.get('/session-status', async (req, res) => {
    console.log("here", req.query.session_id);

    const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string);

    res.send({
        status: session.status,
        customer_email: session.customer_details.email
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});