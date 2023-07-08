import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const toastNotify = (type, message) => {
  if (type === "success") {
    toast.success(message, {
      position: "bottom-center",
      autoClose: 4983,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 4983,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

export default toastNotify;
