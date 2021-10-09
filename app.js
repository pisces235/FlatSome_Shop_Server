require('dotenv').config()
const cors = require('cors')
const express = require('express')
const logger = require('morgan')
const db = require('./config/database')

// Connect to DB
db.connect();

const app = express()

const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const orderRoute = require('./routes/order')

// Middlewares
app.use(cors())
app.use(logger('dev'))
app.use(express.json())

// Routes
app.use('/orders', orderRoute)
app.use('/products', productRoute)
app.use('/users', userRoute)

// Catch 404 Errors and forward them to error handlers
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    // response to client
    res.status(status).json({
        error: {
            message: error.message
        }
    })
})

//Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`))