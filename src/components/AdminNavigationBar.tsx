import {Logout, Person} from "@mui/icons-material";
import {Auth, getAuth, signOut, User} from "@firebase/auth";
import app from "../db/Firebase.ts";
import {useNavigate} from "react-router-dom";
import toastNotify from "../commons/Toast.tsx";

interface AdminNavBarProps {
    currentUser?: User
}

const AdminNavigationBar = (props: AdminNavBarProps) => {

    const {currentUser} = props;
    const auth: Auth = getAuth(app);
    const navigate = useNavigate();

    const handleSubmitLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/login');
        } catch (e) {
            toastNotify({type: "error", message: `Gagal keluar. ${e}`});
        }
    }

    return (
        <nav
            className="fixed w-full flex justify-between px-5 sm:px-20 text-white items-center bg-gradient-to-r from-blue-500 to-blue-600 h-[70px]">
            <div className="sm:text-lg">Admin Menu</div>
            <div className="flex items-center gap-3">
                <div>{currentUser?.email}</div>
                <div className="h-8 w-8 bg-white flex justify-center items-center text-black rounded-full">
                    <Person></Person>
                </div>
                <div className="flex gap-2">
                    |
                    <button onClick={handleSubmitLogout}>Logout <Logout/></button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavigationBar;