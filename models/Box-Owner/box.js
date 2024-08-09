var mongoose = require('mongoose')


const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: [true , "Street is required"]
    },
    area: {
        type: String,
        required: [true , "area is required"]
    },
    city: {
        type: String,
        required: [true , "city is required"]
    },
    state: {
        type: String,
        required: [true , "state is required"]
    },
    pinCode: {
        type: String,
        required: [true , "pinCode is required"]
    },
    country: {
        type: String,
        required: [true , "country is required"]
    }
}, { _id: false });

const Shift = new mongoose.Schema({
    morning: { 
        '8:00AM - 9:00AM': { type: Boolean, default: true },
        '9:00AM - 10:00AM': { type: Boolean, default: true },
        '10:00AM - 11:00AM': { type: Boolean, default: true },
        '11:00AM - 12:00PM': { type: Boolean, default: true },
        '12:00PM - 1:00PM': { type: Boolean, default: true },
        '1:00PM - 2:00PM': { type: Boolean, default: true },
        '2:00PM - 3:00PM': { type: Boolean, default: true },
        '3:00PM - 4:00PM': { type: Boolean, default: true },
        '4:00PM - 5:00PM': { type: Boolean, default: true },
        '5:00PM - 6:00PM': { type: Boolean, default: true },
        '6:00PM - 7:00PM': { type: Boolean, default: true },
        '7:00PM - 8:00PM': { type: Boolean, default: true },
        morningPrice: { type: Number, required: true }
    },  
    night: {
        '8:00PM - 9:00PM': { type: Boolean, default: true },
        '9:00PM - 10:00PM': { type: Boolean, default: true },
        '10:00PM - 11:00PM': { type: Boolean, default: true },
        '11:00PM - 12:00AM': { type: Boolean, default: true },
        '12:00AM - 1:00AM': { type: Boolean, default: true },
        '1:00AM - 2:00AM': { type: Boolean, default: true },
        '2:00AM - 3:00AM': { type: Boolean, default: true },
        '3:00AM - 4:00AM': { type: Boolean, default: true },
        '4:00AM - 5:00AM': { type: Boolean, default: true },
        '5:00AM - 6:00AM': { type: Boolean, default: true },
        '6:00AM - 7:00AM': { type: Boolean, default: true },
        '7:00AM - 8:00AM': { type: Boolean, default: true },
        nightPrice: { type: Number, required: true }
    }
}, { _id: false });



var boxSchema = new mongoose.Schema({

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
    },
    boxName: {
        type: String,
        required: [true , "boxName is required"]
    },
    images: [
        {
            type: String,
            required: [true , "images is required"]
        }
    ],
    contact : {
        type : Number,
        required : [true , "contact is required"]
    },
    address: addressSchema,
    opning: Shift,
    status: {
        type: String,
        enum: ['Pending', 'approved', 'block'],
        default: 'Pending'
    },

}, { timestamps: true })


module.exports = mongoose.model('Box', boxSchema)