const CommingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen  md:p-60">
      <div className="text-4xl md:text-8xl font-bold">
        <span role="img" aria-label="sad face" className=" bg-gradient-to-tl  from-red-600 to-red-700 text-transparent bg-clip-text text-7xl" >:(
        </span>
      </div>
      <h1 className="text-3xl md:text-6xl font-bold mt-10">
        Comming Soon to your Device ...
      </h1>
      <p className="text-xl md:text-2xl mt-6 px-20">
        Currently not supported for your device, please try on a different device or contact support for more information.
      </p>
    </div>
  );
};

export default CommingSoon;
