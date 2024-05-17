import { useNavigate } from "react-router-dom";
import { Supabase } from "../db/Supabase";
import toastNotify from "../commons/Toast";
import { ToastContainer } from "react-toastify";

export default function LoginChat() {
  const navigate = useNavigate();
  const supabases = Supabase();

  async function signInWithGithub() {
    const { error } = await supabases.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      toastNotify({ message: error.message, type: "error" });
    }

    setTimeout(() => {
      toastNotify({ message: "Success Login", type: "success" });
    }, 500);
    navigate("/chat");
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen w-full bg-secondary">
        <div className="flex flex-col gap-10 bg-white rounded-lg w-[90%] p-5 sm:w-[40%]">
          <div
            className="text-6xl font-bold text-center"
            onClick={signInWithGithub}
          >
            Masuk
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
