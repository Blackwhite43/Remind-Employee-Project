const mongoose = require('mongoose');
const remindSchema = new mongoose.Schema({
    nik: {
        type: String
    },
    nama: {
        type: String
    },
    no_Telp: {
        type: String
    },
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    shift: {
        type: String
    },
    hari_masuk: {
        type: Array
    }
})

const Remind = mongoose.model('Remind', remindSchema);
module.exports = Remind;