import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import paymentManager from './routes/payment_manger';
// import transactionSimulationRouter from './routes/transactionSimulationRouter';
// import userRouter from './routes/userRouter';
// import promptRouter from './routes/promptRouter';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// creating routes
app.use("/api", paymentManager);


app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});