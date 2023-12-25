import React, { useEffect, useState } from "react";
import { addDoc, collection } from "@firebase/firestore";
import { db } from "../db/Firebase.ts";
import { ToastContainer } from "react-toastify";
import toastNotify from "../commons/Toast.tsx";

const Contact = () => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function ValidateEmail() {
    if (email != "") {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setIsEmailValid(true);
      } else {
        setIsEmailValid(false);
      }
    }
  }

  const onHandleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (name == "") {
        throw new Error("Nama tidak boleh kosong");
      } else if (email == "") {
        throw new Error("Email tidak boleh kosong");
      } else if (message == "") {
        throw new Error("Pesan tidak boleh kosong");
      } else if (message.length <= 50) {
        throw new Error("Minimal pesan 50 karakter");
      } else if (isEmailValid == false) {
        throw new Error("Masukkan email yang valid");
      }

      const date = new Date();
      await addDoc(collection(db, "message"), {
        name: name,
        email: email,
        message: message,
        created_at: date,
      });

      setEmail("");
      setName("");
      setMessage("");

      toastNotify({ type: "success", message: "Berhasil kirim pesan" });

      return;
    } catch (error) {
      toastNotify({ type: "error", message: `Terjadi kesalahan: ${error}` });
      return;
    }
    //
  };

  const isDisabledSubmit = (): boolean => {
    if (name == "") return true;
    if (email == "") return true;
    if (isEmailValid == false) return true;
    if (message == "") return true;
    if (message.length < 50) return true;

    return false;
  };

  useEffect(() => {
    setDisabled(isDisabledSubmit());
    ValidateEmail();
  }, [isDisabledSubmit]);

  return (
    <div className="pb-14">
      <h1 className="flex justify-center items-center text-5xl font-bold pt-20 text-white">
        Contact
      </h1>
      <div className="flex flex-col items-center">
        <form className="flex flex-col w-full sm:w-3/4 lg:w-1/2 px-5 text-white">
          <label htmlFor="name" className="mt-2 required">
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className="border p-3 mt-2 rounded-lg bg-secondary focus:border-white focus:outline-none input-active placeholder-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email" className="mt-2 required">
            Email
          </label>
          <input
            type="text"
            placeholder="Your email"
            className="border p-3 mt-2 rounded-lg  bg-secondary focus:border-white focus:outline-none input-active placeholder-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="text-xs mt-1 text-red-500">
            {!isEmailValid && email != "" ? "Masukkan email yang valid" : ""}
          </span>

          <label htmlFor="Message" className="mt-2 required">
            Messages
          </label>
          <textarea
            placeholder="Your message"
            className="border p-3 mt-2 rounded-lg bg-secondary focus:border-white focus:outline-none input-active placeholder-gray-300"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <span className="text-xs mt-1 text-red-500">
            {message.length < 50 && message != "" ? "Minimal 50 karakter" : ""}
          </span>
        </form>
        <button
          className="py-2 px-8 mt-10
          disabled:bg-gray-200
          disabled:text-gray-500 
          disabled:font-normal 
          disabled:shadow-none
          disabled:border
          bg-gradient-to-r from-secondary/40 to-teal-500/50
          rounded-lg 
          shadow-secondary/50
          text-white font-bold"
          onClick={onHandleSubmit}
          disabled={disabled}
        >
          Send Message
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Contact;
