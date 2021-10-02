const User = require('../models/User')

const JWT = require('jsonwebtoken')

const encodedToken = (userID) => {
    return JWT.sign({
        iss: 'Pi',
        sub: userID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() * 3)
    }, process.env.ACCESS_TOKEN_SECRET)
}

const authGoogle = async (req, res, next) => {
    const token = encodedToken(req.user._id)

    res.setHeader('Authorization', token)
    
    return res.status(200).json({ access: true })
}

const authFacebook = async (req, res, next) => {
    const token = encodedToken(req.user._id)

    res.setHeader('Authorization', token)
    
    return res.status(200).json({ access: true })
}

const getUser = async (req, res, next) => {
    const { userID } = req.value.params

    const user = await User.findById(userID)

    return res.status(200).json(user)
}

const index = async (req, res, next) => {
    const users = await User.find({})

    return res.status(200).json(users)
}

const newUser = async (req, res, next) => {
    const newUser = new User(req.body)

    await newUser.save()

    return res.status(201).json({ user: newUser })
}

const replaceUser = async (req, res, next) => {
    const { userID } = req.params

    const newUser = req.body

    const result = await user.findByIdAndUpdate(userID, newUser)

    return res.status(200).json({ success: true })
}

const secret = async (req, res, next) => {
    return res.status(200).json({ resources: true })
}

const signin = async (req, res, next) => {
    try {
        const token = encodedToken(req.user._id)

        const user = await User.findById(req.user._id)

        const info = {
            name: user.name,
            typeAccount: user.typeAccount,
            token: token
        }

        res.setHeader('Authorization', token)

        return res.status(200).json({ access: true, info: info })
    } catch (error) {
        return res.status(400).json({ access: false })
    }
}

const signup = async (req, res, next) => {
    const { name, email, password } = req.value.body

    // check if there is a user with the same user
    const foundUser = await User.findOne({ email: email })
    if (foundUser)
        return res.status(403).json({ error: { message: 'Email is already in use.' } })

    const newUser = new User({ name, email, password })

    newUser.save()

    // Encode a token
    const token = encodedToken(newUser._id)

    res.setHeader('Authorization', token)

    return res.status(200).json({ success: true })
}

const updateUser = async (req, res, next) => {
    const { userID } = req.params

    const newUser = req.body

    await user.findByIdAndUpdate(userID, newUser)

    return res.status(200).json({ success: true })
}


module.exports = {
    authGoogle,
    authFacebook,
    getUser,
    index,
    newUser,
    replaceUser,
    secret,
    signin,
    signup,
    updateUser
}
