import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col gap-5 bg-gradient-to-r from-blue-300 to-blue-700 text-white justify-center items-center">
      <div className="flex flex-col  items-center">
        <div className="text-8xl">404</div>
        <div className="text-3xl">Page Not Found</div>
      </div>
      <Link
        to={"/"}
        className="border p-3 hover:bg-black hover:text-white hover:border-black drop-shadow-2xl"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
