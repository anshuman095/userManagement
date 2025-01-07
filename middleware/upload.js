const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/images");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); 
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const isValid = fileTypes.test(path.extname(file.originalname).toLowerCase()) && 
                  fileTypes.test(file.mimetype);

  if (isValid) {
    return cb(null, true);
  }
  cb(new Error("Invalid file type. Only JPEG, JPG, or PNG allowed."), false);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("profile_pic"); 

module.exports = upload;
