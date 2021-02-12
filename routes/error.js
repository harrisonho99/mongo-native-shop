const express = require('express');
const router = express.Router();
const errorController = require('../controllers/error').errorOccured;
router.get('/error', errorController);
module.exports = router;
