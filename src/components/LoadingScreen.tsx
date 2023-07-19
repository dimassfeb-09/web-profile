import {ClipLoader} from "react-spinners";

const LoadingScreen = () => {
    return (
        <div className="flex h-screen w-full justify-center items-center">
            <ClipLoader color="#2e6bed"/>
        </div>
    );
};

export default LoadingScreen;