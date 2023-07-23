import {Email, Instagram, LinkedIn} from "@mui/icons-material";
import {FeedbackFish} from "@feedback-fish/react";

function Footer(props: { scrollY: number }) {

    const {scrollY} = props;
    const hideFooter = scrollY > 0;

    return (
        <footer
            className={`${hideFooter ? 'hidden' : 'flex flex-col fixed bottom-0 bg-white border-t-[1px] w-full l justify-center items-center h-14 py-2  sm:flex-row sm:justify-evenly sm:my-0'}`}>
            <div className="flex items-center gap-2">
                <div className="">
                    <b>Dimas Febriyanto</b> &copy; 2023
                </div>
                <div>|</div>
                <div className="hidden sm:flex sm:gap-5">
                    <a href="mailto:dimassfeb@gmail.com"><Email/></a>
                    <a href="https://www.instagram.com/errorlog.dimassfeb/" target="_blank"><Instagram/></a>
                    <a href="https://www.linkedin.com/in/dimas-febriyanto-348246205/" target="_blank"><LinkedIn/></a>
                </div>
            </div>

            <FeedbackFish projectId="2564ffa76caa6f">
                <button>Give any feedback?</button>
            </FeedbackFish>
        </footer>
    );
}

export default Footer;
