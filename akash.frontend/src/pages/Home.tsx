import React from 'react';

const Home: React.FC = () => {
  return (
    // <InteractiveBackground>
    <div className="h-[80vh] bg-page flex items-center justify-center ">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-text">Hello</h1>
        <p className="text-secondary-text mt-2">Welcome to our website!</p>
      </div>
    </div>
    // </InteractiveBackground>
  );
};

export default Home;
