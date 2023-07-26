import { Email, Instagram, LinkedIn } from "@mui/icons-material";

function Footer() {
  return (
    <footer className="h-16 bg-white flex items-center justify-evenly border-t">
      <div>Dimas Febriyanto</div>
      <div className="flex gap-5">
        <a
          href="https://www.linkedin.com/in/dimas-febriyanto-348246205/"
          target="_blank"
        >
          <LinkedIn />
        </a>
        <a href="https://instagram.com/errorlog.dimassfeb" target="_blank">
          <Instagram />
        </a>
        <a href="mailto:dimassfeb@gmail.com">
          <Email />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
