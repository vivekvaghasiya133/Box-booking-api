var express = require('express');
// const { OwnerRegister, OwnerLogin, getOwnerDetails, OwnerUpdate, OwnerDelete } = require('../../controllers/owner');

var express = require('express');
const user = require('../../controllers/user');
var router = express.Router();

/* GET users listing. */
router.post('/login',user.userLogin)
router.post('/register',user.userRegister)
router.put('/UserUpdate',user.userUpdate)
router.delete('/UserDelete',user.userDelete)
router.get('/viewAllBox',user.viewAllBox)

router.get('/viewOneBox/:id',user.getOneBox)

router.get('/getshifts/:id', user.getshift)

router.post('/bookshift/:id', user.bookShift)
router.post('/bookbox/:id', user.bookInfo)
router.get('/getorderbybox/:id', user.getOrderbybox)


module.exports = router;
