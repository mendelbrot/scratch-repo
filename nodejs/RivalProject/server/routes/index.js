const express = require("express");
const router = express.Router();

router.use('/api', require('./api'));
router.use('/uploads', require('./uploads'));

module.exports = router;