import React from 'react';

const CreditCard: React.FC = () => {
    // Function to copy card number to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText("5555 5555 5555 4444")
            .then(() => alert('Card number copied!'))
            .catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className='w-full max-w-md'>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full" style={{ width: '337px', height: '213px' }}>
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        <img className="h-8" src="https://www.svgrepo.com/show/499847/company.svg" alt="Workflow logo" />
                        <span className="font-medium text-gray-600">05/55</span>
                    </div>
                    <div className="mt-4">
                        <div className="font-bold text-gray-800 text-xl">5555 5555 5555 4444</div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-sm text-gray-600">JOHN DOE</div>
                            <img className="h-10 w-10" src="https://www.svgrepo.com/show/362011/mastercard.svg" alt="Mastercard logo" />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
                    <div className="text-sm font-bold text-gray-800 mt-2">cvv
                    <span className='text-sm text-gray-600'> 123 </span>
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

