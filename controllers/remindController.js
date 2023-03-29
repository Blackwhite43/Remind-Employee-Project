const Remind = require("../remindModel");
const catchAsync = require("../utils/catchAsync");
const validator = require('validator')
const string_split = function (string, hari_kerja) {
    const splitText = string.split(/\ \(|\)/);
    splitText.map(index => {
        if (index == '' || index == undefined) {
        }
        else {
            if (index.includes('Senin') || index.includes('Selasa') || index.includes('Rabu') || index.includes('Kamis') || index.includes('Jumat') || index.includes('Sabtu')) {
                hari_kerja.push({
                    hari_biasa: index
                })
            }
            else {
                if (validator.isTime(index) == 0) {
                    hari_kerja.push({
                        jam_kerja: index
                    })
                }
            }
        }
    })
}
exports.get_data = catchAsync(async (req, res) => {
    const ws = await req.body.ws;
    var arrayFiltered = [];
    for (i=3;;i++) {
        if (ws[`A${i}`] == undefined || ws[`A${i}`] == '') {
            break;
        }
        else {
            
            const B = ws[`B${i}`]['w'];
            const C = ws[`C${i}`]['w'];
            const D = ws[`D${i}`]['w'];
            const E = ws[`E${i}`]['w'];
            const F = ws[`F${i}`]['w'];
            const G = ws[`G${i}`]['w'];
            const H = ws[`H${i}`] == undefined ? '' : ws[`H${i}`]['w'];
            let hari_kerja = [];
            /*let jumat = [];
            let sabtu_minggu = [];*/
            const I = ws[`I${i}`] == undefined ? '' : ws[`I${i}`]['w'];
            const J = ws[`J${i}`] == undefined ? '' : ws[`J${i}`]['w'];
            string_split(H, hari_kerja);
            string_split(I, hari_kerja);
            string_split(J, hari_kerja);
            //const K = ws[`K${i}`] == undefined ? '' : ws[`K${i}`]['w'];
            arrayFiltered.push({
                nik: B,
                nama: C,
                no_Telp: D,
                from: E,
                to: F,
                shift: G,
                hari_masuk: hari_kerja
            })
        }
    }
    console.log(arrayFiltered);
    const newData = await Remind.insertMany(arrayFiltered);
    res.status(201).json({
        status: 'success',
        data: {
            data: newData
        }
    })
})