const multer = require('multer');
const path = require('path');

// הגדרות אחסון – שמירת תמונות בתיקייה public/images עם שם ייחודי
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // ודאי שהתיקייה קיימת. אם לא – תצרי אותה
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
