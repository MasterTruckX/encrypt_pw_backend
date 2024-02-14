const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const { errorHandler } = require('./middleware/errorMiddleware')


const app = express()

app.use(errorHandler)
app.listen(port, () => console.log(`Server started on port ${port}`))