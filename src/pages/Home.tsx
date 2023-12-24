import {
  ArrowDownward,
  ContactPage,
  Laptop,
  OpenInNew,
  Smartphone,
} from "@mui/icons-material";
import CardDevelopment from "../components/CardDevelopment";
import AnimatedText from "../components/AnimatedText";
import Contact from "./Contact";
import Portfolio from "./Portfolio";
import { useRef } from "react";

function Home() {
  const sayHello = [
    "I'm Dimas",
    "나는 디마스",
    "Saya Dimas",
    "я Димас",
    "わたし は ぢます で",
  ];

  const myElementRef = useRef<HTMLDivElement>(null);

  const scrollToElement = () => {
    if (myElementRef.current) {
      myElementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className=" bg-primary ">
      <div className="flex flex-col h-screen justify-center items-center">
        <div className="flex flex-col gap-10 px-7">
          <div className="text-7xl lg:text-9xl font-bold flex flex-col items-center gap-3">
            <div>Hey There,</div>
            <span className="text-secondary mt-5 text-center">
              <AnimatedText texts={sayHello} delay={350} isInfinite={true} />
              <span className="text-black">.</span>
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center mt-10 gap-3 text-secondary font-bold">
          <a
            target="_blank"
            href="mailto:dimassfeb@gmail.com"
            className="flex gap-2 w-min"
          >
            <span>dimassfeb@gmail.com</span>
            <OpenInNew />
          </a>
          <span className="text-black font-bold">|</span>
          <a
            target="_blank"
            href="https://drive.google.com/file/d/1nhKAmsKXEH_H48rEKqE6dg8k-Ndmtx46/view"
          >
            Resume <ContactPage />
          </a>
        </div>
        <div className="mt-40 flex flex-col items-center gap-2">
          <span className="font-bold">For More</span>
          <div
            className="rounded-full h-12 w-12 border border-black flex items-center justify-center"
            onClick={scrollToElement}
          >
            <ArrowDownward />
          </div>
        </div>
      </div>
      <div className="bg-white p-14" id="myElement" ref={myElementRef}>
        <div className="font-bold text-5xl">What I can do?</div>
        <div className="text-justify mt-8">
          I am interested in both mobile development and backend development,
          and I am capable of utilizing technologies such as Flutter for mobile
          app development and Golang for backend programming.
        </div>
        <div className="flex flex-col justify-between mt-20">
          <div className="">
            <CardDevelopment
              title="Web Development"
              className="bg-red2nd"
              icon={<Laptop />}
            />
          </div>
          <div className="flex justify-between mt-10">
            <div></div>
            <CardDevelopment
              title="Mobile Development"
              className="bg-green2nd"
              icon={<Smartphone />}
            />
          </div>
        </div>
      </div>
      <div id="portfolio" className="pt-20">
        <Portfolio />
      </div>
      <div className="bg-white" id="contact">
        <h1 className="flex justify-center items-center text-5xl font-bold pt-20 mb-10">
          Contact
        </h1>
        <Contact />
      </div>
    </div>
  );
}

export default Home;
