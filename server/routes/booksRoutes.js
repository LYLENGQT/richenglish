const express = require('express')
const router = express.Router()
const {bookStream, bookReindex, getBooks, addBooks} = require('../controller/booksController')
const {
  authenticateToken,
  requireAdmin
} = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

router.use('/uploads/books', express.static(path.join(__dirname, 'uploads', 'books'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
  }
}));

const uploadsDir = path.join(__dirname, 'uploads', 'books');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, unique + ext);
  }
});

const pdfOnly = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter: pdfOnly, limits: { fileSize: 50 * 1024 * 1024 } });

router.use(authenticateToken)

router.route('/').post(requireAdmin, upload.single('file'), addBooks).get(getBooks)
router.post('/reindex', bookReindex)
router.get('/:id/stream', bookStream)


module.exports = router;