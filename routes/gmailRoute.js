const express = require('express');
const router = express.Router();

const { createGmail, getGmails } = require('../controllers/gmailController');

router.post('/', createGmail);
router.get('/', getGmails);

module.exports = router;
