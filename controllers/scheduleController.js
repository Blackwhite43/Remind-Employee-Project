const schedule = require("node-schedule");
const Remind = require("../remindModel");
const catchAsync = require("../utils/catchAsync");
const moment = require('moment');
let now = moment();
let today = new Date();
today = moment.weekdays(today);

const get_hari = function (hari) {
    if (hari == "Monday") {
        return 0;
    }
    else if (hari == "Tuesday") {
        return 1;
    }
    else if (hari == "Wednesday") {
        return 2;
    }
    else if (hari == "Thursday") {
        return 3;
    }
    else if (hari == "Friday") {
        return 4;
    }
    else if (hari == "Saturday") {
        return 5;
    }
    else {
        return -1;
    }
}

exports.send_reminder = catchAsync(async function (req, res) {
    const data = await Remind.find({
        to: {$gte: now},
        from: {$lte: now}
    });
    // const no_telp = await Remind.find({}, {
    //     nama: 1, no_Telp: 1
    // })
    // console.log(no_telp);
    data.map(index => {
        if (index['hari_masuk'][get_hari(today)] == 1) {
            const split_jam = index['jam_masuk'][get_hari(today)].split(/\ - |\./);
            let temp_jam = split_jam[0];
            let temp_menit = split_jam[1]-20;
            if (temp_menit < 0) {
                temp_menit = temp_menit + 60;
                temp_jam--;
            }
            schedule.scheduleJob(`${temp_menit} ${temp_jam} * * ${get_hari(today)+1}`, function () {
                console.log(`Halo, ${index['nama']} di Hari ${today} anda masuk jam ${split_jam[0]}.${split_jam[1]} sampai ${split_jam[2]}.${split_jam[3]}`);
                console.log("Jangan lupa buat absen ya")
            })
            //console.log(`Remind saat jam: ${temp_jam}.${temp_menit}`);
        }
    })
    res.status(200).json({
        status: 'success'
    })
})
