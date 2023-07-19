import AdminNavigationBar from "../components/AdminNavigationBar.tsx";
import {Auth, getAuth, User} from "@firebase/auth";
import app from "../db/Firebase.ts";
import {useEffect, useState} from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";
import BerandaSetting from "./BerandaSetting.tsx";
import PortfolioSetting from "./PortfolioSetting.tsx";
import {useNavigate} from "react-router-dom";

enum CurrentPageAdmin {
    Beranda = 'beranda',
    Portfolio = 'portfolio',
    About = 'about',
    ContactMessage = 'contactMessage',
}

const AdminHome = () => {

    const auth: Auth = getAuth(app);
    const [currentUser, setCurrentUser] = useState<User>();
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [currentPage, setCurrentPage] = useState<CurrentPageAdmin>();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.currentUser != null) {
            setCurrentUser(auth.currentUser);
        }

        setTimeout(() => {
            setIsLoadingPage(false);
        }, 1000);
    }, [currentUser, isLoadingPage]);

    if (isLoadingPage) {
        return LoadingScreen();
    }

    if (currentUser == null) {
        navigate('/admin/login');
        return;
    }

    const current = () => {
        switch (currentPage) {
            case CurrentPageAdmin.Beranda:
                return <BerandaSetting/>;
            case CurrentPageAdmin.Portfolio:
                return <PortfolioSetting/>;
            case CurrentPageAdmin.About:
                return <div></div>;
            case CurrentPageAdmin.ContactMessage:
                return <div></div>;
            default:
                return <div></div>;
        }
    }


    return (
        <>
            <AdminNavigationBar currentUser={currentUser}/>
            <div className="flex">
                <div className="hidden sm:flex sm:flex-col sm:w-[20%] pt-28 sm:mx-5 sm:gap-5">
                    <div
                        className={`hover:bg-black hover:text-white border p-3 rounded-md ${currentPage == CurrentPageAdmin.Beranda ? 'bg-black text-white' : 'bg-white text-black'}`}
                        onClick={() => setCurrentPage(CurrentPageAdmin.Beranda)}>
                        Beranda
                    </div>
                    <div
                        className={`hover:bg-black hover:text-white border p-3 rounded-md ${currentPage == CurrentPageAdmin.Portfolio ? 'bg-black text-white' : 'bg-white text-black'}`}
                        onClick={() => setCurrentPage(CurrentPageAdmin.Portfolio)}>
                        Portfolio
                    </div>
                    <div
                        className={`hover:bg-black hover:text-white border p-3 rounded-md ${currentPage == CurrentPageAdmin.About ? 'bg-black text-white' : 'bg-white text-black'}`}
                        onClick={() => setCurrentPage(CurrentPageAdmin.About)}>
                        About
                    </div>
                    <div
                        className={`hover:bg-black hover:text-white border p-3 rounded-md ${currentPage == CurrentPageAdmin.ContactMessage ? 'bg-black text-white' : 'bg-white text-black'}`}
                        onClick={() => setCurrentPage(CurrentPageAdmin.ContactMessage)}>
                        Contact Message
                    </div>
                </div>
                {
                    current()
                }
            </div>
        </>
    );
};

export default AdminHome;