import { Email, Instagram, LinkedIn } from "@mui/icons-material";

function Footer() {
  return (
    <footer className="bg-white flex flex-col p-2 mt-28 w-full gap-2 sm:gap-0 sm:flex-row sm:justify-around items-center border-t border-black">
      <div>Made with ❤️ by Dimas Febriyanto | &copy; 2023</div>
      <div className="flex gap-5">
        <a href="emailto:dimassfeb@gmail.com">
          <Email></Email>
        </a>
        <a href="https://www.instagram.com/errorlog.dimassfeb/" target="_blank">
          <Instagram></Instagram>
        </a>
        <a
          href="https://www.linkedin.com/in/dimas-febriyanto-348246205/"
          target="_blank"
        >
          <LinkedIn></LinkedIn>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
