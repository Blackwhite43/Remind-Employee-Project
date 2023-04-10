const express = require('express');
const remindController = require('./controllers/remindController');
const scheduleController = require('./controllers/scheduleController');

const router = express.Router();

router.route('/')
    .post(remindController.insert_data)
    //.get(scheduleController.send_reminder) // hapus bagian ini jika schedule diuncomment
router.route('/expired')
    .delete(remindController.delete_expired_data)
router.route('/all')
    .delete(remindController.delete_all)

module.exports = router;