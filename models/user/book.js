var mongoose = require('mongoose')

var bookInfo = new mongoose.Schema({
    boxid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Box'
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    time:[{
        type:String
    }],
    date : 
    {
        type : String
    }
})

module.exports = mongoose.model('Book', bookInfo)