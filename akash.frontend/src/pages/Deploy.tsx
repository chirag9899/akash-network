import React from 'react';
import Table from '../components/Table';
const Deploy: React.FC = () => {

    const data = [
        { chipset: 'Chipset1', vRAM: '8GB', Interface: 'PCIe 3.0', Availability: 'In stock', Price: '$199' },
        { chipset: 'Chipset2', vRAM: '16GB', Interface: 'PCIe 4.0', Availability: 'Out of stock', Price: '$299' },
        // Add more data as needed
    ];

    const columns = [
        { key: 'chipset', header: 'Chipset' },
        { key: 'vRAM', header: 'vRAM' },
        { key: 'Interface', header: 'Interface' },
        { key: 'Availability', header: 'Availability' },
        { key: 'Price', header: 'Price' },
        { key: 'Action', header: 'Action' },
    ];

    const handlePriceButtonClick = (price: string) => {
        alert(`You clicked the price button for ${price}`);
        // Handle the button click event here as needed
    };

    return (
        <>
            <div className="flex-col items-center justify-center space-y-5 m-32 ">
                <div className="text-center">
                    <h1 className="text-5xl font-bold font-madmi text-primary-text">Get GPUs at the best prices available</h1>
                </div>
                <div className="text-center">
                    <p className="text-secondary-text font-roboto text-xl ">Discover Top-Quality GPUs at Unbeatable Prices: Your Ultimate Guide to Finding the Best Deals on Graphics Processing Units!</p>
                </div>
            </div>
            <div className='flex justify-center'>
                <Table
                    data={data}
                    columns={columns}
                    onActionClick={handlePriceButtonClick}
                />
            </div>
        </>
    );
};

export default Deploy;