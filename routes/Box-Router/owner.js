var express = require('express');
const Owner = require('../../controllers/owner')
const box = require('../../controllers/box')
var router = express.Router();
var multer = require('multer');
var { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../routes/Box-Router/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'box_images', 
    allowedFormats: ['jpg', 'png'],
    public_id: (req, file) => file.originalname.split('.')[0], 
  },
});

const upload = multer({ storage: storage });

router.post('/owner', Owner.OwnerRegister);
router.post('/ownerlogin', Owner.OwnerLogin);
router.get('/ownerProfile', Owner.getOwnerDetails);
router.put('/owner/:id', Owner.OwnerUpdate);
router.delete('/owner/:id', Owner.OwnerDelete);

// Box router
router.post('/addbox', upload.array('images', 10), box.addBox);
router.put('/updatebox/:id', upload.array('images', 10), box.updateBox);
router.delete('/deletebox/:id', box.removeBox);

router.get('/boxbyowner', box.ownerBox);

module.exports = router;
