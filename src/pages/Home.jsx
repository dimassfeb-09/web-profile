import React, {useState} from "react";
import Nav from "../components/common/Nav";
import TextFieldContact from "../components/TextFieldContact";

import SkillCard from "../components/SkillCard";

import {ToastContainer} from "react-toastify";
import toastNotify from "../components/common/Toast";

import {db} from "../config/Firebase";
import {doc, setDoc} from "firebase/firestore";
import PortoCard from "../components/PortoCard";

function Home() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const fieldInputNotNull = () => {
        if (name === "") {
            return "Name cannot be empty!";
        } else if (email === "") {
            return "Email cannot be empty!";
        } else if (message === "") {
            return "Message cannot be empty!";
        }

        if (message.length < 50) {
            return "Minimum Message 50 characters!";
        }
    };

    const onHandleSubmit = async (event) => {
        event.preventDefault();

        const errorMessage = fieldInputNotNull();
        if (errorMessage) {
            return toastNotify("error", errorMessage);
        }

        try {
            const date = new Date();

            await setDoc(doc(db, "message", `${date}`), {
                name: name,
                email: email,
                message: message,
            });

            toastNotify("success", "Success send message!");

            setEmail("");
            setName("");
            setMessage("");

            return;
        } catch (error) {
            toastNotify("error", "Failed send message!");
            return;
        }
        //
    };

    return (
        <>
            <Nav/>
            <div className="h-screen w-full flex items-center justify-center pt-40 sm:pt-20" id="/">
                <div
                    className="flex flex-col xl:flex-row justify-center items-center space-y-10 xl:space-y-0 space-x-0 xl:space-x-16">
                    <div className="bg-home w-56 h-56 xl:w-96 xl:h-96 object-fill rounded-full"></div>
                    <div>
                        <div className="p-5 space-y-5 lg:text-2xl lg:space-y-10">
                            <div className="flex flex-row space-x-2 items-center">
                                <p>Hi! I Am</p>
                                <p className="bg-primaryColor px-3 py-1 rounded-full font-bold text-white">
                                    Student Computer Science
                                </p>
                            </div>
                            <div className="text-6xl font-bold">Dimas Febriyanto</div>
                            <div className="">
                                While studying at Gunadarma University, I am interested in
                                backend developers
                            </div>
                            <button className="rounded-md bg-primaryColor text-white py-2 px-3">
                                Contact Me
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="pt-28 xl:pt-36 w-full flex flex-col items-center"
                id="about"
            >
        <span className="text-6xl border-b-2 border-black font-semibold mb-20">
          About
        </span>
                <div className="px-5 sm:px-10 xl:w-1/2 text-justify font-semibold text-lg lg:text-3xl">
                    Halo, nama saya Dimas Febriyanto. Saya seorang Backend Developer
                    dengan minat khusus dalam pengembangan aplikasi menggunakan teknologi
                    Golang, Flutter, Firebase, dan Mysql. Saya sedang masa pendidikan di
                    Universitas Gunadarma, di mana saya memperoleh pemahaman mendalam
                    tentang teknologi informasi dan pengembangan perangkat lunak.
                </div>
            </div>
            <div
                className="pt-28  xl:pt-36 w-full flex flex-col items-center"
                id="skill"
            >
        <span className="text-6xl border-b-2 border-black font-semibold mb-20">
          Skill
        </span>
                <div
                    className="flex flex-col space-y-5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 xl:grid xl:space-y-0 xl:space-x-0 xl:gap-5">
                    <SkillCard image="skill-1.png"></SkillCard>
                    <SkillCard image="skill-2.png"></SkillCard>
                    <SkillCard image="skill-3.png"></SkillCard>
                    <SkillCard image="skill-4.png"></SkillCard>
                </div>
            </div>

            <div
                className="pt-28 xl:pt-36  w-full flex flex-col items-center"
                id="porto"
            >
        <span className="text-6xl border-b-2 border-black font-semibold mb-20">
          Portopolio
        </span>
                <div
                    className="flex flex-col space-y-5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 xl:grid xl:space-y-0 xl:space-x-0 xl:gap-5">
                    <PortoCard title="eLibLend - Library App | Flutter Mobile" image="project-1.png"
                               techs={["Flutter", "BloC State Management", "Firebase Auth", "Firebase Firestore"]}
                               github="https://github.com/dimassfeb-09/LibraryApp"
                               playstore="https://play.google.com/store/apps/details?id=com.superapp.library_app"></PortoCard>
                    <PortoCard title="KBBI: Kamus Indonesia Online" image="project-2.png"
                               techs={["Flutter", "GetX State Management"]}
                               github="https://github.com/dimassfeb-09/kbbi-apps"
                               playstore="https://play.google.com/store/apps/details?id=com.kbbisuperapp.com_kbbisuperapp&hl=id-ID"></PortoCard>
                    <PortoCard image="project-1.png"></PortoCard>
                    <PortoCard image="project-1.png"></PortoCard>
                </div>
            </div>
            <div
                className="pt-28 xl:pt-36 h-screen w-full flex flex-col items-center"
                id="contact"
            >
        <span className="text-6xl border-b-2 border-black font-semibold mb-20">
          Contact
        </span>
                <form
                    className="flex flex-col w-3/4 xl:w-1/2 items-center space-y-5"
                    onSubmit={onHandleSubmit}
                >
                    <div className="w-full space-y-5">
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
                        <div>
                            <label htmlFor="message" className="block">
                                Pesan <span className="text-red-700">*</span>
                            </label>
                            <textarea
                                className={`border w-full rounded-md p-2`}
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
                            <div className="flex justify-between text-sm xl:text-lg">
                                <span>{message.length}/500</span>
                                <span>Min 50 characters</span>
                            </div>
                        </div>
                    </div>
                    <button
                        className="bg-primaryColor px-5 py-2 w-20 text-white rounded-md"
                        type="submit"
                    >
                        Kirim
                    </button>
                    <ToastContainer/>
                </form>
            </div>
        </>
    );
}

export default Home;
