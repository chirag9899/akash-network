import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import paymentManager from './routes/payment_manger';
import Stripe from 'stripe';
// import transactionSimulationRouter from './routes/transactionSimulationRouter';
// import userRouter from './routes/userRouter';
// import promptRouter from './routes/promptRouter';

dotenv.config();

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
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // price: 'price_1PETZwSF6nbQBJViesLMIlbf',
        price_data: {
          unit_amount: 5000,
          currency: 'inr',
          product_data: {
            name: 'Gpu',
          },
        },
        quantity: 1,
        
      },
    ],
    billing_address_collection: "required",
    mode: 'payment',
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel"
  });

  console.log(session)
  res.send({ clientSecret: session.url });
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});