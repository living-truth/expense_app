const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const { sendMessage } = require('../controllers/chatController');

const router = express.Router();

// Route for text-only messages
router.post('/chat', express.json(), sendMessage);

// Route for file uploads
router.post('/chat-with-files', upload.array('files', 2), sendMessage);
module.exports = router