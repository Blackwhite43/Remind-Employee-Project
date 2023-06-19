const mongoose = require('mongoose');
const Data = require('./dataModel');
const remindSchema = new mongoose.Schema({
    from: {
        type: String
    },
    nik: {
        type: String
    },
    nama: {
        type: String
    },
    no_telp: {
        type: String
    },
    shift: {
        type: String
    },
    type: {
        type: String
    },
    tanggal: {
        type: Date
    },
    jam_masuk: {
        type: String
    },
    jam_keluar: {
        type: String
    }
})

remindSchema.pre('save', async function (next) {
    const update = await Data.findOne({
        nik: this.nik
    });
    this.no_telp = update == null ? "kosong" : update.no_telp;
    next();
})

const Remind = mongoose.model('Remind', remindSchema);
module.exports = Remind;