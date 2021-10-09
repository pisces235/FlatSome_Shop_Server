const mongoose = require('mongoose')
const { isEmail } = require('validator')

const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10;

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
    phoneNumber: {
        type: String,
    }
}, { timestamps: true })

UserSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
  });

UserSchema.methods.isValidPassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
  };


module.exports = User = mongoose.model('User', UserSchema)
