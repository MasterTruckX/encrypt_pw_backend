const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Pw = require('../models/pwsModel')
const User = require('../models/usersModel')

const getAllPws = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user.id)
    if(user){
        try{
            const pws = await Pw.find( { user_id: req.user.id})
            res.status(200).json(pws)
        }catch {
            res.status(404)
            throw new Error('This user does not have any registered dates.')
        }
    }else{
        res.status(404)
        throw new Error('This user does not exist.')
    }
})

const getPwById = asyncHandler(async(req,res) => {
    const pws = await Pw.findById(req.params.id)
    res.status(200).json(pws)
})

const setPw = asyncHandler(async(req,res) => {
    if(!req.body.company || !req.body.username || !req.body.password){
        res.status(400)
        throw new Error('Please fulfill all the mandatory fields.')
    }
    // generate hash
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const pw = await Pw.create({
        user_id: req.user.id,
        company: req.body.company,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    if(pw.username !== req.body.username){
        res.status(500).json({message: 'There was an error. PW was nos created.'})
    }else{
        res.status(201).json(pw)
    }
})

const updatePw = asyncHandler(async(req,res) => {
    if(!req.body.company || !req.body.username || !req.body.password){
        res.status(400)
        throw new Error('Please fulfill all the mandatory fields.')
    }

    const pw = await Pw.findById(req.params.id)
    if(!pw){
        res.status(404)
        throw new Error('PW not found.')
    }

    const updatePw = await Pw.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(updatePw.username !== req.body.username){
        res.status(500).json({message: 'There was an error. PW was nos created.'})
    }else{
        res.status(201).json(updatePw)
    }
})

const deletePw = asyncHandler(async(req,res) => {
    const pw = await Pw.findById(req.params.id)
    if(!pw){
        res.status(404)
        throw new Error('PW not found.')
    }else {
        pw.deleteOne()
        res.status(200).json({id: pw._id})
    }
})

module.exports = {
    getAllPws,
    getPwById,
    setPw,
    updatePw,
    deletePw
}