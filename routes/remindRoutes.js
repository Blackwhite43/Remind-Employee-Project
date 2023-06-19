const express = require('express');
const remindController = require('../controllers/remindController');
const scheduleController = require('../controllers/scheduleController');

const router = express.Router();

router.route('/')
    .get(remindController.insert_data)
    .delete(remindController.delete_data)
    //.get(scheduleController.send_reminder) // hapus bagian ini jika schedule diuncomment
router.route('/send')
    .get(scheduleController.send_reminder)
router.route('/data')
    .get(remindController.get_data)

module.exports = router;