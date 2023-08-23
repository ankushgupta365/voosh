import React , {useRef, useState} from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'

import { Link, useNavigate } from 'react-router-dom';
import { publicRequest } from '../../requestMethods';


const ForgotPassword = ()=> {
    const phoneRef = useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setMessage("")
            setError("");
            setLoading(true);
            // await resetPassword(emailRef.current.value);
            setMessage("password reset instruction sent to your email")
            // console.log( emailRef.current.value, passwordRef.current.value )
            // history.push('/');
        } catch{
            setError('failed to reset password')
        }
        setLoading(false);
    }
    const handleSendOtp = async()=>{
        try {
            setLoading(true)
            const res = await publicRequest.post("/auth/resend", {phone_number: phoneRef.current.value})
            navigate(`/verify-otp/${phoneRef.current.value}`)
        } catch (error) {
            setError("there is some error")
        }
        setLoading(false)
    }

    return (
        <>
        <Card className="w-100" style={{ margin: 'auto', maxWidth: '400px' }}>
            <Card.Body>
                <h2 className="text-center mb-4">Password Reset</h2>
                <span className='text-danger text-sm' style={{fontSize: '10px'}}>*Enter with country code, eg: +917042469676</span>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form>
                    <Form.Group id="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="text" ref={phoneRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100 mt-3" onClick={handleSendOtp}>
                        Send OTP
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3" >
                    <Link to="/login">Login</Link>
                </div>
            </Card.Body>
        </Card>

        <div className="w-100 text-center mt-2">
            Need an account ? <Link to="/register">Register</Link>
        </div>


        </>
    )
}

export default ForgotPassword;
