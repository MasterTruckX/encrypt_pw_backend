const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const registerUser = asyncHandler(
    async(req, res) => {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            res.status(400)
            throw new Error('Please fulfill all the fields')
        }
        // verify user existance
        const userExists = await User.findOne({email})
        if (userExists) {
            res.status(400)
            throw new Error('That user already exists')
        }

        // generate hash
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create user in the db
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email
            })
        }else {
            res.status(404)
            throw new Error('User was not created. Please check the data submitted')
        }

        res.json({ message: 'Create user' })
    }
) 

const loginUser = asyncHandler(
    async(req, res) => {
        const { email, password } = req.body

        // Verify email & pw
        const user = await User.findOne({email})
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else {
            res.status(400)
            throw new Error('Wrong Password')
        }
   }
)


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
}

const getUserData = asyncHandler(
    async(req, res) => {
        res.json(req.user)
    }
) 

module.exports = {
    registerUser,
    loginUser,
    getUserData
}