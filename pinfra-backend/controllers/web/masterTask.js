const MasterTask = require('../../models/MasterTasks')
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
        const tasks = await MasterTask.find()
        res.send(tasks)

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

        const mtaskExits = await MasterTask.findOne({ taskName: req.body.taskName })

        if (mtaskExits) return res.status(400).send({ status: 'faild', message: "this activity already exits" })

        let task = new MasterTask({

            taskName: req.body.taskName,

        });

        task = await task.save()

        if (!task) return res.send('task not created')

        let recentActivity = new RecentActivity({

            //activity:project.projectName,
            description: `new activity ${task.taskName} created`

        });

        recentActivity = await recentActivity.save()

        res.send(task);

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

        const mtaskExits = await MasterTask.findOne({ taskName: req.body.taskName })

        if (mtaskExits) return res.status(400).send({ status: 'faild', message: "this activity already exits" })

        const task = await MasterTask.findByIdAndUpdate(req.params.id, {


            taskName: req.body.taskName


        }, { new: true });
        if (!task) return res.send('task not updated')
        res.send(task)

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

        const task = await MasterTask.findById(req.params.id)

        if (!task) return res.send('no task exits')

        res.send(task)


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
        console.log(req.body.selUsers, "kkkk")
        let kk = []
        for (let single of req.body.selUsers) {
            kk.push(new ObjectId(single))
        }
        console.log(kk)
        let deleteProductsResponse = await MasterTask.remove({ _id: { $in: kk } });
        console.log(deleteProductsResponse)


        if (!deleteProductsResponse) return res.send('role not deleted')

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
        const task = await MasterTask.aggregate([
            { "$addFields": { "taskId": { "$toString": "$_id" }}},
            { $lookup:
                {
                    from: "mastersubtasks",
                    localField: "taskId",
                    foreignField: "taskId",
                    as: "result"
                  }
            }
         
        ])
    
        if(!task) return res.send('no task exits')
    
        res.send(task)
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


