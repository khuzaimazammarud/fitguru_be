const multer = require('multer');

const upload = multer({
    // Define storage destination and filename generation logic
    storage: multer.diskStorage({
      destination: './uploads/images', // Adjust based on your storage needs
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