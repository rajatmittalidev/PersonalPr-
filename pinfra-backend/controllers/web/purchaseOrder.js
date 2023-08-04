const router = require('express').Router();
const PurchaseOrder = require('../../models/PurchaseOrder')
const Response = require('../../libs/response')

module.exports = {
    getList,
    getDataByID,
    createData,
    updateData,
    deleteData
}

async function getList(req, res) {

    try {
        const projects = await PurchaseOrder.find()
        res.send(projects)

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
        const pr = await PurchaseOrder.findById(req.params.id)
        if (!pr) return res.send('No Purchase Order exits')
        res.send(pr)

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
        const newRequest = new PurchaseOrder(req.body);
        const saveRequest = await newRequest.save();
        res.status(200).json(saveRequest);

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
        const updatePR = await PurchaseOrder.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatePR);

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
        const pr = await PurchaseOrder.findByIdAndRemove(req.params.id)
        if (!pr) return res.send('Purchase Order not deleted')
        res.send(pr)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}



