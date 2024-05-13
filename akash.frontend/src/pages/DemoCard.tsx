import React from 'react';
import CreditCard from '../components/CreditCard';
import mastercard from '../assets/mastercard.svg';
import visa from '../assets/visa.svg';
import amex from '../assets/amex.svg';

const DemoCard: React.FC = () => {
    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* You can replicate <CreditCard /> multiple times or map through an array */}
            <CreditCard 
                expiry="05/55" 
                cardNumber="5555 5555 5555 4444" 
                cardHolderName="John Doe" 
                bankName={mastercard} 
                cvv="123" 
            />
            
            <CreditCard 
                expiry="03/35" 
                cardNumber="4111 1111 1111 1111" 
                cardHolderName="Michael Jackson" 
                bankName={visa}
                cvv="111" 
            />

            <CreditCard 
                expiry="01/42" 
                cardNumber="3714 4963 5398 431" 
                cardHolderName="James Bond" 
                bankName={amex}
                cvv="777" 
            />

            <CreditCard 
                expiry="11/31" 
                cardNumber="4012 8888 8888 1881" 
                cardHolderName="Rajesh Khanna" 
                bankName={visa}
                cvv="156" 
            />

            <CreditCard 
                expiry="07/37" 
                cardNumber="5105 1051 0510 5100" 
                cardHolderName="Cristiano Ronaldo" 
                bankName={mastercard}
                cvv="421" 
            />  
            </div>
        </div>
    );
};

export default DemoCard;