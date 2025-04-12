import multer from "multer";
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const mimeTypes = ["image/jpeg", "image/png"];
  if (!mimeTypes.includes(file.mimetype)) {
    cb(new Error("Unsupported File Type"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: fileFilter,
});
export default upload;
