import React, { useState } from 'react';
import Table from '../components/Table';
import axios from 'axios';
import { useWeb3Auth } from '../provider/authProvider';

interface Deployment {
    owner: string;
    txhash: string;
    bids: any[];
    lease: any;
    dseq: number;
    provider: string;
    oseq: number;
    leaseStatus: {
        services: Record<string, {
            uris: string[];
        }>;
    }
}

const Deploy: React.FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [fetchedData, setFetchedData] = useState<Deployment[]>([]);
    const { deploy, getOrdersByOwner }: any = useWeb3Auth();

    const data = [
        { Cpu: 'unit 1', Memory: '512Mi', Storage: '512Mi', Gpu: 'unit 0', Price: '$199', Auction: 'Auction' },
        // { Cpu: 'unit 1', Memory: '512Mi', Storage: '512Mi', Gpu: 'unit 0', Price: '$199' },
        // Add more data as needed
    ];

    const columns = [
        { key: 'Cpu', header: 'Chipset' },
        { key: 'Memory', header: 'vRAM' },
        { key: 'Storage', header: 'Interface' },
        { key: 'Gpu', header: 'Availability' },
        { key: 'Price', header: 'Price' },
        { key: 'Auction', header: 'Recruit' },

    ];

    const handlePriceButtonClick = async () => {
        try {
            setIsLoading(true);
            const data = await deploy()
            console.log(data)
        } catch (error) {
            console.log(error)
            throw new Error(`Error deploying: ${error}`)
        } finally {
            setIsLoading(false);
        }

    };

    const handleShowOrder = async () => {
        console.log("enter")
        try {
            setIsModalOpen(true);
            const data = await getOrdersByOwner();
            console.log(data)
            setFetchedData(data)
        } catch (error) {
            console.log(error)
        }
        finally {

        }
    }

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
            <div className='flex flex-col items-center justify-center gap-3'>
                <Table
                    data={data}
                    columns={columns}
                    onActionClick={handlePriceButtonClick}
                    isLoading={isLoading}
                />
                {fetchedData && isModalOpen  ? (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                Deployed Status
                                            </h3>
                                            <div className="mt-2">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Deployed ID</th>
                                                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Bids Count</th>
                                                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {fetchedData.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.dseq}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.bids.length}</td>
                                                                <td className={`px-6 py-4 whitespace-nowrap text-xs text-gray-800 ${item.provider ? "text-green-500" : "text-red-500"}`}>{item.provider ? "Claimed" : "Pending"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setIsModalOpen(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : <div className='text-xs text-gray-600 text-left pr-96 font-extralight cursor-pointer hover:text-blue-500' onClick={() => handleShowOrder()}>check status of currently recruted</div>

                }

            </div>

        </>
    );
};

export default Deploy;