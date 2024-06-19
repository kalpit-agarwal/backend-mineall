import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: "./public/images/",
  filename: function (req, file, cb) {
    const name = path.basename(
      file.originalname,
      path.extname(file.originalname)
    ); // get the name without extension
    cb(null, name + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,

  // fileFilter: function (req, file, cb) {
  //   checkFileType(file, cb);
  // },
}).single("photo");

// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

export default upload;
