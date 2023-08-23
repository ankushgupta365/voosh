const { addOrder, getOrdersOfUser, deleteOrder } = require('../controllers/ordersController')
const { verifyToken } = require('../middleware/verifyToken')

const router = require('express').Router()

router.route("/add-order").post(verifyToken,addOrder)
router.route("/get-orders/:user_id").get(verifyToken,getOrdersOfUser)
router.route("/delete-order/:order_id").delete(verifyToken,deleteOrder)


module.exports  = router