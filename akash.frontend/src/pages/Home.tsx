import React from 'react';
import hero1 from '../assets/homePageHero1.svg'
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className=' flex-col p-40 space-y-40'>
        <div className="flex-col items-center justify-center space-y-10">
          <div className="text-center">
            <h1 className="text-6xl font-bold font-madmi text-primary-text">The World's Premier Decentralized Compute Marketplace<br></br>
            <span className="relative whitespace-nowrap text-akash-red">
              <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-2/3 left-0 h-[0.58em] w-full fill-secondary-text" preserveAspectRatio="none">
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.780 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.540-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.810 23.239-7.825 27.934-10.149 28.304-14.005 .417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
              <span className="relative">Akash App</span>
            </span>
            </h1>
          </div>
          <div className="text-center">
            <p className="text-secondary-text font-roboto text-3xl mt-2 ">Akash is an open network that lets users buy and sell computing resources securely and efficiently. Purpose-built for public utility.</p>
          </div>
        </div>
        {/* <div className="flex flex-col items-center justify-center border">
          <h1 className="ml-48 max-w-4xl font-display text-5xl font-bold tracking-normal text-white-300 dark:text-gray-300 sm:text-7xl">
            Revolutionize Your Deployment
            <span className="relative whitespace-nowrap text-white-600 dark:text-gray-300"> Operations</span>
            <span className="relative whitespace-nowrap text-orange-500 dark:text-orange-300">
              <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-2/3 left-0 h-[0.58em] w-full fill-orange-500 dark:fill-orange-300/60" preserveAspectRatio="none">
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.780 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.540-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.810 23.239-7.825 27.934-10.149 28.304-14.005 .417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
              <span className="relative">with akashApp</span>
            </span>
          </h1>
        </div> */}
        <div className="flex items-center justify-center bg-transparent ">
          <div className='bg-white rounded-sm'>
            <img src={hero1} alt="" className='w-full' />
          </div>
          <div className='flex-col space-y-5'>
            <div className='text-center font-roboto text-primary-text text-4xl font-bold'>
              Get the best pricing for computing resources around the world
            </div>
            <div className='text-center'>
              <button className='text-white bg-akash-red hover:bg-akash-red-dark rounded-md p-2' onClick={() => navigate("/deploy")}>Deploy</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;