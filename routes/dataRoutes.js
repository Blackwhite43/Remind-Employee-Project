const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

router.route('/')
    .get(dataController.get_all_data)
    .delete(dataController.delete_all_data)
    .post(dataController.create_data)
    //.get(scheduleController.send_reminder) // hapus bagian ini jika schedule diuncomment

module.exports = router;