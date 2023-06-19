const moment = require("moment");
const Remind = require("../model/remindModel");
const catchAsync = require("../utils/catchAsync");

const set_zero_hari = function (set_hari) {
    for (let i=0;i<=5;i++) {
        set_hari[i] = 0;
    }
}
const set_none_jam = function (set_jam) {
    for (let i=0;i<=5;i++) {
        set_jam[i] = '';
    }
}
const get_hari = function (hari) {
    if (hari == "senin") {
        return 0;
    }
    else if (hari == "selasa") {
        return 1;
    }
    else if (hari == "rabu") {
        return 2;
    }
    else if (hari == "kamis") {
        return 3;
    }
    else if (hari == "jumat") {
        return 4;
    }
    else if (hari == "sabtu") {
        return 5;
    }
    else {
        return -1;
    }
}
const hari_jam = function (string, set_hari, set_jam, temp) {
    const splitText = string.split(/\ \(|\)/);
    splitText.map(index => {
        let i;
        if (index !== '' && index !== undefined) {
            if (index.includes('senin') || index.includes('selasa') || index.includes('rabu') || index.includes('kamis') || index.includes('jumat') || index.includes('sabtu')) {
                const splitindex = index.split(/ /);
                for (i=0;i<splitindex.length;i++) {
                    if (splitindex[i] == '-') {
                        for (let j=get_hari(splitindex[i-1]);j<=get_hari(splitindex[i+1]);j++) {
                            set_hari[j] = 1;
                        }
                    }
                    else if (splitindex[i] == '&') {
                        set_hari[get_hari(splitindex[i+1])] = 1;
                    }
                    else if (splitindex[i] == 'libur') {
                        splitindex.map(idx => {
                            set_hari[get_hari(idx)] = 0;
                        })
                    }
                    else {
                        set_hari[get_hari(splitindex[i])] = 1;
                    }
                }
            }
            else { // kemungkinan akan ada jam yang salah disini
                if (set_hari[temp] == 1) {
                    set_jam[temp] = index;
                }
                else {
                    for (i=0;i<=5;i++) {
                        if (set_hari[i] == 1) { // tambahkan if i != temp jika ada kesalahan jadwal
                            set_jam[i] = index;
                        }
                    }
                }
            }
        }
    })
}
exports.delete_expired_data = catchAsync(async (req, res) => {
    let now = moment(); // ganti ke new Date() jika momemnt() jumping
    await Remind.deleteMany({
        to: {$lt: now}
    });
    res.send(200).json({
        status: 'Success'
    })
})
exports.delete_all = catchAsync(async (req, res) => {
    await Remind.deleteMany();
    res.send(200).json({
        status: 'Success'
    })
})
exports.insert_data = catchAsync(async (req, res) => {
    const ws = await req.body.ws;
    var arrayFiltered = [];
    for (i=2;;i++) {
        let set_hari = [];
        let set_jam = [];
        set_zero_hari(set_hari);
        set_none_jam(set_jam);
        if (ws[`B${i}`] == undefined || ws[`B${i}`] == '') {
            break;
        }
        else {
            const B = ws[`B${i}`]['w'];
            const C = ws[`C${i}`]['w'];
            const D = ws[`D${i}`]['w'];
            const E = ws[`E${i}`]['w'];
            const F = ws[`F${i}`]['w'];
            const G = ws[`G${i}`]['w'];
            let H = ws[`H${i}`] == undefined ? '' : ws[`H${i}`]['w'];
            let I = ws[`I${i}`] == undefined ? '' : ws[`I${i}`]['w'];
            let K = ws[`K${i}`] == undefined ? '' : ws[`K${i}`]['w'];
            H = H.toLowerCase();
            I = I.toLowerCase();
            K = K.toLowerCase();
            hari_jam(H, set_hari, set_jam, 4);
            hari_jam(I, set_hari, set_jam, 4);
            hari_jam(K, set_hari, set_jam, 5);
            arrayFiltered.push({
                nik: B,
                nama: C,
                no_Telp: D,
                from: E,
                to: F,
                shift: G,
                hari_masuk: set_hari,
                jam_masuk: set_jam
            })
        }
    }
    // console.log(arrayFiltered);
    const newData = await Remind.insertMany(arrayFiltered);
    res.status(201).json({
        status: 'success',
        data: {
            data: newData
        }
    })
})