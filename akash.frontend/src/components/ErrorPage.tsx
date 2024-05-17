
const ErrorPage = () => {
  return (
    (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-8xl font-bold">
            <span role="img" aria-label="sad face">:(
            </span>
          </div>
          <h1 className="text-6xl font-bold mt-10">
            Oops! Page Not Found
          </h1>
          <p className="text-2xl mt-10">
            We're sorry, but the page you're looking for doesn't exist.
            <br />
            Please check the URL for any typos or try searching for what
            you're looking for above.
          </p>
        </div>
      )
  )
}

export default ErrorPage