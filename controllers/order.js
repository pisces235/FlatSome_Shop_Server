const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')

//[DELETE]
const deleteOrder = async (req, res, next) => {
    const { id, email } = req.params
    let user = await User.findOne({ email: email })
    let order = await Order.findById(id)
    order.cart.forEach(async (cart) => {
        let product = await Product.findById(cart.product._id)
        product.stock += cart.quantity
        product.sold -= cart.quantity
        product.save()
    })
    for(var i = 0; i < user.orders.length; i++) {
        if(user.orders[i]._id == id) {
            user.orders.splice(i, 1)
        }
    }

    await Order.deleteOne({_id: id})

    return res.status(200).json({success: true})
}

// [PATCH]
const confirmOrder = async (req, res, next) => {
    const { id } = req.params

    let order = await Order.findById(id)
    order.confirm = true

    let user = await User.findOne({email: order.email})

    if(user) {
        for(var i = 0; i < user.orders.length; i++) {
            if(user.orders[i]._id == id) {
                user.orders[i] = order
            }
        }
        await User.updateOne({ email: order.email }, user);
    }
    
    try {
        await order.save()
        return res.status(200).json({success: true})
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error })
    }
}

// [PATCH]
const confirmPayment = async (req, res, next) => {
    const { id } = req.params

    let order = await Order.findById(id)
    let date = new Date()
    let day = date.getDate()
    let indexMonth = date.getMonth()
    let year = date.getFullYear()
    let month = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
    ]
    let paymentDate = day + "/" + month[indexMonth] + "/" + year
    order.confirm = true
    order.payment = true
    order.paymentDate = paymentDate
    console.log(order)

    let user = await User.findOne({email: order.email})

    if(user) {
        for(var i = 0; i < user.orders.length; i++) {
            if(user.orders[i]._id == id) {
                user.orders[i] = order
            }
        }
        await User.updateOne({ email: order.email }, user);
    }
    
    try {
        await order.save()
        return res.status(200).json({success: true})
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error })
    }
}

// [GET]
const index = async (req, res, next) => {
    const orders = await Order.find({})

    return res.status(200).json(orders)
}
// [POST]
const newOrder = async (req, res, next) => {
    let date = new Date()
    let day = date.getDate()
    let indexMonth = date.getMonth()
    let year = date.getFullYear()
    let month = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
    ]
    let createdDate = day + "/" + month[indexMonth] + "/" + year
    try {
        const newOrder = new Order({
            ...req.body,
            createdDate: createdDate
        })
        console.log(newOrder)
        
        newOrder.cart.forEach(async c => {
            let product = await Product.findById(c.product._id)

            product.stock -= c.quantity
            product.sold += c.quantity
            await product.save()
        })

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

module.exports = {
    deleteOrder,
    confirmOrder,
    confirmPayment,
    index,
    newOrder,
}

