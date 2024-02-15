const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const protect = asyncHandler(async(req,res,next)=>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // obtain token
            token = req.headers.authorization.split(' ')[1]
            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //obtain user's id from token
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error){
            console.log(error)
            res.status(401)
            throw new Error('Unauthorized')
        }
    }
    if(!token) {
        res.status(401)
        throw new Error ('Unauthorized. Token was not received')
    }
})


const admin_protect = asyncHandler(async(req,res,next)=>{
    let token
    if(req.user.admin === true){
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            try {
                // obtain token
                token = req.headers.authorization.split(' ')[1]
                //verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                //obtain user's id from token
                req.user = await User.findById(decoded.id).select('-password')
                next()
            } catch (error){
                console.log(error)
                res.status(401)
                throw new Error('Unauthorized')
            }
        }
    }
    if(!token) {
        res.status(401)
        throw new Error ('Unauthorized. Token was not received and no Admin user was found.')
    }
})

module.exports = {protect, admin_protect}