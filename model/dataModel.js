const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
    nik: {
        type: String
    },
    no_telp: {
        type: String
    }
})

const Data = mongoose.model("Data", dataSchema);
module.exports = Data;