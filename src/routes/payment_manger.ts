import express from 'express';
import { Stripe } from 'stripe';

const paymentManager = express.Router();

const getAddress = async (email: string) => {
    return process.env.PRIVATE_KEY;
};

paymentManager.post('/payment', async (req, res) => {
    try {
        const { amount, token, description, currency , email, name , address, paymentMethodId } = req.body;

        if (!amount || !token || !email || !name || !paymentMethodId || !address ||!currency ||!description) {
            return res.status(400).send("Missing required payment parameters.");
        }

        // const address = await getAddress(email);

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2024-04-10',
        });

        // Creating a customer in Stripe if needed.
        const customer = await stripe.customers.create({
            email: email,
            source: token.id,
            name: name,
            address:  address   // Assuming 'address' is just a line1 for simplicity.
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: currency ,
            description: description || "",
            payment_method: paymentMethodId,
            receipt_email: email,
            confirm: true,
            setup_future_usage: 'on_session', // To reuse the payment method later
            customer: customer.id,
            metadata: { customerName: name }
        });

        res.json({ clientSecret: paymentIntent.client_secret });

    } catch (err) {
        console.error('Error processing payment:', err);
        let message = 'An error occurred while processing your payment.';

        if (err.type === 'StripeCardError') {
            message = err.message;
        }

        res.status(500).send(message);
    }
});
export default paymentManager;