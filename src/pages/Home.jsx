import React from "react";
import Nav from "../components/common/Nav";
import AboutSection from "../components/AboutSection";
import SkillSection from "../components/SkillSection";
import HomeSection from "../components/HomeSection";
import PortoSection from "../components/PortoSection";
import ContactSection from "../components/ContactSection";

function Home() {
  return (
    <>
      <Nav />
      <div className="h-screen flex items-center px-36 z-1">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row items-center space-x-3">
                <p>Hi! I Am</p>
                <p className="bg-primaryColor text-white py-2 rounded-full px-4">
                  Student Computer Science
                </p>
              </div>
              <div className="font-bold text-6xl">Dimas Febriyanto</div>
              <div className="w-[400px]">
                While studying at Gunadarma University, I am interested in
                backend developers
              </div>
            </div>
            <button className="w-28 h-9 bg-primaryColor mt-20 rounded-md text-white hover:bg-lightPrimaryColor">
              Contact Me
            </button>
          </div>
          <div className="h-[426px] w-[426px] bg-home rounded-full"></div>
        </div>
      </div>
      <div className="h-screen pt-24 flex flex-col items-center justify-items-center font-semibold">
        <span className="mt-14 text-5xl border-b-2 border-black ">About</span>
        <div className="content mt-28 w-1/2 text-justify text-2xl">
          Halo, nama saya Dimas Febriyanto. Saya seorang Backend Developer
          dengan minat khusus dalam pengembangan aplikasi menggunakan teknologi
          Golang, Flutter, Firebase, dan Mysql. Saya sedang masa pendidikan di
          Universitas Gunadarma, di mana saya memperoleh pemahaman mendalam
          tentang teknologi informasi dan pengembangan perangkat lunak.
        </div>
      </div>
      <div className="h-screen flex flex-col pt-24 items-center">
        <div className="mt-14 text-5xl border-b-2 border-black font-semibold">
          Skill
        </div>
        <div className="flex flex-row space-x-5 items-center justify-center mt-36">
          <SkillCard image="skill-1.png" />
          <SkillCard image="skill-2.png" />
          <SkillCard image="skill-3.png" />
          <SkillCard image="skill-4.png" />
        </div>
      </div>
      <div className="h-screen flex flex-col items-center  bg-teal-500 pt-24">
        <div className="mt-14 text-5xl border-b-2 border-black font-semibold">
          Portopolio
        </div>
        <PortoCard />
      </div>
      <div className="h-screen flex flex-col pt-24 items-center">
        <div className="mt-14 text-5xl border-b-2 border-black font-semibold">
          Contact
        </div>
        <div className="w-1/2 mt-16">
          <form
            onSubmit={onHandleSubmit}
            className="space-y-6 flex flex-col items-center justify-center"
          >
            <div className="w-full space-y-3">
              <TextFieldContact
                type="text"
                name="nama"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder={"Your Name"}
              >
                Nama
              </TextFieldContact>
              <TextFieldContact
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder={"Your email. Ex: yourmail@gmail.com"}
              >
                Email
              </TextFieldContact>
              <div className="space-y-2">
                <label htmlFor="message" className="block">
                  Pesan <span className="text-red-700">*</span>
                </label>
                <textarea
                  className="border w-full rounded-md p-2"
                  name="message"
                  id="message"
                  cols="5"
                  rows="8"
                  placeholder="Send message"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  required={true}
                  maxLength={500}
                ></textarea>
                <div className="flex flex-row justify-between text-xs">
                  <span>{message.length}/500</span>
                  <span>Min 50 characters</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-primaryColor text-white p-3 rounded-md"
            >
              Kirim
            </button>
            <ToastContainer />
          </form>
        </div>
      </div>
    </>
  );
}

export default Home;
