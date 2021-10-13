const express = require('express')
// const router = express.Router()
const router = require("express-promise-router")()

const ProductController = require('../controllers/product')

router.route('/')
    .get(ProductController.index)
    .post(ProductController.newProduct)
router.route('/deletedProducts')
    .get(ProductController.deletedProducts)
    
router.route('/newproducts')
    .get(ProductController.newProducts)

router.route('/:slug')
    .get(ProductController.getProduct)
    .put(ProductController.updateProduct)
    .patch(ProductController.restoreProduct)
    .delete(ProductController.trashProduct)
router.route('/:slug/force')
    .delete(ProductController.deleteProduct)
router.route('/:slug/addreview')
    .patch(ProductController.addReview)

module.exports = router
