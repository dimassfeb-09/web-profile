import { Email, Instagram, LinkedIn } from "@mui/icons-material";

function Footer(props : {scrollY: number}) {

  const {scrollY} = props;
  const hideFooter = scrollY > 0;

  return (
    <footer className={`${hideFooter ? 'hidden' : 'flex flex-col fixed bottom-0 bg-white border-t-[1px] w-full l justify-center items-center h-14 py-2  sm:flex-row sm:justify-evenly sm:my-0'}`}>
      <div>Made with ❤️ by Dimas Febriyanto &copy; 2023</div>
      <div className="hidden sm:flex sm:gap-5 ">
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
