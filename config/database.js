const mongoose = require('mongoose')
// parse env variables
require('dotenv').config()

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true
        })
        console.log('Connect sucessfuly!')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = { connect }