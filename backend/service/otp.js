
const accountSid = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const createVerifyService = (serviceName) => {
    //service name should be less then 30 characters and unique

    client.verify.v2.services
        .create({ friendlyName: `${serviceName}` })
        .then(service => console.log(service.sid));
}


const sendOtp = async (phone_number) => {
    // sending verification code to the user
    client.verify.v2.services(process.env.TWILIO_VOOSH_VERIFY_SERVICE_SID)
        .verifications
        .create({ to: `${phone_number}`, channel: 'sms' })
        .then(verification => console.log(verification.status)).catch(error => console.log(error));
}

const verifyOtp = async (phone_number,otp) => {
    //checking verification code from the user
//    client.verify.v2.services(process.env.TWILIO_VOOSH_VERIFY_SERVICE_SID)
//         .verificationChecks
//         .create({ to: `${phone_number}`, code: `${otp}` })
//         .then(verification_check =>  console.log(verification_check.status)).catch(error=>console.log(error));

const verification = await client.verify.v2.services(process.env.TWILIO_VOOSH_VERIFY_SERVICE_SID).verificationChecks.create({to: `${phone_number}`, code: `${otp}`})
console.log(verification.status)
return verification.status
}


module.exports = {
    sendOtp,
    verifyOtp,
    createVerifyService
}


//react-phone-number-input
//react-verification-code-input
