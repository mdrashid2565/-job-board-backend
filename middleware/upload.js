// 📂 File: backend/middleware/upload.js

const multer = require('multer');
const path = require('path');

// ✅ Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ File filter (PDF, DOC, DOCX)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
