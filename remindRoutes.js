const express = require('express');
const remindController = require('./controllers/remindController');

const router = express.Router();

router.route('/')
    .post(remindController.get_data)

module.exports = router;