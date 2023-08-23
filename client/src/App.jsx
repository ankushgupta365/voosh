import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Container } from "react-bootstrap";
import ForgotPassword from "./pages/ForgetPass";
import VerifyOtp from "./pages/VerifyOtp";
import NewPassword from "./pages/NewPassword";
import VerifyUser from "./pages/VerifyUser";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContex";

function App() {
  const {user} = useContext(AuthContext)
  return (
    <>
    <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "800px" }}>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={user?<Home />: <Navigate to="/login"/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp/:phone_number" element={<VerifyOtp />} />
              <Route path="/new-password/:phone_number" element={<NewPassword />} />
              <Route path="/verify-user/:phone_number" element={<VerifyUser />} />
            </Routes>
          </BrowserRouter>
        </div>
        </Container>
    </>
  );
}

export default App;
