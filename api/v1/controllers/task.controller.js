const Task = require("../models/task.model");
const paginationHelper = require("../../helpers/pagination");
const searchHelper = require("../../helpers/search");
// Get /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        $or: [
            { createdBy: req.user.id },
            { listUser: req.user.id }
        ],
        deleted: false,

    };
    if (req.query.status) find.status = req.query.status;
    //Het bo loc
    // Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    const countTask = await Task.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItem: 2,
    }, req.query, countTask)
    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) sort[req.query.sortKey] = req.query.sortValue;
    const task = await Task.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skipItem);
    res.json(task);
}
module.exports.detail = async (req, res) => {
    const _id = req.params.id;

    const task = await Task.findOne({
        _id,
        deleted: false,
    }).select('title status content');
    res.json(task);
}
module.exports.changeStatus = async (req, res) => {
    try {
        console.log(req.params.id, req.body);
        const id = req.params.id;
        const status = req.body.status;
        await Task.updateOne({ _id: id, }, { status: status, });

        res.json({
            code: 200,
            message: "Cap nhat trang thai thanh cong"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cap nhat trang thai that bai"
        });
    }
}
module.exports.changeMulti = async (req, res) => {
    try {
        console.log(req.body);
        const { ids, key, value } = req.body;
        switch (key) {
            case "status":
                await Task.updateMany({ _id: { $in: ids } }, { status: value, });
                res.json({
                    code: 200,
                    message: "Cap nhat  thanh cong"
                });
                break;
            case "deleted":
                await Task.updateMany({ _id: { $in: ids } }, { deleted: true, });
                res.json({
                    code: 200,
                    message: "xóa  thanh cong"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Cap nhat that bai"
                });
                break;
        }

    } catch (error) {
        res.json({
            code: 400,
            message: "Cap nhat that bai"
        });
    }
}
//Create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const task = new Task(req.body);
        const data = await task.save();
        res.json({
            code: 200,
            message: "Tao moi thanh cong",
            data: task
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tao moi that bai"
        });
    }
}
//Edit
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            message: "Cap nhat thanh cong",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cap nhat that bai"
        });
    }
}

//Delete
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({ _id: id }, { deleted: true });
        res.json({
            code: 200,
            message: "Xoa thanh cong",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xoa that bai"
        });
    }
}