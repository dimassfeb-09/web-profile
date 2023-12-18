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
    <>
      <div className="dark:bg-darkColor dark:text-white mb-10 flex flex-col items-center">
        <form className="flex flex-col w-full sm:w-3/4 lg:w-1/2 px-5">
          <label htmlFor="name" className="mt-2 required">
            Nama
          </label>
          <input
            type="text"
            placeholder="Your name"
            className="border p-3 mt-2 dark:bg-darkColor dark:opacity-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email" className="mt-2 required">
            Email
          </label>
          <input
            type="text"
            placeholder="Your email"
            className="border p-3 mt-2 dark:bg-darkColor dark:opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="text-xs mt-1 text-red-500">
            {!isEmailValid && email != "" ? "Masukkan email yang valid" : ""}
          </span>

          <label htmlFor="Message" className="mt-2 required">
            Pesan
          </label>
          <textarea
            placeholder="Your message"
            className="border p-3 mt-2 dark:bg-darkColor dark:opacity-50"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <span className="text-xs mt-1 text-red-500">
            {message.length < 50 && message != "" ? "Minimal 50 karakter" : ""}
          </span>
        </form>
        <button
          className="py-2 px-8 w-min border mt-5 hover:bg-black hover:text-white disabled:bg-gray-50 disabled:text-gray-400 dark:hover:bg-white dark:hover:text-black"
          onClick={onHandleSubmit}
          disabled={disabled}
        >
          Kirim
        </button>
        <ToastContainer />
      </div>
    </>
  );
};

export default Contact;
