import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function HomeSection() {
  return (
    <div
      id="home"
      className="w-full px-20 lg:gap-20 h-screen flex justify-center items-center"
    >
      <div className="flex flex-col">
        <div>
          <h1 className="text-xl">
            Hi, my name is <span className="font-bold">Dimas Febriyanto</span>
          </h1>
          <div className="text-7xl font-bold">I'm a Fullstack Developer</div>
          <div className="text-lg mt-5">
            I have skills in web development and mobile development
          </div>
        </div>
        <a
          target="_blank"
          href="https://drive.google.com/file/d/1KQ3D8u_iNdRHrwFAfq-0KV2Y4_vVKxq1/view?usp=sharing"
          className="mt-10 w-min"
        >
          <Button variant="default" className="bg-main" onClick={() => {}}>
            Download My CV
          </Button>
        </a>
      </div>
      <Card className="hidden rounded-full h-44 w-44 lg:h-96 lg:w-96 lg:block">
        <img
          src="assets/img/profile.png"
          className="rounded-full"
          alt="My Picture"
        />
      </Card>
    </div>
  );
}
