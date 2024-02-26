const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    // Define allowed file types (adjust as needed)
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
});

const singleFileUpload = upload.single('image');

module.exports = { singleFileUpload }