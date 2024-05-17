const CommingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 md:p-60">
      <div className="text-4xl md:text-8xl font-bold">
        <span role="img" aria-label="sad face">:(
        </span>
      </div>
      <h1 className="text-3xl md:text-6xl font-bold mt-10">
        Comming Soon to your Device
      </h1>
      <p className="text-xl md:text-2xl mt-10">
        Currently not supported for your device, please try on a different device or contact support for more information.
      </p>
    </div>
  );
};

export default CommingSoon;
