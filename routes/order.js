const express = require('express')
// const router = express.Router()
const router = require("express-promise-router")()

const OrderController = require('../controllers/order')

router.route('/')
    .get(OrderController.index)
    .post(OrderController.newOrder)

router.route('/delete/:id/:email')
    .delete(OrderController.deleteOrder)
router.route('/:id/confirm-order')
    .patch(OrderController.confirmOrder)
router.route('/:id/confirm-payment')
    .patch(OrderController.confirmPayment)

module.exports = router
