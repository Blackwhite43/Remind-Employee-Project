const Data = require("../model/dataModel");
const catchAsync = require("../utils/catchAsync");
const handler = require("./handlerFactory");

exports.delete_all_data = handler.deteleAll(Data);
exports.get_all_data = catchAsync(async (req, res) => {
    const data = await Data.find();
    res.status(201).json({
        status: "Success",
        data: data
    })
})
exports.create_data = catchAsync(async (req, res) => {
    await Data.deleteMany();
    const data = await Data.insertMany(req.body);
    res.status(201).json({
        status: "Success",
        data: data
    })
})