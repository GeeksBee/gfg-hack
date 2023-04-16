const multer = require('multer');
const path = require('path');
const {
  uploadFile,
  getFileStream,
  uploadFileUsingBase64,
} = require('../utils/s3');

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  filefilter,
});

router.post('', [
  upload.single('file'),
  async (req, res) => {
    try {
      // console.log(req, req.body);
      let file = req.file;
      console.log(file);
      if (file) {
        file = await uploadFile(file);
        return res.send(file);
      }
      return res.status(400).json({ message: 'File not found' });
    } catch (err) {
      console.log(err);
      return res.send({ message: err.message });
    }
  },
]);

router.post('/base64', async (req, res) => {
  try {
    const { base64 } = req.body;
    console.log(base64);
    const file = await uploadFileUsingBase64(base64);
    return res.send(file);
  } catch (err) {
    console.log(err);
    return res.send({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = getFileStream(req.params.id);
    data.on('error', (err) => {
      if (err) return res.json({ message: 'Invalid Url' });
    });
    data.pipe(res);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
