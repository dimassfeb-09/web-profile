import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      
      <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />}>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
