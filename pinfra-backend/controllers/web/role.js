const router = require('express').Router();
const Role = require('../../models/Role')
const RecentActivity = require('../../models/recentActivity')
const mongoose = require('mongoose')
const Response = require('../../libs/response')
const ObjectId = mongoose.Types.ObjectId;


module.exports = {
    getList,
    getDataByID,
    getDataByRole,
    createData,
    updateData,
    deleteList,
    updatePermData,
    deleteData
}

async function getList(req, res) {

    try {
        const roles = await Role.find()
        res.send(roles)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function getDataByID(req, res) {
    try {
        const role = await Role.findById(req.params.id)

        if (!role) return res.send('no role exits')

        res.send(role)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function getDataByRole(req, res) {
    try {
        const role = await Role.findOne({ role: req.params.role })

        if (!role) return res.send('no role exits')

        res.send(role)

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
        let role = new Role({
            role: req.body.role,
        });

        role = await role.save()

        if (!role) return res.send('role not created')

        let recentActivity = new RecentActivity({
            description: `new role ${role.role} created`

        });

        recentActivity = await recentActivity.save()

        res.send(role);
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
        const role = await Role.findByIdAndUpdate(req.params.id, {
            role: req.body.role
        }, { new: true });

        res.send(role)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function deleteList(req, res) {

    try {
        let kk = []
        for (let single of req.body.selUsers) {
            kk.push(new ObjectId(single))
        }
        let deleteProductsResponse = await Role.remove({ _id: { $in: kk } });

        if (!deleteProductsResponse) return res.send('role not deleted')

        res.send(deleteProductsResponse)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function updatePermData(req, res) {

    try {
        const role = await Role.findOneAndUpdate({ role: req.params.role }, { $set: { dashboard_permissions: req.body.dashboard_permissions } }, { new: true });

        if (!role) return res.send('role not updated')

        res.send(role)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function deleteData(req, res) {

    try {
        const role = await Role.findByIdAndRemove(req.params.id)

        if (!role) return res.send('role not deleted')

        res.send(role)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


