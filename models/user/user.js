var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : [true, 'user name is required']
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
    },
    contact : {
        type : String,
        required : [true,"contact no is required"]
    }
})


module.exports = mongoose.model('User' , userSchema)
