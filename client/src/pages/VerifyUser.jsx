import React, { useState } from 'react'
import OtpInput from 'react-otp-input';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { publicRequest, userRequest } from '../../requestMethods';
import Swal from 'sweetalert2'
const VerifyUser = () => {
  const [otp, setOtp] = useState('');
  const {phone_number} = useParams()
  const navigate = useNavigate()
  const handleChange = (code)=>{
    setOtp(code)
  }
  console.log(otp)
  console.log(phone_number)
  const handleVerify = async()=>{
    try {
      const res = await publicRequest.post("/auth/verify", {phone_number, otp})
    if(res.data.msg == "otp is approved"){
      //success
      Swal.fire(
        'Good job!',
        'You are now verified!',
        'success'
      )
      navigate("/login")
    }else{
      //otp not valid or expired resend again
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong, otp not valid or expired!',
      })
    }
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something fishyyy',
      })
    }
  }
  const handleResendOTP = async()=>{
    try {
      const res = await publicRequest.post("/auth/resend", {phone_number})
      Swal.fire(
        'OTP resent successfull!',
        'Please wait for a while if not received!',
        'success'
      )
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
      <div>
      <h4 className="text-center mb-4">You are not verified!</h4>
      <p className="text-center mb-3">{`Enter OTP received on registered mobile number: ${phone_number}`}</p>
      </div>
      <div className='card d-flex justify-content-center align-items-center' style={{width: '500px', height: '200px', backgroundColor: "#f3f3f3"}}>
      <OtpInput
      value={otp}
      onChange={setOtp}
      numInputs={6}
      separator={<span style={{ width: "8px" }}></span>}
        isInputNum={true}
        shouldAutoFocus={true}
        inputStyle={{
          border: "1px solid transparent",
          borderRadius: "8px",
          width: "54px",
          height: "54px",
          fontSize: "24px",
          color: "#000",
          fontWeight: "400",
          caretColor: "black",
          margin: "4px",
        }}
        focusStyle={{
          border: "1px solid #CFD3DB",
          outline: "none"
        }}
      renderInput={(props) => <input {...props} />}
    />
    <button className='btn btn-primary btn-block w-50 mt-3' disabled={otp.length >= 6? false:true} onClick={()=>handleVerify()}>Verify</button>
      </div>
      <div>
        <span className='text-danger'>*expires in 10 minutes</span>
        <button className='btn btn-primary btn-sm m-4' onClick={()=>handleResendOTP()}>Resent OTP!</button>
      </div>
      <div className="w-75 text-center d-flex justify-content-around">
                <Link to="/login">login</Link>
                <Link to="/register">register</Link>
              </div>
    </div>
  )
}

export default VerifyUser