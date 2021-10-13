const Product = require('../models/Product')

// [PATCH]
const addReview = async (req, res, next) => {
    const { slug } = req.params

    let newReview = req.body

    let product = await Product.findOne({ slug: slug})
    
    product.reviews.push(newReview)

    console.log(product.reviews)

    product.save()

    res.status(200).json({ success: true })
}

// [DELETE]
const deleteProduct = async (req, res, next) => {
    Product.deleteOne({ slug: req.params.slug })
        .then(() => {
            res.status(200).json({ success: true })
        }).catch((error) => {
            return res.status(400).json({ error: error })
        })
}
// [DELETE]
const deletedProducts = async (req, res, next) => {
    try {
        const products = await Product.findDeleted()

        return res.status(200).json(products)
    } catch (error) {
        return res.status(400).json({ error: error })
    }
}
// [GET]
const getProduct = async (req, res, next) => {
    const { slug } = req.params

    const product = await Product.findOne({ slug: slug })

    return res.status(200).json(product)
}
// [GET]
const index = async (req, res, next) => {
    const products = await Product.find({})

    return res.status(200).json(products)
}
// [POST]
const newProduct = async (req, res, next) => {
    try {
        const newProduct = new Product(req.body)

        console.log(newProduct)

        await newProduct.save()

        return res.status(201).json({ product: newProduct })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error })
    }
}
// [GET]
const newProducts = async (req, res, next) => {
    try {
        let products = await Product.find({})

        const newProducts = products.reverse()

        return res.status(200).json(newProducts)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error })
    }
}
// [DELETE]
const trashProduct = async (req, res, next) => {
    Product.delete({ slug: req.params.slug })
        .then(() => {
            res.status(200).json({ success: true })
        }).catch((error) => {
            return res.status(400).json({ error: error })
        })
}
// [PATCH]
const restoreProduct = async (req, res, next) => {
    Product.restore({ slug: req.params.slug })
        .then(() => {
            res.status(200).json({ success: true })
        }).catch((error) => {
            return res.status(400).json({ error: error })
        })
}
// [PUT]
const updateProduct = async (req, res, next) => {
    const { slug } = req.params

    let newProduct = req.body

    let cs = []

    s = newProduct.categories.toString().split(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/ ]/gi)
    s.forEach(c => {
        var result = c.charAt(0).toUpperCase() + c.slice(1)
        cs.push(result)
    })
    var filtered = cs.filter(function (el) {
        return el != "";
      });
    console.log(filtered)
    Product.updateOne({ slug: slug }, {
        ...newProduct,
        categories: filtered
    }).then(() => {
        return res.status(200).json({ success: true })
    }).catch((error) => {
        return res.status(400).json({ error: error })
    })
}

module.exports = {
    addReview,
    deleteProduct,
    deletedProducts,
    getProduct,
    index,
    newProduct,
    newProducts,
    trashProduct,
    restoreProduct,
    updateProduct,
}