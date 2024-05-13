import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');

  const handleDeposit = () => {
    // Redirect to the Return component with amount and currency
    navigate(`/checkout?amount=${amount}&currency=${currency}`);
  };
  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-4xl font-bold text-gray-800 font-roboto">Add Money</h2>
      <div className="bg-white border rounded-lg shadow-lg p-8 mt-6 w-[40vw]">
        <form onSubmit={handleDeposit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="amount" className="text-gray-700 font-medium">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="currency" className="text-gray-700 font-medium">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
              required
            >
              <option value="">Select currency</option>
              <option value="inr">INR</option>
              <option value="usd">USD</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-akash-red hover:bg-akash-red-dark text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            Deposit Now
          </button>
        </form>
      </div>
    </div>
  );
  
  
};

export default CheckoutForm;