import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./public/home";
import "../style/App.css";
import Login from "./public/out/login";
import SignUp from "./public/out/SignUp";
import UserDashboard from "./private/dashboard/Main";
import ProtectedRoute from "../_services/tsxServices/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
