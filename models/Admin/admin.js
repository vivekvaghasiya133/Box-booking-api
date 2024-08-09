var mongoose = require('mongoose')

var adminSchema = new mongoose.Schema({
    adminName : {
        type : String,
        required : [true, 'Admin name is required']
    },
    email : {
        type : String,  
        required : [true , 'Email is required'],
        unique  : true
    },
    password : {
        type : String,
        required : [true, 'Password is required'],
        // max : [20 , "Password lenght is to long"]
    }
})


module.exports = mongoose.model('Admin' , adminSchema)
