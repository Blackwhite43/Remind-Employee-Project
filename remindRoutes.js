const express = require('express');
const remindController = require('./controllers/remindController');
const scheduleController = require('./controllers/scheduleController');

const router = express.Router();

router.route('/')
    .post(remindController.insert_data)
    .get(scheduleController.send_reminder)
router.route('/expired')
    .delete(remindController.delete_expired_data)

module.exports = router;