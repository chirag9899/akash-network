import express from 'express';
import { Stripe } from 'stripe';
import { sendAKT } from '../utils/transactions';

const paymentManager = express.Router();

const Domain = 'http://localhost:5173';

console.log("found", process.env.STRIPE_SECRET_KEY)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-04-10',
});

const getAddress = async (email: string) => {
    return process.env.PRIVATE_KEY;
};

paymentManager.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, currency } = req.body; // Receive amount from frontend


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
            return_url: `${Domain}/return?session_id={CHECKOUT_SESSION_ID}`
        });



        res.send({ clientSecret: session.client_secret });
    } catch (error) {
        console.log(error)
        throw new Error("create-checkout-session Error")
    }
});

paymentManager.get('/session-status', async (req, res) => {
    try {
        const { session_id, recipientAddress } = req.query;
        const session = await stripe.checkout.sessions.retrieve(session_id as string);
        const amount = (session.amount_total / 100)
        const akt_amount = session.currency === "usd" ? (amount * 0.18) : (amount * 0.0022)
        let failed = false;
    

        if (session.payment_status == "paid") {
            try {
                // console.log((akt_amount * (10 ** 6)).toString())
                const data = await sendAKT(recipientAddress.toString(), (akt_amount * (10 ** 6)).toString())

            } catch (error) {
                console.log(error)
                failed = true
                throw new Error("Payment not sent")
            }
        }
        else {
            throw new Error("Payment not paid")
        }

        res.send({
            status: session.payment_status,
            customer_details: session.customer_details,
            // amount: (amount / (10 ** 6) + "Akt").toString(),
            failed: failed

        });
    } catch (error) {
        console.log(error)
        throw new Error("session-status Failed")
    }

});



export default paymentManager;