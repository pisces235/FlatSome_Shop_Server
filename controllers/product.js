const Product = require('../models/Product')

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
//[PUT]
const removeQuantity = async (req, res, next) => {
    const cart = req.body

    const products = await Product.find({})
    
    products.forEach((p) => {
        cart.forEach((c) => {
            if(c.product.slug == p.slug) {
                p.stock -= c.quantity
                p.save()
            }
        })
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

    
    s = newProduct.categories.toString().split(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/ ]/gi)
    var filtered = s.filter(function (el) {
        return el != "";
      });
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
    deleteProduct,
    deletedProducts,
    getProduct,
    index,
    newProduct,
    newProducts,
    trashProduct,
    removeQuantity,
    restoreProduct,
    updateProduct,
}