import { React } from "react";

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-whiteColor space-x-14">
      <div className="bg-primaryColor sm:flex sm:flex-col sm:p-10 sm:space-y-5 sm:rounded-lg">
        <p className="text-5xl">Dimas Febriyanto</p>
        <h1 className="text-6xl text-[#AFD3E2]">
          Student at Gunadarma Univesity
        </h1>
      </div>
      <img
        src="https://fastly.picsum.photos/id/1075/536/354.jpg?hmac=gMKEqTXzPwcIage2Ru8ynrrgTUj9gpSQRgpGf176ccs"
        alt="user"
        className="rounded-full h-72 w-72"
      />
    </div>
  );
};

export default Home;
