import { Email, Instagram, LinkedIn, Download } from "@mui/icons-material";

function Home() {
  return (
    <div className="h-screen flex flex-col gap-4 justify-center mx-5 md:mx-12 lg:mx-56">
      <div className="text-6xl font-bold">
        Hi! I am{" "}
        <span className="text-white bg-gradient-to-r from-blue-400 to-blue-700">
          Dimas Febriyanto ✌️
        </span>
      </div>
      <div className="text-xl">
        Halo! Nama saya Dimas Febriyanto, seorang mahasiswa dari Universitas di
        Indonesia. Saya memiliki kemampuan dan minat di dalam teknologi. Saya
        memiliki kemampuan dalam pengembangan Backend menggunakan{" "}
        <span className="underline text-blue-500">Golang</span> dan juga
        pengembangan aplikasi mobile menggunakan{" "}
        <span className="underline text-blue-500">Flutter</span>
      </div>
      <div className="mt-5">
        <div>Tertarik dengan saya?</div>
        <div className="flex gap-5 mt-2">
          <a href="mailto:dimassfeb@gmail.com">
            <Email></Email>
          </a>
          <a
            href="https://www.instagram.com/errorlog.dimassfeb/"
            target="_blank"
          >
            <Instagram></Instagram>
          </a>
          <a
            href="https://www.linkedin.com/in/dimas-febriyanto-348246205/"
            target="_blank"
          >
            <LinkedIn></LinkedIn>
          </a>
        </div>
      </div>
      <a
        className="mt-5 p-2 w-max bg-blue-500 text-white rounded-md"
        href="https://1drv.ms/b/s!AthPRe_0BQwzlBkgVH1OOdEIRY0-?e=TUWbbJ"
        target="_block"
      >
        <Download></Download>
        Unduh CV
      </a>
    </div>
  );
}

export default Home;
