const schedule = require("node-schedule");
const Remind = require("../remindModel");
const catchAsync = require("../utils/catchAsync");
const moment = require('moment');
const axios = require("axios");

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

const hari_ini = function (hari) {
    if (hari == "Monday") {
        return "Senin";
    }
    else if (hari == "Tuesday") {
        return "Selasa";
    }
    else if (hari == "Wednesday") {
        return "Rabu";
    }
    else if (hari == "Thursday") {
        return "Kamis";
    }
    else if (hari == "Friday") {
        return "Jumat";
    }
    else if (hari == "Saturday") {
        return "Sabtu";
    }
    else {
        return -1;
    }
}
schedule.scheduleJob(`0 0 * * *`, send_reminder = catchAsync(async function (req, res) { // uncomment schedule jika ingin send_reminder auto berjalan tiap jam 00.00
    let now = new Date();
    let today = new Date(); // pakai moment hari jumping
    today = moment.weekdays(today);
    const data = await Remind.aggregate([
        {
            '$addFields': {
                'currentDay': {
                    '$arrayElemAt': ['$hari_masuk', get_hari(today)]
                }, 
                'currentJamMasuk': {
                    '$arrayElemAt': ['$jam_masuk', get_hari(today)]
                }
            }
        },
        {
            '$match': {
                'currentDay': 1,
                'to': {$gte: now},
                'from': {$lte: now}
            }
        },
        {
            '$group': {
                '_id': '$currentJamMasuk',
                'data': {
                    '$push': '$$ROOT'
                }
            }
        },
        {
            '$sort': {
                '_id': 1
            }
        }
    ])
    data.map(index => {
        const split_jam_masuk = index['_id'].split(/\ - /);
        let time_masuk = moment(`${split_jam_masuk[0]}`,"HH:mm"); // Input time masuk
        let time_pulang = moment(`${split_jam_masuk[1]}`,"HH:mm"); // Input time pulang
        time_masuk = moment(time_masuk).subtract(15, "minute");
        //time_pulang = moment(time_pulang).subtract(3, "minute");
        index['data'].map(idx => {
            time_masuk = moment(time_masuk).add(3, "seconds");
            let menit_masuk = time_masuk.minutes();
            let jam_masuk = time_masuk.hours();
            let detik_masuk = time_masuk.seconds();
            schedule.scheduleJob(`${detik_masuk} ${menit_masuk} ${jam_masuk} * * ${get_hari(today)+1}`, function () {
                axios.post('https://api.watzap.id/v1/send_message', {
                    "api_key": "WJKSGUXNHQVI5K8E",
                    "number_key": "TnCXgkjx6MLWXVzx",
                    "phone_no": `${idx['no_Telp']}`,
                    "message": `CLOCK IN-ABSENSI PUKUL ${split_jam_masuk[0]} HARI ${hari_ini(today).toUpperCase()}\n`+
                    `Halo ${idx['nama']}, mohon pastikan anda telah melakukan Absensi Pulang/Clock Out hari ini pada mobile attendance.\n\n`+
                    `Terimakasih\n`+
                    `(Layanan Pesan Otomatis)`
                })
                .then(ret => {console.log(ret.data)})
                .catch(err => console.error(err))
            })
            
            time_pulang = moment(time_pulang).add(3, "seconds");
            let menit_pulang = time_pulang.minutes();
            let jam_pulang = time_pulang.hours();
            let detik_pulang = time_pulang.seconds();
            schedule.scheduleJob(`${detik_pulang} ${menit_pulang} ${jam_pulang} * * ${get_hari(today)+1}`, function () {
                axios.post('https://api.watzap.id/v1/send_message', {
                    "api_key": "WJKSGUXNHQVI5K8E",
                    "number_key": "TnCXgkjx6MLWXVzx",
                    "phone_no": `${idx['no_Telp']}`,
                    "message": `CLOCK OUT-ABSENSI PUKUL ${split_jam_masuk[1]} HARI ${hari_ini(today).toUpperCase()}\n`+
                    `Halo ${idx['nama']}, mohon pastikan anda telah melakukan Absensi Pulang/Clock Out hari ini pada mobile attendance.\n\n`+
                    `Terimakasih\n`+
                    `(Layanan Pesan Otomatis)`
                })
                .then(ret => {console.log(ret.data)})
                .catch(err => console.error(err))
            })
        })
    })
    res.status(200).json({
        status: 'Success'
    })
}))