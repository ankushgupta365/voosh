import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Form, Alert, Container } from "react-bootstrap";
import { AuthContext } from "../context/AuthContex";
import { publicRequest } from "../../requestMethods";
import Swal from "sweetalert2";

const NewPassword = () => {
  const {phone_number} = useParams()
  const confirmPasswordRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate()
  const {loading,error,dispatch} = useContext(AuthContext)
  const [confirmPasswordNotMatched,setConfirmPasswordNotMatchedError]= useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(passwordRef.current.value !== confirmPasswordRef.current.value){
      setConfirmPasswordNotMatchedError(true)
      return
    }
    try {
      console.log("this running")
        const res = await publicRequest.post("/auth/update-password", { password: passwordRef.current.value,phone_number});
        if(res?.status==201){
          Swal.fire(
            'Password Updated!',
            'Your password is securely changed, now login',
            'success'
          )
        }
        navigate("/login")
    } catch (err) {
        console.log(res)
    }
}
console.log(phone_number)
  return (
        <>
          <Card className="w-100" style={{ margin: 'auto', maxWidth: '400px' }}>
            <Card.Body>
              <h2 className="text-center mb-4">New Password</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {confirmPasswordNotMatched && <Alert variant="danger">confirm password is different</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Form.Group id="confirmPassword">
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control type="password" ref={confirmPasswordRef} required />
                </Form.Group>

                <Button disabled={loading} type="submit" className="w-100 mt-3">
                  Create
                </Button>
              </Form>
              <div className="w-100 text-center mt-3 d-flex justify-content-around">
                <Link to="/login">login</Link>
                <Link to="/register">register</Link>
              </div>
            </Card.Body>
          </Card>
    </>
  )
}

export default NewPassword