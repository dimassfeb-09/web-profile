import {Person} from "@mui/icons-material";
import {User} from "@firebase/auth";

interface AdminNavBarProps {
    currentUser?: User
}

const AdminNavigationBar = (props: AdminNavBarProps) => {

    const {currentUser} = props;

    return (
        <nav
            className="fixed w-full flex justify-between px-5 sm:px-20 text-white items-center bg-gradient-to-r from-blue-500 to-blue-600 h-[70px]">
            <div className="sm:text-lg">Admin Menu</div>
            <div className="flex items-center gap-3">
                <div>{currentUser?.email}</div>
                <div className="h-8 w-8 bg-white flex justify-center items-center text-black rounded-full">
                    <Person></Person>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavigationBar;