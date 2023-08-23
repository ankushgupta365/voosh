import React , { useRef, useState } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { publicRequest } from '../../requestMethods';

const Register = () => {
  const phoneRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef =useRef();
  const nameRef = useRef()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

const navigate = useNavigate()
  // console.log(emailRef);

  async function handleSubmit(e){
      e.preventDefault()

      if(passwordRef.current.value !== passwordConfirmRef.current.value){
          return setError('passwords do not match')
      }
      try{
          setError("");
          setLoading(true);
          const res = await publicRequest.post("/auth/register", {name: nameRef.current.value, phone_number: phoneRef.current.value, password: passwordRef.current.value})
          if(res.status == 201){
            navigate(`/verify-user/${phoneRef.current.value}`)
          }
      } catch{
          setError('failed to create an account')
      }
      setLoading(false);
  }
  return (
    <>

        <Card className="w-100" style={{ margin: 'auto', maxWidth: '400px' }}>
            <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                <Form.Group id="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} required />
                    </Form.Group> 
                    <Form.Group id="phone">
                        <Form.Label>Phone<span className='text-danger' style={{fontSize: '10px', marginLeft: '10px'}}>*Full and valid no. with country code, eg: +917042469676</span></Form.Label>
                        <Form.Control type="text" ref={phoneRef} required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Form.Group id="password-confirm">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>
                    
                    <Button disabled={loading} type="submit" className="w-100 mt-3">
                        Sign Up
                    </Button>
                </Form>
            </Card.Body>
        </Card>

        <div className="w-100 text-center mt-2">
            Already have an account ? <Link to="/login">Log In</Link>
        </div>


        </>
  )
}

export default Register