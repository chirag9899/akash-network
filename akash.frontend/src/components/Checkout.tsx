import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useNavigate } from "react-router-dom";


export const CheckoutForm = () => {

  const stripePromise = React.useMemo(() => loadStripe("pk_test_51PDhpVSF6nbQBJViaDXafiDP9OPTD3Ock0qdz7zyR8ZPgJimbaQmwCFTrLw7ilqzU8VLmgBBQQbykK40E8EaIdMp00EUa3XYm9"), []);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/create-checkout-session`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

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
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const address = '0x1234'
  const amount = '1'


  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/session-status?session_id=${sessionId}&address=${address}&amount=${amount}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    navigate('/checkout');
  }

  if (status === 'complete') {
    return (
      <section id="success"><div className="bg-gray-100 h-screen">
      <div className="bg-white p-6  md:mx-auto">
        <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
            <path fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
            </path>
        </svg>
        <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done! ${customerEmail}</h3>
            <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
            <p> Have a great day!  </p>
            <div className="py-10 text-center">
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

