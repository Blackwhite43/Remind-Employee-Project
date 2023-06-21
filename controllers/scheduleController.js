const schedule = require("node-schedule");
const Remind = require("../model/remindModel");
const catchAsync = require("../utils/catchAsync");
const moment = require('moment');
const axios = require("axios");
schedule.scheduleJob(`1 1 * * *`, send_reminder = catchAsync(async (req, res) => {
    console.log("RUN!");
    let today_start = new Date();
    let today_end = new Date();
    today_start.setHours(0, 0, 0, 0);
    today_end.setHours(23, 59, 59, 0);
    const data_masuk = await Remind.aggregate([
        {
            $match: {
                type: {$ne: "Holiday"}, 
                $and: [
                    {tanggal: {$gte: today_start}},
                    {tanggal: {$lte: today_end}}
                ]
            }
        },
        {
            $group: {
                _id: {
                    jam_masuk: "$jam_masuk",
                    tanggal: "$tanggal"
                },
                data: {
                    '$push': '$$ROOT'
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])
    const data_keluar = await Remind.aggregate([
        {
            $match: {
                type: {$ne: "Holiday"}, 
                $and: [
                    {tanggal: {$gte: today_start}},
                    {tanggal: {$lte: today_end}}
                ]
            }
        },
        {
            $group: {
                _id: {
                    jam_keluar: "$jam_keluar",
                    tanggal: "$tanggal"
                },
                data: {
                    '$push': '$$ROOT'
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])
    data_masuk.map(index => {
        let waktu_masuk = moment(`${index["_id"].jam_masuk}`,"HH:mm").subtract(5, "minutes");
        let tanggal = index["_id"].tanggal;
        tanggal = moment(tanggal).format("D-M").split("-");
        index["data"].map(idx => {
            waktu_masuk = moment(waktu_masuk).add(2, "seconds");
            let jam_masuk = waktu_masuk.hours();
            let menit_masuk = waktu_masuk.minutes();
            let detik_masuk = waktu_masuk.seconds();
            schedule.scheduleJob(`${detik_masuk} ${menit_masuk} ${jam_masuk} ${tanggal[0]} ${tanggal[1]} *`, function () {
                axios.post('https://api.watzap.id/v1/send_message', {
                    "api_key": "WJKSGUXNHQVI5K8E",
                    "number_key": "ItYuVRVGTyPLI5G0",
                    "phone_no": `${idx['no_telp']}`,
                    "message": `CLOCK IN-ABSENSI PUKUL ${index["_id"].jam_masuk} HARI INI\n`+
                    `Halo ${idx['nama']}, mohon pastikan anda telah melakukan Absensi Masuk/Clock In hari ini pada mobile attendance.\n\n`+
                    `Terimakasih\n`+
                    `(Layanan Pesan Otomatis)`
                })
                .then(ret => {console.log(ret.data)})
                .catch(err => console.error(err))
            })
        })
    })
    data_keluar.map(index => {
        let waktu_keluar = moment(`${index["_id"].jam_keluar}`,"HH:mm").subtract(2, "minutes");
        let tanggal = index["_id"].tanggal;
        tanggal = moment(tanggal).format("D-M").split("-");
        index["data"].map(idx => {
            waktu_keluar = moment(waktu_keluar).add(2, "seconds");
            let jam_keluar = waktu_keluar.hours();
            let menit_keluar = waktu_keluar.minutes();
            let detik_keluar = waktu_keluar.seconds();
            schedule.scheduleJob(`${detik_keluar} ${menit_keluar} ${jam_keluar} ${tanggal[0]} ${tanggal[1]} *`, function () {
                axios.post('https://api.watzap.id/v1/send_message', {
                    "api_key": "WJKSGUXNHQVI5K8E",
                    "number_key": "ItYuVRVGTyPLI5G0",
                    "phone_no": `${idx['no_telp']}`,
                    "message": `CLOCK OUT-ABSENSI PUKUL ${index["_id"].jam_keluar} HARI INI\n`+
                    `Halo ${idx['nama']}, mohon pastikan anda telah melakukan Absensi keluar/Clock Out hari ini pada mobile attendance.\n\n`+
                    `Terimakasih\n`+
                    `(Layanan Pesan Otomatis)`
                })
                .then(ret => {console.log(ret.data)})
                .catch(err => console.error(err))
            })
        })
    })
}))

exports.send_reminder = catchAsync(async (req, res) => {
    let today_start = new Date();
    let today_end = new Date();
    today_start.setHours(0, 0, 0, 0);
    today_end.setHours(23, 59, 59, 0);
    const data_masuk = await Remind.aggregate([
        {
            $match: {
                no_telp: {$ne: "kosong"},
                type: {$ne: "Holiday"},
                $and: [
                    {tanggal: {$gte: today_start}},
                    {tanggal: {$lte: today_end}}
                ]
            }
        },
        {
            $group: {
                _id: {
                    jam_masuk: "$jam_masuk",
                    tanggal: "$tanggal"
                },
                data: {
                    '$push': '$$ROOT'
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])
    const data_keluar = await Remind.aggregate([
        {
            $match: {
                no_telp: {$ne: "kosong"},
                type: {$ne: "Holiday"},
                $and: [
                    {tanggal: {$gte: today_start}},
                    {tanggal: {$lte: today_end}}
                ]
            }
        },
        {
            $group: {
                _id: {
                    jam_keluar: "$jam_keluar",
                    tanggal: "$tanggal"
                },
                data: {
                    '$push': '$$ROOT'
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])
    data_masuk.map(index => {
        let waktu_masuk = moment(`${index["_id"].jam_masuk}`,"HH:mm").subtract(5, "minutes");
        let tanggal = index["_id"].tanggal;
        tanggal = moment(tanggal).format("D-M").split("-");
        index["data"].map(idx => {
            waktu_masuk = moment(waktu_masuk).add(2, "seconds");
            let jam_masuk = waktu_masuk.hours();
            let menit_masuk = waktu_masuk.minutes();
            let detik_masuk = waktu_masuk.seconds();
            schedule.scheduleJob(`${detik_masuk} ${menit_masuk} ${jam_masuk} ${tanggal[0]} ${tanggal[1]} *`, function () {
                axios.post('https://api.watzap.id/v1/send_message', {
                    "api_key": "WJKSGUXNHQVI5K8E",
                    "number_key": "ItYuVRVGTyPLI5G0",
                    "phone_no": `${idx['no_telp']}`,
                    "message": `CLOCK IN-ABSENSI PUKUL ${index["_id"].jam_masuk} HARI INI\n`+
                    `Halo ${idx['nama']}, mohon pastikan anda telah melakukan Absensi Masuk/Clock In hari ini pada mobile attendance.\n\n`+
                    `Terimakasih\n`+
                    `(Layanan Pesan Otomatis)`
                })
                .then(ret => {console.log(ret.data)})
                .catch(err => console.error(err))
            })
            // console.log(`Masuk: ${jam_masuk}:${menit_masuk}:${detik_masuk}`);
        })
    })
    data_keluar.map(index => {
        let waktu_keluar = moment(`${index["_id"].jam_keluar}`,"HH:mm").subtract(2, "minutes");
        let tanggal = index["_id"].tanggal;
        tanggal = moment(tanggal).format("D-M").split("-");
        index["data"].map(idx => {
            waktu_keluar = moment(waktu_keluar).add(2, "seconds");
            let jam_keluar = waktu_keluar.hours();
            let menit_keluar = waktu_keluar.minutes();
            let detik_keluar = waktu_keluar.seconds();
            schedule.scheduleJob(`${detik_keluar} ${menit_keluar} ${jam_keluar} ${tanggal[0]} ${tanggal[1]} *`, function () {
                axios.post('https://api.watzap.id/v1/send_message', {
                    "api_key": "WJKSGUXNHQVI5K8E",
                    "number_key": "ItYuVRVGTyPLI5G0",
                    "phone_no": `${idx['no_telp']}`,
                    "message": `CLOCK OUT-ABSENSI PUKUL ${index["_id"].jam_keluar} HARI INI\n`+
                    `Halo ${idx['nama']}, mohon pastikan anda telah melakukan Absensi keluar/Clock Out hari ini pada mobile attendance.\n\n`+
                    `Terimakasih\n`+
                    `(Layanan Pesan Otomatis)`
                })
                .then(ret => {console.log(ret.data)})
                .catch(err => console.error(err))
            })
            // console.log(`Jam Keluar: ${index['_id'].jam_keluar}`);
            // console.log(`Keluar: ${jam_keluar}:${menit_keluar}:${detik_keluar}`);
            // console.log(`Tanggal: ${tanggal[0]}-${tanggal[1]}`);
            // console.log(`Nama: ${idx['nama']}`);
            // console.log(`No. Telp: ${idx['no_telp']}\n`);
        })
    })
    res.status(201).json({
        status: 'Success'
    })
})