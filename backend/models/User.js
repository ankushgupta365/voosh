const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name: {type: String, required: true},
    phone_number: {type: String, required: true, unique: true},
    password: {type: String},
    isAdmin: { type: Boolean, default: false },
    verified: {type: Boolean, default: false},
    verifiedToChangePass: {type: Boolean, default: false}
},{ timestamps: true })

// midlleware before saving
UserSchema.pre('save', async function () {
    //generating random bytes 
    const salt = await bcrypt.genSalt(10)
    //referencing the password from the above schema and hashing it using bcrypt library
    this.password = await bcrypt.hash(this.password, salt)
})

//midlleware before updating
UserSchema.pre('findOneAndUpdate', async function () {
    //generating random bytes 
    if(this.password){
        const salt = await bcrypt.genSalt(10)
    //referencing the password from the above schema and hashing it using bcrypt library
    this.password = await bcrypt.hash(this.password, salt)
    }
})

//instance method, here this keyword signifies the instance of the calling object
UserSchema.methods.comparePassword = async function (secondpartypassword) {
    const isMatch = await bcrypt.compare(secondpartypassword, this.password)
    return isMatch
}

module.exports = mongoose.model("User", UserSchema)