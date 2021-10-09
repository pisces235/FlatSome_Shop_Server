const express = require('express')
// const router = express.Router()
const router = require("express-promise-router")()

const OrderController = require('../controllers/order')

router.route('/')
    .get(OrderController.index)
    .post(OrderController.newOrder)

router.route('/:slug')
    .get(OrderController.getOrder)
    .put(OrderController.updateOrder)
    .patch(OrderController.restoreOrder)
    .delete(OrderController.trashOrder)
router.route('/:slug/force')
    .delete(OrderController.deleteOrder)

module.exports = router
