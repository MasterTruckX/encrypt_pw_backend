const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const colors = require('colors')
const cors = require('cors')

//connect MongoDB to server with mongoose config
connectDB()

// run server
const app = express()

//Use CORS to locate and use resources out of the browser's domain 
app.use(cors)

//json parser and url encoder for routes and controllers
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//server main routing
app.use('/PWS/users', require('./routes/usersRoutes'))
app.use('/PWS/', require('./routes/pwsRoutes'))

//error handler bottom-top layer
app.use(errorHandler)

//listen if the server is running
app.listen(port, () => console.log(`Server started on port ${port}`))