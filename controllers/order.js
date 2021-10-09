const Order = require('../models/Order')
const User = require('../models/User')

// [DELETE]
const deleteOrder = async (req, res, next) => {
    Order.deleteOne({ slug: req.params.slug })
        .then(() => {
            res.status(200).json({ success: true })
        }).catch((error) => {
            return res.status(400).json({ error: error })
        })
}
// [DELETE]
const deletedOrders = async (req, res, next) => {
    try {
        const orders = await Order.findDeleted()

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(400).json({ error: error })
    }
}
// [GET]
const getOrder = async (req, res, next) => {
    const { slug } = req.params

    const order = await Order.findOne({ slug: slug })

    return res.status(200).json(order)
}
// [GET]
const index = async (req, res, next) => {
    const orders = await Order.find({})

    return res.status(200).json(orders)
}
// [POST]
const newOrder = async (req, res, next) => {
    try {
        const newOrder = new Order(req.body)
        console.log(newOrder)

        let user = await User.findOne({ email: newOrder.email })
        let count = 0

        if (user) {
            user.address.forEach((a) => {
                if(a !== newOrder.address) {
                    count++;
                }
            })
            if(count == user.address.length) {
                user.address = [];
                user.address.push({
                    ...newOrder.address,
                    phoneNumber: newOrder.phoneNumber,
                    name: newOrder.name
                })
            }
            user.orders.push(newOrder)
            user.phoneNumber = newOrder.phoneNumber

            user.save()
        }

        await newOrder.save()

        return res.status(201).json({ order: newOrder })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error })
    }
}
// [GET]
const newOrders = async (req, res, next) => {
    try {
        let orders = await Order.find({})

        const newOrders = orders.reverse()

        return res.status(200).json(newOrders)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error })
    }
}
// [DELETE]
const trashOrder = async (req, res, next) => {
    Order.delete({ slug: req.params.slug })
        .then(() => {
            res.status(200).json({ success: true })
        }).catch((error) => {
            return res.status(400).json({ error: error })
        })
}
// [PATCH]
const restoreOrder = async (req, res, next) => {
    Order.restore({ slug: req.params.slug })
        .then(() => {
            res.status(200).json({ success: true })
        }).catch((error) => {
            return res.status(400).json({ error: error })
        })
}
// [PUT]
const updateOrder = async (req, res, next) => {
    const { slug } = req.params

    let newOrder = req.body


    s = newOrder.categories.toString().split(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/ ]/gi)
    var filtered = s.filter(function (el) {
        return el != "";
    });
    Order.updateOne({ slug: slug }, {
        ...newOrder,
        categories: filtered
    }).then(() => {
        return res.status(200).json({ success: true })
    }).catch((error) => {
        return res.status(400).json({ error: error })
    })
}

module.exports = {
    deleteOrder,
    deletedOrders,
    getOrder,
    index,
    newOrder,
    newOrders,
    trashOrder,
    updateOrder,
    restoreOrder,
}

