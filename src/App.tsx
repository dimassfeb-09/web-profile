import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
    </Routes>
  );
}

export default App;
