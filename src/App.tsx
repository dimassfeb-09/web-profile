import './App.css'
import {Route, Routes} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import NavigationBar from "./commons/NavigationBar.tsx";
import Contact from "./pages/Contact.tsx";


function App() {
    return (
        <>
            <NavigationBar></NavigationBar>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Routes>
        </>
    )
}

export default App
