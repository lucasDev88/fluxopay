import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./navigation/home";
import "../style/App.css";
import Login from "./navigation/login";
import SignUp from "./navigation/SignUp";
import UserDashboard from "./navigation/subnavigation/dashboard/Main";
import ProtectedRoute from "../_services/tsxServices/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard/>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
