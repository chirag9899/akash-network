



import { useWeb3Auth } from "../provider/authProvider.js";
import akash from "../assets/akash.png";


const Login = () => {
  const {  login }: any = useWeb3Auth();

  // const { status, web3Auth }: any = useWeb3Auth();
  

  // Use the provided functions as needed
  // const handleGetBalance = async () => {
  //   const balance = await getBalance();
  //   console.log("Balance:", balance);
  // };

  // const handleSendTransaction = async () => {
  //   const destination = "exampleDestinationAddress";
  //   const denom = "exampleDenom";
  //   const amount = "100";
  //   const gas = "200000";
  //   const result = await sendTransaction(destination, denom, amount, gas);
  //   console.log("Transaction Result:", result);
  // };

  // const handleGetUserInfo = async () => {
  //   const userInfo = await getUserInfo();
  //   console.log("User Info:", userInfo);
  // };

  // const unloggedInView = (
  //   <>
  //   <button onClick={login} className="card">
  //     Login
  //   </button>
  //     <div>

  //   </div>
  //   </>
  // );

  // const handleGetKey = async () => {
  //   const { privateKey, wallet } = await getPrivateKeyAndWallet();
  //   console.log(wallet)
  // };

  // const loggedInView = (
  //   <>
  //     <div>
  //       {/* Your component JSX */}
  //       <button onClick={handleGetBalance}>Get Balance</button>
  //       <button onClick={handleSendTransaction}>Send Transaction</button>
  //       <button onClick={handleGetUserInfo}>Get User Info</button>
  //       <button onClick={handleGetKey}>Get private key</button>
  //       <button onClick={logout}>logout</button>
      
  //     </div>
  //   </>
  // );


  return (
    // <>
    //   <div className="flex flex-col items-center justify-between space-y-10  py-32">
    //     <div className='px-10 py-10 flex flex-col items-center gap-2'>
    //       <img src={logo} alt="logo" className='h-40' />
    //       <div className='py-5  text-bold font-bold text-5xl'>
    //         Welcome to akash Network
    //       </div>
    //     </div>
    //     <div>
    //       <div className=" bg-akash-red flex w-full p-4 rounded-lg spaxe-x-2 space-y-2 text-white" >{unloggedInView} </div>
    //     </div>
    //   </div>

    // </>
<div className=" h-[90vh] ">

  <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
    <div className="w-full flex items-center justify-center">
     <img src={akash} alt="logo" className='h-40' />

    </div>
    {/* <div className="flex justify-center">
      <a className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-800 p-1 ps-3 rounded-full transition hover:border-gray-300" href="#">
        PRO release - Join to waitlist
        <span className="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-gray-200 font-semibold text-sm text-gray-600">
          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </span>
      </a>
    </div> */}

    <div className="mt-5 max-w-2xl text-center mx-auto">
      <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl">
      Enter the Future with 
        <p className="bg-clip-text bg-gradient-to-tl  from-red-600 to-red-700 text-transparent ml-2">Akash Network</p>
      </h1>
    </div>

    <div className="mt-5 max-w-3xl text-center mx-auto">
      <p className="text-lg text-gray-600">Access Your Secure, Decentralized Cloud Computing Account - Experience the Future of Distributed Cloud Services Today.</p>
    </div>

    <div className="mt-8 gap-3 flex justify-center" onClick={login}>
      <a className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-akash-red to-akash-red-dark hover:from-akash-red-dark hover:to-akash-red border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 py-3 px-4" href="#">
        login
        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </a>
    </div>
  </div>
</div>

  );
};

export default Login


