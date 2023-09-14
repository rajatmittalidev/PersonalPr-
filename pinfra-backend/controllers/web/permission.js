const Permission = require('../../models/Permission')
const RecentActivity = require('../../models/recentActivity')

const mongoose = require('mongoose')
const Response = require('../../libs/response')
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    getList,
    createData,
    updateData,
    getDetails,
    deleteById
}

async function getList(req, res) {

    try {
        const permissions = await Permission.find()
        res.send(permissions)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function getDetails(req, res) {

    try {

        const permission = await Permission.findById(req.params.id);
        if (!permission) return res.send('no permission exits');
        res.send(permission);

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}



async function createData(req, res) {

    try {

        let permission = new Permission({
            permission: req.body.permission,
        });
        permission = await permission.save();
        if (!permission) return res.send('permission not created')
        res.send(permission);

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}
async function updateData(req, res) {

    try {
        const permission = await Permission.findByIdAndUpdate(req.params.id, {
            permission: req.body.permission,
        }, { new: true });
        if (!permission) return res.send('permission not updated')
        res.send(permission)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}



async function deleteById(req, res) {
    try {
        const permission = await Permission.findByIdAndRemove(req.params.id)

        if(!permission) return res.send('permission not deleted')
     
        res.send(permission)
    }
    catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}




