import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useNavigate, useSearchParams } from "react-router-dom";

interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string | null;
}

interface CustomerDetails {
  address: Address;
  email: string;
  name: string;
  phone: string | null;
  tax_exempt: string;
  tax_ids: string[];
}

interface Session {
  status: string;
  customer_details: CustomerDetails;
  amount: number;
}

export const Checkout = () => {

  const stripePromise = React.useMemo(() => loadStripe("pk_test_51PDhpVSF6nbQBJViaDXafiDP9OPTD3Ock0qdz7zyR8ZPgJimbaQmwCFTrLw7ilqzU8VLmgBBQQbykK40E8EaIdMp00EUa3XYm9"), []);

  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency");

  

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/create-checkout-session`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount , currency }) // Send amount to backend
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);

  }, []);

  console.log(fetchClientSecret)
  
  const options = { fetchClientSecret };

  return (
    <div id="checkout" className="w-full bg-white h-[100vh] p-10">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export const Return = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Session>();



  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    const recipientAddress = "0x0000000000000000000000000000000000000000";

    fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/session-status?session_id=${sessionId}&recipientAddress=${recipientAddress}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log("data",data)
      });
  }, []);

  if (data?.status === 'unpaid') {
    navigate('/checkout');
  }

  if (data?.status === 'paid') {
    return (
      <section id="success"><div className="h-[80vh] ">
      <div className="bg-white p-6  md:mx-auto h-full  flex flex-col justify-center">
        <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
            <path fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
            </path>
        </svg>
        <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
            <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
            <p> Have a great day!  {data.customer_details.name || data.customer_details.email || "" } </p>
            <div className="py-10 text-center" onClick={() => navigate('/')}>
                <a href="#" className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3">
                    GO BACK 
               </a>
            </div>
        </div>
    </div>
  </div>
      </section>
    )
  }

  return null;
}