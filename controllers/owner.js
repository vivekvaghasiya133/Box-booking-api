var mongoose = require('mongoose')
var Owner = require('../models/Box-Owner/owner.js')
var bcrypt = require('bcrypt')
// const { status } = require('express/lib/response.js')
var jwt = require('jsonwebtoken')
const owner = require('../models/Box-Owner/owner.js')
exports.OwnerRegister = async (req, res) => {
    try {
        var { password , email , ownerName , status } = req.body
        password = await bcrypt.hash(password, 12)

        // var OwnerRegister = await Owner.create(req.body)
        var OwnerRegister = new Owner({
            password,
            email,
            ownerName,
            status
        })
        await OwnerRegister.save()
        res.status(200).json({
            status: 'Success',
            message: 'New Owner Add Successfully',
            data : OwnerRegister
        })

    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}
exports.OwnerLogin = async(req, res) => {
    try {
        var token
        var {email , password } = req.body

        // console.log(status);
        var OwnerEmailCheck = await Owner.findOne({email})

        if (!OwnerEmailCheck) {
            throw new Error('Email not Found')
        }

        var passwordCheck = await bcrypt.compare(password , OwnerEmailCheck.password)
        
        if (!passwordCheck) {
            throw new Error('Password does not match')
        }


        token = await jwt.sign(OwnerEmailCheck.id , 'Owner')


        res.status(201).json({
            status: 'Success',
            message: 'Owner Login Successfully',
            token
            
        })

    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.getOwnerDetails = async (req,res) => {
    try{

        var id = await jwt.verify(req.headers.auth, 'Owner')

        if(!id){
            throw new Error("token must be provided")
        }
        var Ownerdata = await Owner.findById(id , {password : 0})

        res.status(200).json({
            status : true,
            data : Ownerdata
        })

    }
    catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.OwnerUpdate = async (req,res) => {
try{
    
    var id = req.params.id

    if(!id){
        throw new Error('Include id in params')
    }

    var { password } = req.body
    req.body.password = await bcrypt.hash(password, 12)

    var OwnerUpdate = await Owner.findByIdAndUpdate(id,req.body)

    res.status(200).json({
        status: 'Success',
        message: 'Owner Data Update Successfully',
        // data : OwnerUpdate
    })
}catch(error){
    res.status(401).json({
        status: 'Failed',
        message: error.message
    })
}
}

exports.OwnerDelete = async(req ,res) => {
    try {
        
        var id = req.params.id
        if(!id){
            throw new Error('Include id in params')
        }

        var DeleteOwner = await Owner.findByIdAndDelete(id)
        res.status(200).json({
            status: 'Success',
            message: 'Owner Delete Successfully',
            // data : DeleteOwner
        })


    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

