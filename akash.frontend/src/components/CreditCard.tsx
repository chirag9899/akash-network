import React from 'react';

interface CreditCardProps {
    expiry: string;
    cardNumber: string;
    cardHolderName: string;
    bankName: string;
    cvv: string;
}

const CreditCard: React.FC<CreditCardProps> = ({ expiry, cardNumber, cardHolderName, bankName, cvv }) => {
    // Function to copy card number to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(cardNumber)
            .then(() => alert('Card number copied!'))
            .catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className='w-full max-w-md'>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full" style={{ width: '337px', height: '213px' }}>
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        <img className="h-8" src="https://www.svgrepo.com/show/499847/company.svg" alt="Workflow logo" />
                        <span className="font-medium text-gray-600">{expiry}</span>
                    </div>
                    <div className="mt-4">
                        <div className="font-bold text-gray-800 text-xl">{cardNumber}</div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-sm text-gray-600">{cardHolderName}</div>
                            <img className="h-10 w-10" src={bankName} alt="Bank logo" />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
                    <div className="text-sm font-bold text-gray-800 mt-2">CVV
                        <span className='text-sm text-gray-600'> {cvv} </span>
                    </div>
                    <div>
                        <img className="h-6" src="https://www.svgrepo.com/show/521581/copy.svg" alt="Copy icon" onClick={copyToClipboard} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCard;