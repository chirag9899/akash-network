import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-page">
      <div className="max-w-sm w-full p-8 border border-gray-300 rounded-lg shadow-lg">
        <h1 className="text-lg font-bold mb-8 text-primary-text">Login</h1>
        <form>
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-secondary-text">
              Username:
            </label>
            <input type="text" id="username" name="username" className="border p-2 w-full rounded" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-secondary-text">
              Password:
            </label>
            <input type="password" id="password" name="password" className="border p-2 w-full rounded" />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
