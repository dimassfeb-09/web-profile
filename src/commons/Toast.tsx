import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";

type paramToast = {
    type: string,
    message: string,
}

const toastNotify = (paramToast: paramToast) => {
    if (paramToast.type === "success") {
        toast.success(paramToast.message, {
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
        toast.error(paramToast.message, {
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