const Task = require('../../models/Task');
const Response = require('../../libs/response')

module.exports = {
    getList,
    getDataByID,
    createData,
    updateData,
    deleteData,
    getTasksListData
}

async function getList(req, res) {

    try {
        const tasks = await Task.find()
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


async function getDataByID(req, res) {
    try {

        const task = await Task.findById(req.params.id)

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



async function createData(req, res) {

    try {
        let task = new Task({

            taskName: req.body.taskName,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            projectId: req.body.projectId,

        });

        task = await task.save()

        if (!task) return res.send('task not created')

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
        const task = await Task.findByIdAndUpdate(req.params.id, {

            taskName: req.body.taskName,

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


async function deleteData(req, res) {

    try {
        const task = await Task.findByIdAndRemove(req.params.id)

        if (!task) return res.send('task not deleted')

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

async function getTasksListData(req, res) {

    try {
        const task = await Task.aggregate([
            {
                $lookup:
                {
                    from: "subtasks",
                    localField: "taskId",
                    foreignField: "taskId",
                    as: "result"
                }
            },
            {
                $match:
                {
                    projectId: req.params.id
                }
            }
        ])

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
