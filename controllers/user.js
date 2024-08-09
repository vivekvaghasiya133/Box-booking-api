var User = require('../models/user/user')
var bcrypt = require('bcrypt')
var Box = require('../models/Box-Owner/box')
var Book = require('../models/user/book')
exports.userRegister = async (req, res) => {
    try {
        var { userName, email, password } = req.body
        password = await bcrypt.hash(password, 12)

        var UserData = new User({
            userName,
            password,
            email
        })
        await UserData.save()

        res.status(200).json({
            status: 'Success',
            message: 'User registered Successfully',
            data: UserData
        })

    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.userLogin = async (req, res) => {
    try {

        var token
        var { email, password } = req.body
        var UserEmailCheck = await User.findOne({ email })

        if (!UserEmailCheck) {
            throw new Error('Email not Found')
        }

        var passwordCheck = await bcrypt.compare(password, UserEmailCheck.password)

        if (!passwordCheck) {
            throw new Error('Password does not match')
        }


        token = await jwt.sign(UserEmailCheck.id, 'User')


        res.status(201).json({
            status: 'Success',
            message: 'User Login Successfully',
            token

        })


    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.userUpdate = async (req, res) => {
    try {
        let id = req.params.id
        console.log(id);

        if (!id) {
            throw new Error('Include id in params')
        }

        var UserUpdate = await User.findByIdAndUpdate(id, req.body)

        res.status(200).json({
            status: 'Success',
            message: 'User Data Update Successfully',
            // data : OwnerUpdate
        })
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.userDelete = async (req, res) => {
    try {

        let id = req.params.id

        if (!id) {
            throw new Error('Include id in params')
        }

        var userDelete = await User.findByIdAndDelete(id)
        res.status(200).json({
            status: 'Success',
            message: 'Admin Data Delete Successfully',
            // data : OwnerUpdate
        })


    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.viewAllBox = async (req, res) => {
    try {
        var Boxdata = await Box.find()//projection //password not show

        res.status(200).json({
            status: true,
            data: Boxdata
        })

    }
    catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.getOneBox = async (req, res) => {
    try {

        var box_id = req.params.id
        var Boxdata = await Box.findById(box_id)

        res.status(200).json({
            status: true,
            data: Boxdata
        })
    }
    catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}


exports.getshift = async (req, res) => {
    try {
        const box_id = req.params.id;

        const current_time = new Date();
        const current_hour = current_time.getHours();
        const current_minute = current_time.getMinutes();
        const current_second = current_time.getSeconds();
        const current_millisecond = current_time.getMilliseconds();
        const current_period = current_hour >= 8 && current_hour < 20 ? 'morning' : 'night';

        const box = await Box.findById(box_id, {
            address: 0,
            ownerId: 0,
            createdAt: 0,
            images: 0,
            status: 0,
            updatedAt: 0,
            __v: 0
        });

        if (!box) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Box not found'
            });
        }

        const morningShifts = [
            '8:00AM - 9:00AM', '9:00AM - 10:00AM', '10:00AM - 11:00AM', '11:00AM - 12:00PM',
            '12:00PM - 1:00PM', '1:00PM - 2:00PM', '2:00PM - 3:00PM', '3:00PM - 4:00PM',
            '4:00PM - 5:00PM', '5:00PM - 6:00PM', '6:00PM - 7:00PM', '7:00PM - 8:00PM'
        ];

        const nightShifts = [
            '8:00PM - 9:00PM', '9:00PM - 10:00PM', '10:00PM - 11:00PM', '11:00PM - 12:00AM',
            '12:00AM - 1:00AM', '1:00AM - 2:00AM', '2:00AM - 3:00AM', '3:00AM - 4:00AM',
            '4:00AM - 5:00AM', '5:00AM - 6:00AM', '6:00AM - 7:00AM', '7:00AM - 8:00AM'
        ];

        const resetShiftStatus = (shiftPeriod, shift) => {
            const delay = 3600000 - (current_minute * 60000 + current_second * 1000 + current_millisecond);
            setTimeout(() => {
                box.opning[shiftPeriod][shift] = true;
                box.save().catch(err => console.error('Error resetting shifts:', err));
            }, delay);
        };

        // Update the shift status
        if (current_period === 'morning') {
            for (let i = 8; i < 20; i++) {
                const shiftKey = morningShifts[i - 8];
                if (current_hour >= i) {
                    box.opning.morning[shiftKey] = false;
                    resetShiftStatus('morning', shiftKey);
                }
            }
        } else {
            for (let i = 20; i < 24; i++) {
                const shiftKey = nightShifts[i - 20];
                if (current_hour >= i) {
                    box.opning.night[shiftKey] = false;
                    resetShiftStatus('night', shiftKey);
                }
            }
            for (let i = 0; i < 8; i++) {
                const shiftKey = nightShifts[12 + i];
                if (current_hour >= i || current_hour < 8) {
                    box.opning.night[shiftKey] = false;
                    resetShiftStatus('night', shiftKey);
                }
            }
        }

        await box.save();

        res.status(200).json({
            status: true,
            data: box
        });
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        });
    }
};

exports.bookShift = async (req, res) => {
    try {
        const box_id = req.params.id;
        const { shiftType, timeSlots , newValue } = req.body;


        if (!box_id) {
            throw new Error('Box ID not found');
        }

        if (!['morning', 'night'].includes(shiftType)) {
            throw new Error('Invalid shift type');
        }

        const morningSlots = [
            '8:00AM - 9:00AM', '9:00AM - 10:00AM', '10:00AM - 11:00AM', '11:00AM - 12:00PM',
            '12:00PM - 1:00PM', '1:00PM - 2:00PM', '2:00PM - 3:00PM', '3:00PM - 4:00PM',
            '4:00PM - 5:00PM', '5:00PM - 6:00PM', '6:00PM - 7:00PM', '7:00PM - 8:00PM'
        ];

        const nightSlots = [
            '8:00PM - 9:00PM', '9:00PM - 10:00PM', '10:00PM - 11:00PM', '11:00PM - 12:00AM',
            '12:00AM - 1:00AM', '1:00AM - 2:00AM', '2:00AM - 3:00AM', '3:00AM - 4:00AM',
            '4:00AM - 5:00AM', '5:00AM - 6:00AM', '6:00AM - 7:00AM', '7:00AM - 8:00AM'
        ];

        let validTimeSlots = [];
        if (shiftType === 'morning') {
            validTimeSlots = morningSlots;
        } else if (shiftType === 'night') {
            validTimeSlots = nightSlots;
        }

        // console.log('Valid time slots for shift type:', validTimeSlots); // Debugging line

        if (!Array.isArray(timeSlots) || timeSlots.some(slot => !validTimeSlots.includes(slot))) {
            throw new Error('Invalid time slots for the specified shift type');
        }

        const currentBox = await Box.findById(box_id).lean();
        if (!currentBox) {
            throw new Error('Box not found');
        }

        const updateData = {
            opning: {
                morning: { ...currentBox.opning.morning },
                night: { ...currentBox.opning.night }
            }
        };

        timeSlots.forEach(slot => {
            if (shiftType === 'morning') {
                updateData.opning.morning[slot] = newValue;
            } else if (shiftType === 'night') {
                updateData.opning.night[slot] = newValue;
            }
        });

        const updatedShift = await Box.findByIdAndUpdate(
            box_id,
            { $set: updateData },
            { new: true, fields: { address: 0, ownerId: 0, createdAt: 0, images: 0, status: 0, updatedAt: 0, __v: 0 } }
        );

        // console.log(updateData);

        res.status(200).json({
            status: 'Success',
            message: 'Booking Successfully',
            data: updatedShift
        });

    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        });
    }
}


exports.bookInfo = async (req, res) => {
    try {
        let boxid = req.params.id
        if (!boxid) {
            throw new Error('Box id not found')
        }

        var { name, phone, email, note , time , date } = req.body
        console.log(time);

        if (!name) {
            throw new Error('Name is required')
        }
        if (!phone) {
            throw new Error('phone number is required')
        }
        if (!email) {
            throw new Error('email is required')
        }
        if(!date){
            throw new Error('date is required')
        }
        var booking = new Book({
            boxid,
            name,
            phone,
            email,
            note,
            time,
            date
        })

        await booking.save()

        res.status(200).json({
            status: 'Success',
            message: 'Booking Successfully',
            data: booking
        })
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        });
    }
}


exports.getOrderbybox = async(req,res) => {
    try {
        let box_id = req.params.id
        if (!box_id) {
            throw new Error('Box id not found')
        }
        var book = await Book.find({ boxid: box_id }).populate("boxid", { boxName :1})
        res.status(200).json({
            status: 'Success',
            message: 'get Successfully',
            data: book
        })
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        });
    }
}