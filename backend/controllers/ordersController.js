const Order = require("../models/Order")

const addOrder = async(req,res)=>{
    try {
        const {user_id, sub_total, phone_number} = req.body
        if(!user_id && !sub_total && !phone_number){
            return res.status(400).json({msg: "bad request"})
        }
       const order = new Order({
        user_id,
        phone_number,
        sub_total
       })
       await order.save()
       res.status(201).json({msg: "order created successfully"})
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const getOrdersOfUser = async (req,res)=>{
    try {
        const user_id = req.params.user_id
        if(!user_id){
            return res.status(500).json({msg: "bad request"})
        }

        const page = req.query.page || 1
        const limit = req.query.limit || 5
        const skip = (page-1)*limit

        const orders = await Order.find({user_id}).skip(skip).limit(limit)
        const totalOrders = await Order.countDocuments({user_id})
        res.status(200).json({orders,totalPages: Math.ceil(totalOrders/limit)})
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const deleteOrder = async(req,res)=>{
    try {
        const order_id = req.params.order_id
        if(!order_id){
            return res.status(500).json({msg: "order id not valid"})
        }
        await Order.findOneAndDelete({
            _id: order_id
        })
        res.status(200).json({msg: "order deleted succesfully"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

module.exports = {
    addOrder,
    getOrdersOfUser,
    deleteOrder
}