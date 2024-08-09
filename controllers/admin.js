var Admin = require('../models/Admin/admin.js')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var Box = require('../models/Box-Owner/box.js')
var Owner = require('../models/Box-Owner/owner.js')
var nodemailer = require('nodemailer');
const { default: mongoose } = require('mongoose')

exports.adminRegister = async (req, res) => {
    try {
        var { adminName, email, password } = req.body

        password = await bcrypt.hash(password, 12)

        var AdminData = new Admin({
            adminName,
            email,
            password
        })
        await AdminData.save()
        res.status(200).json({
            status: 'Success',
            message: 'Admin create Successfully',
            data: AdminData
        })

    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.adminLogin = async (req, res) => {
    try {

        var token
        var { email, password } = req.body
        var AdminEmailCheck = await Admin.findOne({ email })

        if (!AdminEmailCheck) {
            throw new Error('Email not Found')
        }

        var passwordCheck = await bcrypt.compare(password, AdminEmailCheck.password)

        if (!passwordCheck) {
            throw new Error('Password does not match')
        }


        token = await jwt.sign(AdminEmailCheck.id, 'Admin')


        res.status(201).json({
            status: 'Success',
            message: 'Admin Login Successfully',
            token

        })


    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.adminUpdate = async (req, res) => {
    try {

        var id = req.params.id
        console.log(id);

        if (!id) {
            throw new Error('Include id in params')
        }

        // var { password } = req.body 
        // console.log(password);

        // req.body.password = await bcrypt.hash(password, 12)

        var AdminUpdate = await Admin.findByIdAndUpdate(id, req.body)

        res.status(200).json({
            status: 'Success',
            message: 'Admin Data Update Successfully',
            // data : OwnerUpdate
        })


    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.adminDelete = async (req, res) => {
    try {

        var id = req.params.id

        if (!id) {
            throw new Error('Include id in params')
        }

        var adminDelete = await Admin.findByIdAndDelete(id)
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

exports.approveBox = async (req, res) => {
    try {
        var id = req.params.id

        if (!id) {
            throw new Error('Include id in params')
        }
        var AprroveBox = await Box.findByIdAndUpdate(id, { status: req.body.status })


        res.status(200).json({
            status: 'Success',
            message: 'status changed successfully',
            // data : OwnerUpdate
        })
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.approveOwner = async (req, res) => {
    try {
        var owner_id = req.params.id

        if (!owner_id) {
            throw new Error('Include id in params')
        }

        var status = req.body.status
        // console.log(status);


        var AprroveOwner = await Owner.findByIdAndUpdate(owner_id, { status: req.body.status })
        // console.log(AprroveOwner.email);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'vivekvaghasiya133@gmail.com',
                pass: 'ktzttryojmptysac'
            }
        });
        let emailContent;

        switch (status) {
            case 'approved':
                emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: black; color: #ffffff;">
            <div style="text-align: center;">
              <img src="https://i.pinimg.com/550x/78/1d/67/781d6783a1465bcfd437146c334f783c.jpg" alt="Amazon" style="width: 200px; margin-bottom: 20px; filter: brightness(150%);">
            </div>
            <h2 style="background-color: #4CAF50; color: white; text-align: center; padding: 10px 0; border-radius: 10px 10px 0 0;">Congratulations!</h2>
            <p style="font-size: 16px; color: #cccccc;">
              Dear Box Cricket Owner,
              <br/><br/>
              Congratulations on becoming a part of our Box Cricket Platform. Your profile has been approved by our team.
            </p>
            <p style="font-size: 16px; color: #cccccc;">
              We are excited to have you onboard and look forward to helping you grow your business.
              <br/><br/>
              Regards,
              <br/>
              The Amazon TeamThe Box Cricket Platform Team
            </p>
          </div>
        `;
                break;
            case 'block':
                emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: black; color: #ffffff;">
            <div style="text-align: center;">
              <img src="https://i.pinimg.com/550x/78/1d/67/781d6783a1465bcfd437146c334f783c.jpg" alt="Amazon" style="width: 200px; margin-bottom: 20px; filter: brightness(150%);">
            </div>
            <h2 style="background-color: #FF5733; color: white; text-align: center; padding: 10px 0; border-radius: 10px 10px 0 0;">Profile Rejected</h2>
            <p style="font-size: 16px; color: #cccccc;">
              Dear Box Cricket Owner,
              <br/><br/>
              We regret to inform you that your account has been temporarily blocked due to a violation of our terms and conditions. Please review our guidelines and contact our support team if you believe this is an error or if you have any questions.
            </p>
            <p style="font-size: 16px; color: #cccccc;">
              If you have any questions or need further assistance, please contact our support team.
              <br/><br/>
              Regards,
              <br/>
              The Box Cricket Platform Team
            </p>
          </div>
        `;
                break;


            case 'Pending':
            default:
                emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: black; color: #ffffff;">
            <div style="text-align: center;">
              <img src="https://i.pinimg.com/550x/78/1d/67/781d6783a1465bcfd437146c334f783c.jpg" alt="Amazon" style="width: 200px; margin-bottom: 20px; filter: brightness(150%);">
            </div>
            <h2 style="background-color: #4CAF50; color: white; text-align: center; padding: 10px 0; border-radius: 10px 10px 0 0;">Application Under Process</h2>
            <p style="font-size: 16px; color: #cccccc;">
              Dear Box Cricket Owner,
              <br/><br/>
              Your application is currently under process. We will complete the verification within the next 48 hours. You will receive an email confirmation once the process is complete.
            </p>
            <p style="font-size: 16px; color: #cccccc;">
              Regards,
              <br/>
              The Box Cricket Platform Team
            </p>
          </div>
        `;
                break;
        }


        var mailOptions = {
            from: 'vivekvaghasiya133@gmail.com',
            to: AprroveOwner.email,
            subject: 'Owner status',
            html: emailContent
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });



        res.status(200).json({
            status: 'Success',
            message: 'Status changed successfully',
            // data : OwnerUpdate
        })
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.getOwners = async (req, res) => {
    try {

        var Ownerdata = await Owner.find()

        res.status(200).json({
            status: true,
            data: Ownerdata
        })

    }
    catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}

exports.getOwnerBox = async (req, res) => {
    try {
        var owner_id = req.params.id

        var Boxdata = await Box.find({ ownerId: owner_id }, { _id: 0 })

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
exports.getBoxbyId = async (req, res) => {
    try {
        var id = req.params.id;

      
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid ID format'
            });
        }

        var Boxdata = await Box.findById(id, { _id: 0 });

        if (!Boxdata) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Box not found'
            });
        }

        res.status(200).json({
            status: true,
            data: Boxdata
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
}


exports.getAllBox = async (req, res) => {
    try {

        var Boxdata = await Box.find()

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

exports.Count_owner = async (req, res) => {

    try {
        var ownerCount = await Owner.find().count()
        res.status(200).json({
            status: true,
            cnt: ownerCount
        })
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }

}

exports.Count_Box = async (req, res) => {
    try {

        var boxCount = await Box.find().count()
        res.status(200).json({
            status: true,
            cnt: boxCount
        })
    } catch (error) {
        res.status(401).json({
            status: 'Failed',
            message: error.message
        })
    }
}



exports.getOwnerbyid = async (req, res) => {
    try {

        var token = req.headers.auth

        if (!token) {
            throw new Error("Token must be provided");
        }
        const decoded = jwt.verify(token, 'Owner');

        if (!decoded) {
            throw new Error("Invalid token");
        }

        var OwnerData = await Owner.findById(decoded, { _id: 0 })
        console.log(OwnerData);

        res.status(200).json({
            status: true,
            data: OwnerData
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
}
exports.getAdminbyid = async (req, res) => {
    try {

        var token = req.headers.admin

        if (!token) {
            throw new Error("Token must be provided");
        }
        const decoded = jwt.verify(token, 'Admin');

        if (!decoded) {
            throw new Error("Invalid token");
        }

        var OwnerData = await Admin.findById(decoded, { _id: 0 })
        console.log(OwnerData);

        res.status(200).json({
            status: true,
            data: OwnerData
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
}

exports.searchIteam = async (req, res) => {
    try {
        const query = req.query.q;
        const search = await Box.find({ boxName: new RegExp(query, 'i') });

        res.status(200).json({
            status: true,
            data: search
        })


    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
}