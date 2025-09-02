import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";

export default function App(){
  return (
  <div>
    <Routes>
      <Route path="/" element={<Navigate to="/homepage" replace />} />
      <Route path="/register" element={<Register />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/homepage" element={<Homepage />}></Route>

    </Routes>
  </div>);
}