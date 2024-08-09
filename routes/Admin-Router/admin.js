var express = require('express');

const Admin = require('../../controllers/admin')
var router = express.Router();


router.post('/admin' , Admin.adminRegister)
router.post('/adminlogin' , Admin.adminLogin)
router.put('/admin/:id' , Admin.adminUpdate)
router.delete('/admin/:id' , Admin.adminDelete)
router.put('/approveBox/:id',Admin.approveBox)
router.put('/approveOwner/:id',Admin.approveOwner)
router.get('/getOwner',Admin.getOwners) 
router.get('/getOwnerbyid',Admin.getOwnerbyid) 
router.get('/getAdminbyid',Admin.getAdminbyid) 
router.get('/getAllBox',Admin.getAllBox)
router.get('/getOwnerBox/:id',Admin.getOwnerBox)
router.get('/getBox/:id',Admin.getBoxbyId)
router.get('/ownerCount',Admin.Count_owner)
router.get('/boxCount',Admin.Count_Box)
router.get('/searchIteam/search',Admin.searchIteam)



module.exports = router;
