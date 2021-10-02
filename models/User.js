const mongoose = require('mongoose')
const { isEmail } = require('validator')

const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: isEmail,
    },
    password: {
        type: String,
        minLength: 8,
    },
    authGoogleID: { 
        type:String,
        default: null,
    },
    authFacebookID: { 
        type:String,
        default: null,
    },
    authType: { 
        type:String, 
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    typeAccount: { type: String, default: 'customer' },
    address: Array,
    orders: Array,
}, { timestamps: true })

UserSchema.pre('save', async function(next) {
    try {
        if(this.authType != 'local') next()
        // generate a salt
        const salt = await bcrypt.genSalt(10)
        // generate a password hash (salt + hash)
        const hashPassword = await bcrypt.hash(this.password, salt)
        // Re-assign password hashed
        this.password = hashPassword

        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password)
    } catch (error) {
        throw new Error(error)
    }
}


module.exports = User = mongoose.model('User', UserSchema)
