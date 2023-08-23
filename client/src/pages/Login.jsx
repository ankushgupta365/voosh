import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Form, Alert, Container } from "react-bootstrap";
import { AuthContext } from "../context/AuthContex";
import { publicRequest } from "../../requestMethods";

const Login = () => {
  const phoneRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate()
  const {loading,error,dispatch} = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: "LOGIN_START" });
    try {
      console.log("this running")
        const res = await publicRequest.post("/auth/login", { phone_number: phoneRef.current.value, password: passwordRef.current.value });
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        if(res.data.verified == true){
          navigate("/")
        }else{
          navigate("/verify-user")
        }
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
}


  return (
    <>
          <Card className="w-100" style={{ margin: 'auto', maxWidth: '400px' }}>
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" ref={phoneRef} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>

                <Button disabled={loading} type="submit" className="w-100 mt-3">
                  Login
                </Button>
              </Form>
              <div className="w-100 text-center mt-3 d-flex justify-content-around">
                <Link to="/forgot-password">forgot password?</Link>
                <Link to="/register">register</Link>
              </div>
            </Card.Body>
          </Card>
    </>
  );
};

export default Login;
