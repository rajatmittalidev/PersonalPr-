
const MasterSubTask = require('../../models/MasterSubTasks')
const RecentActivity = require('../../models/recentActivity')
const mongoose = require('mongoose')
const Response = require('../../libs/response')
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    getList,
    createData,
    updateData,
    getDetails,
    deleteDetails,
    deleteById
}

async function getList(req, res) {

    try {
        const subTasks = await MasterSubTask.find()
        res.send(subTasks)

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

        const mstaskExits = await MasterSubTask.findOne({ subTaskName: req.body.subTaskName })

        if (mstaskExits) return res.status(400).send({ status: 'faild', message: "this sub activity already exits" })

        let subTask = new MasterSubTask({

            subTaskName: req.body.subTaskName,
            taskId: req.body.taskId,


        });

        subTask = await subTask.save()

        if (!subTask) return res.send('subtask not created')

        let recentActivity = new RecentActivity({

            //activity:project.projectName,
            description: `new sub activity ${subTask.subTaskName} created`

        });

        recentActivity = await recentActivity.save()

        res.send(subTask);

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

        const mstaskExits = await MasterSubTask.findOne({ subTaskName: req.body.subTaskName })

        if (mstaskExits) return res.status(400).send({ status: 'faild', message: "this sub activity already exits" })
        const subTask = await MasterSubTask.findByIdAndUpdate(req.params.id, {

            subTaskName: req.body.subTaskName,
            taskId: req.body.taskId,

        }, { new: true });

        if (!subTask) return res.send('subTask not updated')

        res.send(subTask)

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

        const subTask = await MasterSubTask.findById(req.params.id)

        if (!subTask) return res.send('no subTask exits')

        res.send(subTask)


    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function deleteDetails(req, res) {
    try {
        let kk = []
        for (let single of req.body.selUsers) {
            kk.push(new ObjectId(single))
        }
        console.log(kk)
        let deleteProductsResponse = await MasterSubTask.remove({ _id: { $in: kk } });
        console.log(deleteProductsResponse)


        if (!deleteProductsResponse) return res.send('subTask not deleted')

        res.send(deleteProductsResponse)
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

async function deleteById(req, res) {
    try {
        const subTask = await MasterSubTask.findByIdAndRemove(req.params.id)

        if (!subTask) return res.send('subTask not deleted')

        res.send(subTask)
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


