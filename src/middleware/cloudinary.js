const { singleFileUpload } = require('./multerConfig');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'diixdbnmz',
  api_key: '874496867221222',
  api_secret: '6fJPlJh8kt-pjMpnOoOit3A1jGM',
});

const cloudinaryUpload = (req, res, next) => {
  singleFileUpload(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    try {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        req.cloudinary = { url: result.secure_url };
      }else {
        req.cloudinary = { url: null };
      } 
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Image upload failed' });
    }
  });
};

module.exports = { cloudinaryUpload }