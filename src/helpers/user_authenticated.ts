import {Auth, getAuth} from "@firebase/auth";
import app from "../db/Firebase.ts";

const isUserAuthenticated = (): boolean => {
    const auth: Auth = getAuth(app);
    return auth.currentUser != null;
};

export default isUserAuthenticated;