import express from 'express';
import { Stripe } from 'stripe';
import { sendAKT } from '../utils/transactions';

const paymentManager = express.Router();

const Domain = 'http://localhost:5173';

console.log("found",process.env.STRIPE_SECRET_KEY)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-04-10',
});

const getAddress = async (email: string) => {
    return process.env.PRIVATE_KEY;
};

paymentManager.post('/create-checkout-session', async (req, res) => {
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

paymentManager.get('/session-status', async (req, res) => {


    const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string);
    const recipientAddress = req.query.address as string
    const amount = req.query.amount as string

    // if (session.status === 'complete') {
    //     sendAKT( recipientAddress, amount)  

    // }

    res.send({
        status: session.status,
        customer_email: session.customer_details.email
    });


});



// paymentManager.post('/payment', async (req, res) => {
//     try {
//         const { amount, token, description, currency , email, name , address, paymentMethodId } = req.body;

//         if (!amount || !token || !email || !name || !paymentMethodId || !address ||!currency ||!description) {
//             return res.status(400).send("Missing required payment parameters.");
//         }

//         // const address = await getAddress(email);

//         const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//             apiVersion: '2024-04-10',
//         });

//         // Creating a customer in Stripe if needed.
//         const customer = await stripe.customers.create({
//             email: email,
//             source: token.id,
//             name: name,
//             address:  address   // Assuming 'address' is just a line1 for simplicity.
//         });

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency: currency ,
//             description: description || "",
//             payment_method: paymentMethodId,
//             receipt_email: email,
//             confirm: true,
//             setup_future_usage: 'on_session', // To reuse the payment method later
//             customer: customer.id,
//             metadata: { customerName: name }
//         });

//         res.json({ clientSecret: paymentIntent.client_secret });

//     } catch (err) {
//         console.error('Error processing payment:', err);
//         let message = 'An error occurred while processing your payment.';

//         if (err.type === 'StripeCardError') {
//             message = err.message;
//         }

//         res.status(500).send(message);
//     }
// });

export default paymentManager;