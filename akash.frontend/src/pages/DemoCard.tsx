import React from 'react';
import CreditCard from '../components/CreditCard';

const DemoCard: React.FC = () => {
    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* You can replicate <CreditCard /> multiple times or map through an array */}
                <CreditCard />
                <CreditCard />
                <CreditCard />
                <CreditCard />
                <CreditCard />
            </div>
        </div>
    );
};

export default DemoCard;
