import React from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export default function ContactSection() {
  return (
    <div
      id="contact"
      className="flex flex-col justify-center px-0  items-center w-full gap-0 sm:gap-20 py-20"
    >
      <div className="w-full px-5 sm:w-3/4 lg:w-1/2 sm:px-0">
        <div className="text-5xl font-bold">Tell me about your project</div>
        <div className="mt-10 text-xl text-justify">
          Every project begins with setting goals. If you have a vision, I can
          bring that project to life. After your inquiry, I will respond within
          2-3 business days with a preliminary proposal for the project or with
          further questions for more details. After that, we can schedule an
          introductory call to discuss your project and see if it’s a good fit.
        </div>
      </div>

      <div className="mt-10 w-full px-5 sm:px-0 sm:mt-0 sm:w-3/4 lg:w-1/2">
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input placeholder="Name" />
          <Input placeholder="Email" />
          <Textarea placeholder="Your message" />
          <Button className="bg-main" type="submit">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
