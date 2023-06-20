const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const Remind = require("../model/remindModel");
const moment  = require("moment");
const schedule = require("node-schedule");
schedule.scheduleJob(`1 0 * * *`, insert_data = catchAsync(async (req, res) => {
    let today = moment().format("DD-MMM-YYYY");
    let data_shift = [];
    const data_cls = await axios.get(`http://139.255.210.67:8998/api/Workshifts/getscheduledetail/?companyCode=cls&startDate=${today}&endDate=${today}`);
    const data_asp = await axios.get(`http://139.255.210.67:8998/api/Workshifts/getscheduledetail/?companyCode=asp&startDate=${today}&endDate=${today}`);
    const data_iii = await axios.get(`http://139.255.210.67:8998/api/Workshifts/getscheduledetail/?companyCode=iii&startDate=${today}&endDate=${today}`);
    data_cls.data.data.map(data => {
        if (data.nik == "01002" || data.nik == "02002") {
            
        }
        else {
            data_shift.push({
                from: "CLS", 
                nik: data.nik,
                nama: data.name,
                shift: data.wsCode,
                type: data.workdayType,
                tanggal: data.date,
                jam_masuk: data.schIn,
                jam_keluar: data.schOut
            })
        }
    })
    data_asp.data.data.map(data => {
        if (data.nik == "01002" || data.nik == "02002") {

        }
        else {
            data_shift.push({
                from: "CLS", 
                nik: data.nik,
                nama: data.name,
                shift: data.wsCode,
                type: data.workdayType,
                tanggal: data.date,
                jam_masuk: data.schIn,
                jam_keluar: data.schOut
            })
        }
    })
    data_iii.data.data.map(data => {
        if (data.nik == "01002" || data.nik == "02002") {

        }
        else {
            data_shift.push({
                from: "CLS", 
                nik: data.nik,
                nama: data.name,
                shift: data.wsCode,
                type: data.workdayType,
                tanggal: data.date,
                jam_masuk: data.schIn,
                jam_keluar: data.schOut
            })
        }
    })
    const data = await Remind.create(data_shift);
    res.status(201).json({
        status: 'Success',
        total: data_shift.length,
        data: data
    })
}))

exports.insert_data = catchAsync(async (req, res) => {
    let today = moment().format("DD-MMM-YYYY");
    let data_shift = [];
    const data_cls = await axios.get(`http://139.255.210.67:8998/api/Workshifts/getscheduledetail/?companyCode=cls&startDate=${today}&endDate=${today}`);
    const data_asp = await axios.get(`http://139.255.210.67:8998/api/Workshifts/getscheduledetail/?companyCode=asp&startDate=${today}&endDate=${today}`);
    const data_iii = await axios.get(`http://139.255.210.67:8998/api/Workshifts/getscheduledetail/?companyCode=iii&startDate=${today}&endDate=${today}`);
    data_cls.data.data.map(data => {
        if (data.nik == "01002" || data.nik == "02002") {
            
        }
        else {
            data_shift.push({
                from: "CLS", 
                nik: data.nik,
                nama: data.name,
                shift: data.wsCode,
                type: data.workdayType,
                tanggal: data.date,
                jam_masuk: data.schIn,
                jam_keluar: data.schOut
            })
        }
    })
    data_asp.data.data.map(data => {
        if (data.nik == "01002" || data.nik == "02002") {

        }
        else {
            data_shift.push({
                from: "CLS", 
                nik: data.nik,
                nama: data.name,
                shift: data.wsCode,
                type: data.workdayType,
                tanggal: data.date,
                jam_masuk: data.schIn,
                jam_keluar: data.schOut
            })
        }
    })
    data_iii.data.data.map(data => {
        if (data.nik == "01002" || data.nik == "02002") {

        }
        else {
            data_shift.push({
                from: "CLS", 
                nik: data.nik,
                nama: data.name,
                shift: data.wsCode,
                type: data.workdayType,
                tanggal: data.date,
                jam_masuk: data.schIn,
                jam_keluar: data.schOut
            })
        }
    })
    const data = await Remind.create(data_shift);
    res.status(201).json({
        status: 'Success',
        total: data_shift.length,
        data: data
    })
})

exports.get_data = catchAsync(async (req, res) => {
    let today_start = new Date();
    let today_end = new Date();
    today_start.setHours(0, 0, 0, 0);
    today_end.setHours(23, 59, 59, 0);
    const data = await Remind.find({
        $and: [
            {tanggal: {$gte: today_start}},
            {tanggal: {$lte: today_end}}
        ]
    });
    res.status(201).json({
        status: "Success",
        total: data.length,
        data: data
    })
})

exports.delete_data = catchAsync(async (req, res) => {
    await Remind.deleteMany();
    res.status(201).json({
        status: 'Success'
    })
})