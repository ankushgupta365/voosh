const   mongoose  = require("mongoose");

const OrderSchema = mongoose.Schema({
    user_id: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    sub_total: {type: Number, required: true},
    phone_number: {type: String, required: true}
},{ timestamps: true })

module.exports = mongoose.model("Order", OrderSchema)