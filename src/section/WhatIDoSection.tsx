import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

export default function WhatIDoSection() {
  return (
    <div
      id="what-i-do"
      className="w-full bg-mainAccent flex flex-col gap-20 items-center py-20"
    >
      <div className="text-5xl font-bold mb-5">What I Do</div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-3/4 lg:w-3/4 gap-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Mobile Development</CardTitle>
            <CardDescription className="text-lg">
              I specialize in building intuitive and feature-rich mobile
              applications that enhance user engagement. From concept to launch,
              I help you create apps that are tailored to your business needs
              and provide a seamless experience across devices. I can work with
              you to define the key features of your app, ensuring it's ready to
              drive growth and connect with your users on a deeper level.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Web Development</CardTitle>
            <CardDescription className="text-lg">
              I specialize in crafting responsive and scalable websites that
              meet modern standards. From initial design to deployment, I ensure
              that your web presence is optimized for both performance and user
              experience. I can work with you to transform your vision into a
              fully functioning website, streamlining the development process
              and delivering a platform that grows with your business.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
