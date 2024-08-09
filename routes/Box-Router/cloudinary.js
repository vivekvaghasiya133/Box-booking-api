const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dwh31phpu',
    api_key: '891146272822555',
    api_secret: 'dKEGBWYtqa-eY1wvWg_LrsuC-rk',
});

module.exports = cloudinary;
